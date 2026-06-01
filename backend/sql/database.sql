-- Aisybina Export Database
-- Run: mysql -u root -p < sql/database.sql

CREATE DATABASE IF NOT EXISTS aisybina_export
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aisybina_export;

-- Admin users
CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Product categories
CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  short_title VARCHAR(120) NOT NULL,
  tagline VARCHAR(255) DEFAULT NULL,
  description TEXT,
  highlights JSON DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categories_active (is_active),
  INDEX idx_categories_sort (sort_order)
) ENGINE=InnoDB;

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(500) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_products_category (category_id),
  INDEX idx_products_active (is_active),
  INDEX idx_products_sort (sort_order)
) ENGINE=InnoDB;

-- Product gallery images
CREATE TABLE IF NOT EXISTS product_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  image VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_images_product (product_id)
) ENGINE=InnoDB;

-- Product series / variants within one product
CREATE TABLE IF NOT EXISTS product_series (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_series_product (product_id)
) ENGINE=InnoDB;

-- Contact inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) DEFAULT NULL,
  product_interest VARCHAR(120) DEFAULT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_inquiries_status (status),
  INDEX idx_inquiries_created (created_at)
) ENGINE=InnoDB;

-- Default admin (password: admin123) — bcrypt hash
INSERT INTO admins (name, email, password) VALUES
('Administrator', 'admin@aisybinaexport.com', '$2a$10$isMHwLzq9f/zE.AQw1f.Ee6A1/7fYWTLbQmwFe4xP6Ba8NhXqOve2')
ON DUPLICATE KEY UPDATE email = email;

-- Categories
INSERT INTO categories (slug, title, short_title, tagline, description, highlights, sort_order) VALUES
('muslim-koko', 'Muslim Koko Clothes for Children', 'Muslim Koko', 'Modern design with traditional Indonesian touches',
 'Aisybina Export presents a collection of Muslim koko shirts for children that combine modern designs with traditional Indonesian touches. Made from high-quality materials, they are comfortable and durable.',
 '["Premium breathable fabrics","Traditional & modern fusion designs","Comfortable for daily wear","Export-quality stitching"]', 1),
('school-uniforms', 'Children''s School Uniforms', 'School Uniforms', 'Premium uniforms for elementary to high school',
 'We produce premium-quality school uniforms for elementary, middle, and high school students. Our school uniforms are made from selected, strong, comfortable, and durable fabrics.',
 '["Elementary, middle & high school lines","Strong yet comfortable fabrics","Customizable school branding","Consistent sizing & colors"]', 2),
('frozen-groceries', 'Frozen Groceries', 'Frozen Groceries', 'Frozen staples with preserved freshness & nutrition',
 'Aisybina Export operates in the food sector, providing frozen groceries consisting of frozen staple foods processed using modern technology.',
 '["Modern freezing technology","Hygienic processing standards","Long shelf life with fresh taste","Export-ready packaging"]', 3)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Products (category_id 1 = muslim-koko, 2 = school-uniforms, 3 = frozen-groceries)
INSERT INTO products (category_id, name, description, sort_order) VALUES
(1, 'Classic Embroidered Koko', 'Elegant embroidered koko with soft cotton blend, ideal for daily and ceremonial wear.', 1),
(1, 'Modern Slim Fit Koko', 'Contemporary slim-cut koko with minimalist collar detail for active children.', 2),
(1, 'Festive Batik Accent Koko', 'Premium koko featuring subtle batik accents celebrating Indonesian heritage.', 3),
(1, 'School Prayer Koko Set', 'Durable koko set designed for school and mosque activities with easy-care fabric.', 4),
(2, 'Elementary Complete Set', 'Full uniform set for primary students with reinforced seams for active learning.', 1),
(2, 'Middle School Standard Set', 'Professional middle school uniform with moisture-wicking fabric technology.', 2),
(2, 'High School Formal Set', 'Sharp, formal high school uniform designed for comfort and long-lasting wear.', 3),
(2, 'Sports & PE Uniform', 'Flexible athletic uniform for physical education and extracurricular activities.', 4),
(3, 'Frozen Rice Portions', 'Pre-portioned frozen rice maintaining texture and flavor after reheating.', 1),
(3, 'Frozen Vegetable Mix', 'Selected Indonesian vegetables flash-frozen to preserve nutrients and color.', 2),
(3, 'Frozen Protein Staples', 'Quality frozen protein products processed under strict hygiene controls.', 3),
(3, 'Frozen Ready-to-Cook Meals', 'Convenient frozen meal components for households and food service partners.', 4);
