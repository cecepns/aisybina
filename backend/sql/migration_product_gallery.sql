-- Migration: product images & series
-- Run: mysql -u root -p aisybina_export < sql/migration_product_gallery.sql

USE aisybina_export;

CREATE TABLE IF NOT EXISTS product_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  image VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_images_product (product_id)
) ENGINE=InnoDB;

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

-- Migrate existing single images to product_images (skip if already migrated)
INSERT INTO product_images (product_id, image, sort_order)
SELECT p.id, p.image, 0
FROM products p
WHERE p.image IS NOT NULL
  AND p.image != ''
  AND NOT EXISTS (
    SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
  );
