CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    slug VARCHAR(120) NOT NULL,

    eyebrow VARCHAR(100) NOT NULL DEFAULT '',

    showcase_label VARCHAR(100) NOT NULL DEFAULT '',

    hero_title VARCHAR(180) NOT NULL,

    description TEXT NOT NULL,

    collection_description TEXT NULL,

    hero_image VARCHAR(500) NOT NULL DEFAULT '',

    collection_image VARCHAR(500) NOT NULL DEFAULT '',

    groups_json JSON NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    display_order INT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_categories_slug (slug),

    KEY idx_categories_active_order (
        active,
        display_order
    )
);


CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    category_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(150) NOT NULL,

    slug VARCHAR(180) NOT NULL,

    group_name VARCHAR(150) NOT NULL DEFAULT '',

    description TEXT NOT NULL,

    image VARCHAR(500) NOT NULL DEFAULT '',

    features_json JSON NULL,

    featured BOOLEAN NOT NULL DEFAULT FALSE,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    display_order INT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_product_category_slug (
        category_id,
        slug
    ),

    KEY idx_products_category_active_order (
        category_id,
        active,
        display_order
    ),

    KEY idx_products_featured_active_order (
        featured,
        active,
        display_order
    ),

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);