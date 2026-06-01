const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "aisybina_dev_secret";
const UPLOAD_DIR = path.join(__dirname, "uploads-aisybina");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "aisybina_export",
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error("Only image files are allowed"), ok);
  },
});

const uploadProductImages = upload.array("images", 12);

const sanitize = (str) =>
  typeof str === "string" ? str.trim().replace(/[<>]/g, "") : str;

const sanitizeHtml = (html) => {
  if (typeof html !== "string") return html;
  return html
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
};

const parseJsonField = (val, fallback = []) => {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

const toImageUrl = (filename) =>
  filename ? `/uploads/${path.basename(filename)}` : null;

const deleteImageFile = (filename) => {
  if (!filename) return;
  const fp = path.join(UPLOAD_DIR, path.basename(filename));
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
};

async function fetchImagesMap(productIds) {
  if (!productIds.length) return {};
  const [rows] = await pool.query(
    `SELECT id, product_id, image, sort_order FROM product_images
     WHERE product_id IN (?) ORDER BY sort_order ASC, id ASC`,
    [productIds]
  );
  const map = {};
  for (const row of rows) {
    if (!map[row.product_id]) map[row.product_id] = [];
    map[row.product_id].push({
      id: row.id,
      image: toImageUrl(row.image),
      sort_order: row.sort_order,
    });
  }
  return map;
}

async function fetchSeriesMap(productIds, activeOnly = false) {
  if (!productIds.length) return {};
  let sql = `SELECT id, product_id, name, description, sort_order, is_active
     FROM product_series WHERE product_id IN (?)`;
  if (activeOnly) sql += " AND is_active = 1";
  sql += " ORDER BY sort_order ASC, id ASC";
  const [rows] = await pool.query(sql, [productIds]);
  const map = {};
  for (const row of rows) {
    if (!map[row.product_id]) map[row.product_id] = [];
    map[row.product_id].push({
      id: row.id,
      name: row.name,
      description: row.description,
      sort_order: row.sort_order,
      is_active: !!row.is_active,
    });
  }
  return map;
}

function mapProductWithRelations(row, images = [], series = []) {
  const gallery = images.length
    ? images
    : row.image
      ? [{ id: null, image: toImageUrl(row.image), sort_order: 0 }]
      : [];
  return {
    ...row,
    image: gallery[0]?.image || toImageUrl(row.image) || null,
    images: gallery,
    series,
  };
}

async function saveProductImages(productId, files, sortStart = 0) {
  if (!files?.length) return;
  let order = sortStart;
  for (const file of files) {
    await pool.query(
      `INSERT INTO product_images (product_id, image, sort_order) VALUES (?, ?, ?)`,
      [productId, file.filename, order++]
    );
  }
  const [first] = await pool.query(
    `SELECT image FROM product_images WHERE product_id = ? ORDER BY sort_order, id LIMIT 1`,
    [productId]
  );
  if (first.length) {
    await pool.query(`UPDATE products SET image = ? WHERE id = ?`, [
      path.basename(first[0].image),
      productId,
    ]);
  }
}

async function syncProductSeries(productId, seriesList) {
  const [existing] = await pool.query(
    `SELECT id FROM product_series WHERE product_id = ?`,
    [productId]
  );
  const keepIds = [];
  let order = 0;
  for (const item of seriesList) {
    const name = sanitize(item.name);
    if (!name) continue;
    const desc = item.description ? sanitizeHtml(String(item.description)) : null;
    const active =
      item.is_active === "0" || item.is_active === 0 || item.is_active === false
        ? 0
        : 1;
    if (item.id && existing.some((e) => e.id === Number(item.id))) {
      await pool.query(
        `UPDATE product_series SET name=?, description=?, sort_order=?, is_active=? WHERE id=? AND product_id=?`,
        [name, desc, order++, active, item.id, productId]
      );
      keepIds.push(Number(item.id));
    } else {
      const [ins] = await pool.query(
        `INSERT INTO product_series (product_id, name, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?)`,
        [productId, name, desc, order++, active]
      );
      keepIds.push(ins.insertId);
    }
  }
  const toDelete = existing.filter((e) => !keepIds.includes(e.id)).map((e) => e.id);
  if (toDelete.length) {
    await pool.query(`DELETE FROM product_series WHERE id IN (?)`, [toDelete]);
  }
}

const paginationMeta = (page, limit, total) => ({
  page: Number(page),
  limit: Number(limit),
  total: Number(total),
  totalPages: Math.ceil(total / limit) || 1,
});

const parseListQuery = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = [10, 25, 50, 100].includes(parseInt(query.limit, 10))
    ? parseInt(query.limit, 10)
    : 10;
  const search = sanitize(query.search || "");
  const sort = sanitize(query.sort || "created_at");
  const order = query.order === "asc" ? "ASC" : "DESC";
  const filter = sanitize(query.filter || query.status || "");
  const category = sanitize(query.category || query.category_id || "");
  const offset = (page - 1) * limit;
  return { page, limit, search, sort, order, filter, category, offset };
};

const allowedSort = {
  products: ["id", "name", "sort_order", "created_at", "updated_at"],
  categories: ["id", "title", "sort_order", "created_at"],
  inquiries: ["id", "name", "email", "status", "created_at"],
};

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.query(
      "SELECT id, name, email FROM admins WHERE id = ? LIMIT 1",
      [decoded.id]
    );
    if (!rows.length) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.admin = rows[0];
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

async function ensureAdmin() {
  const [rows] = await pool.query("SELECT id FROM admins LIMIT 1");
  if (rows.length) return;
  const email = process.env.ADMIN_EMAIL || "admin@aisybinaexport.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
    ["Administrator", email, hash]
  );
  console.log(`Default admin created: ${email}`);
}

// ——— Auth ———
app.post("/api/auth/login", async (req, res) => {
  try {
    const email = sanitize(req.body.email)?.toLowerCase();
    const password = req.body.password;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }
    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE email = ? LIMIT 1",
      [email]
    );
    if (!rows.length) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: rows[0].id, email: rows[0].email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      success: true,
      data: {
        token,
        admin: { id: rows[0].id, name: rows[0].name, email: rows[0].email },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ success: true, data: req.admin });
});

// ——— Public catalog ———
app.get("/api/catalog", async (_req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT id, slug, title, short_title AS shortTitle, tagline, description, highlights, sort_order
       FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`
    );
    const [products] = await pool.query(
      `SELECT p.id, p.category_id, p.name, p.description, p.image, p.sort_order,
              c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.is_active = 1 AND c.is_active = 1
       ORDER BY p.sort_order ASC, p.id ASC`
    );
    const productIds = products.map((p) => p.id);
    const imagesMap = await fetchImagesMap(productIds);
    const seriesMap = await fetchSeriesMap(productIds, true);
    const data = categories.map((cat) => {
      let highlights = [];
      try {
        highlights =
          typeof cat.highlights === "string"
            ? JSON.parse(cat.highlights)
            : cat.highlights || [];
      } catch {
        highlights = [];
      }
      return {
        id: cat.slug,
        slug: cat.slug,
        title: cat.title,
        shortTitle: cat.shortTitle,
        tagline: cat.tagline,
        description: cat.description,
        highlights,
        items: products
          .filter((p) => p.category_id === cat.id)
          .map((p) => {
            const mapped = mapProductWithRelations(
              p,
              imagesMap[p.id] || [],
              seriesMap[p.id] || []
            );
            return {
              id: p.id,
              name: p.name,
              description: p.description,
              image: mapped.image,
              images: mapped.images,
              series: mapped.series,
              category: cat.slug,
            };
          }),
      };
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ——— Categories ———
app.get("/api/categories", async (req, res) => {
  try {
    const { page, limit, search, sort, order, filter, offset } =
      parseListQuery(req.query);
    const sortCol = allowedSort.categories.includes(sort) ? sort : "sort_order";
    const params = [];
    let where = "WHERE 1=1";
    if (req.query.active_only === "1" || !req.headers.authorization) {
      where += " AND is_active = 1";
    }
    if (filter === "active") where += " AND is_active = 1";
    if (filter === "inactive") where += " AND is_active = 0";
    if (search) {
      where += " AND (title LIKE ? OR short_title LIKE ? OR slug LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM categories ${where}`,
      params
    );
    const total = countRows[0].total;
    const [rows] = await pool.query(
      `SELECT * FROM categories ${where} ORDER BY ${sortCol} ${order} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    res.json({
      success: true,
      data: rows.map((r) => ({
        ...r,
        highlights:
          typeof r.highlights === "string"
            ? JSON.parse(r.highlights || "[]")
            : r.highlights,
      })),
      pagination: paginationMeta(page, limit, total),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/categories/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    const row = rows[0];
    row.highlights =
      typeof row.highlights === "string"
        ? JSON.parse(row.highlights || "[]")
        : row.highlights;
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/categories", authMiddleware, async (req, res) => {
  try {
    const { slug, title, short_title, tagline, description, highlights, sort_order, is_active } =
      req.body;
    if (!slug || !title || !short_title) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }
    const [result] = await pool.query(
      `INSERT INTO categories (slug, title, short_title, tagline, description, highlights, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitize(slug),
        sanitize(title),
        sanitize(short_title),
        sanitize(tagline),
        sanitize(description),
        JSON.stringify(highlights || []),
        sort_order ?? 0,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
      ]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Slug already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/categories/:id", authMiddleware, async (req, res) => {
  try {
    const { slug, title, short_title, tagline, description, highlights, sort_order, is_active } =
      req.body;
    await pool.query(
      `UPDATE categories SET slug=?, title=?, short_title=?, tagline=?, description=?, highlights=?, sort_order=?, is_active=? WHERE id=?`,
      [
        sanitize(slug),
        sanitize(title),
        sanitize(short_title),
        sanitize(tagline),
        sanitize(description),
        JSON.stringify(highlights || []),
        sort_order ?? 0,
        is_active ? 1 : 0,
        req.params.id,
      ]
    );
    res.json({ success: true, message: "Updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/categories/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ——— Products ———
app.get("/api/products", async (req, res) => {
  try {
    const { page, limit, search, sort, order, filter, category, offset } =
      parseListQuery(req.query);
    const sortCol = allowedSort.products.includes(sort) ? sort : "created_at";
    const params = [];
    let where = "WHERE 1=1";
    const publicOnly = !req.headers.authorization?.startsWith("Bearer ");
    if (publicOnly || filter === "active") where += " AND p.is_active = 1";
    if (filter === "inactive") where += " AND p.is_active = 0";
    if (category) {
      if (/^\d+$/.test(category)) {
        where += " AND p.category_id = ?";
        params.push(category);
      } else {
        where += " AND c.slug = ?";
        params.push(category);
      }
    }
    if (search) {
      where += " AND (p.name LIKE ? OR p.description LIKE ? OR c.title LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM products p JOIN categories c ON c.id = p.category_id ${where}`,
      params
    );
    const total = countRows[0].total;
    const [rows] = await pool.query(
      `SELECT p.*, c.slug AS category_slug, c.title AS category_title, c.short_title AS category_short_title
       FROM products p JOIN categories c ON c.id = p.category_id
       ${where} ORDER BY p.${sortCol} ${order} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const ids = rows.map((r) => r.id);
    const imagesMap = await fetchImagesMap(ids);
    const seriesMap = await fetchSeriesMap(ids);
    res.json({
      success: true,
      data: rows.map((r) =>
        mapProductWithRelations(r, imagesMap[r.id] || [], seriesMap[r.id] || [])
      ),
      pagination: paginationMeta(page, limit, total),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const isAdmin = req.headers.authorization?.startsWith("Bearer ");
    const [rows] = await pool.query(
      `SELECT p.*, c.slug AS category_slug, c.title AS category_title,
              c.short_title AS category_short_title
       FROM products p
       JOIN categories c ON c.id = p.category_id WHERE p.id = ?`,
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    const row = rows[0];
    if (!isAdmin && !row.is_active) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    const imagesMap = await fetchImagesMap([row.id]);
    const seriesMap = await fetchSeriesMap([row.id], !isAdmin);
    res.json({
      success: true,
      data: mapProductWithRelations(
        row,
        imagesMap[row.id] || [],
        seriesMap[row.id] || []
      ),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/products", authMiddleware, uploadProductImages, async (req, res) => {
  try {
    const { category_id, name, description, sort_order, is_active, series } = req.body;
    if (!category_id || !name) {
      return res.status(400).json({ success: false, message: "Category and name required" });
    }
    const [result] = await pool.query(
      `INSERT INTO products (category_id, name, description, image, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        sanitize(name),
        sanitizeHtml(description || ""),
        null,
        sort_order ?? 0,
        is_active === "0" || is_active === 0 || is_active === false ? 0 : 1,
      ]
    );
    const productId = result.insertId;
    await saveProductImages(productId, req.files || []);
    await syncProductSeries(productId, parseJsonField(series, []));
    res.status(201).json({ success: true, data: { id: productId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/products/:id", authMiddleware, uploadProductImages, async (req, res) => {
  try {
    const { category_id, name, description, sort_order, is_active, series, remove_image_ids } =
      req.body;
    const productId = req.params.id;
    const [existing] = await pool.query("SELECT id FROM products WHERE id = ?", [productId]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const removeIds = parseJsonField(remove_image_ids, []);
    if (removeIds.length) {
      const [imgs] = await pool.query(
        `SELECT id, image FROM product_images WHERE product_id = ? AND id IN (?)`,
        [productId, removeIds]
      );
      for (const img of imgs) deleteImageFile(img.image);
      await pool.query(`DELETE FROM product_images WHERE product_id = ? AND id IN (?)`, [
        productId,
        removeIds,
      ]);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM product_images WHERE product_id = ?`,
      [productId]
    );
    await saveProductImages(productId, req.files || [], countRows[0].total);

    await pool.query(
      `UPDATE products SET category_id=?, name=?, description=?, sort_order=?, is_active=? WHERE id=?`,
      [
        category_id,
        sanitize(name),
        sanitizeHtml(description || ""),
        sort_order ?? 0,
        is_active === "0" || is_active === 0 || is_active === false ? 0 : 1,
        productId,
      ]
    );

    await syncProductSeries(productId, parseJsonField(series, []));

    const [first] = await pool.query(
      `SELECT image FROM product_images WHERE product_id = ? ORDER BY sort_order, id LIMIT 1`,
      [productId]
    );
    await pool.query(`UPDATE products SET image = ? WHERE id = ?`, [
      first.length ? path.basename(first[0].image) : null,
      productId,
    ]);

    res.json({ success: true, message: "Updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/products/:id", authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;
    const [imgs] = await pool.query(`SELECT image FROM product_images WHERE product_id = ?`, [
      productId,
    ]);
    for (const img of imgs) deleteImageFile(img.image);
    const [row] = await pool.query("SELECT image FROM products WHERE id = ?", [productId]);
    if (row[0]?.image) deleteImageFile(row[0].image);
    await pool.query("DELETE FROM products WHERE id = ?", [productId]);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ——— Contact ———
app.post("/api/contact/inquiry", async (req, res) => {
  try {
    const { name, email, company, productInterest, message } = req.body;
    if (!sanitize(name) || !sanitize(email) || !sanitize(message)) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    await pool.query(
      `INSERT INTO contact_inquiries (name, email, company, product_interest, message)
       VALUES (?, ?, ?, ?, ?)`,
      [
        sanitize(name),
        sanitize(email).toLowerCase(),
        sanitize(company),
        sanitize(productInterest),
        sanitize(message),
      ]
    );
    res.status(201).json({ success: true, message: "Inquiry submitted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/contact/inquiries", authMiddleware, async (req, res) => {
  try {
    const { page, limit, search, sort, order, filter, offset } =
      parseListQuery(req.query);
    const sortCol = allowedSort.inquiries.includes(sort) ? sort : "created_at";
    const params = [];
    let where = "WHERE 1=1";
    if (["new", "read", "replied"].includes(filter)) {
      where += " AND status = ?";
      params.push(filter);
    }
    if (search) {
      where += " AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM contact_inquiries ${where}`,
      params
    );
    const total = countRows[0].total;
    const [rows] = await pool.query(
      `SELECT * FROM contact_inquiries ${where} ORDER BY ${sortCol} ${order} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    res.json({
      success: true,
      data: rows,
      pagination: paginationMeta(page, limit, total),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.patch("/api/contact/inquiries/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    await pool.query("UPDATE contact_inquiries SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    res.json({ success: true, message: "Updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/contact/inquiries/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM contact_inquiries WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Dashboard stats
app.get("/api/dashboard/stats", authMiddleware, async (_req, res) => {
  try {
    const [[products]] = await pool.query(
      "SELECT COUNT(*) AS total FROM products"
    );
    const [[categories]] = await pool.query(
      "SELECT COUNT(*) AS total FROM categories"
    );
    const [[inquiries]] = await pool.query(
      "SELECT COUNT(*) AS total FROM contact_inquiries WHERE status = 'new'"
    );
    res.json({
      success: true,
      data: {
        products: products.total,
        categories: categories.total,
        newInquiries: inquiries.total,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
});

app.listen(PORT, async () => {
  try {
    await pool.query("SELECT 1");
    await ensureAdmin();
    console.log(`Aisybina API running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.error("Import sql/database.sql and check .env settings");
  }
});
