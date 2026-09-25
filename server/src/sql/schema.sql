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

    featured_order TINYINT UNSIGNED NULL,

UNIQUE KEY uq_products_featured_order (
    featured_order
),

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

CREATE TABLE IF NOT EXISTS homepage_content (

    id TINYINT UNSIGNED NOT NULL,

    about_image_blob LONGBLOB NULL,

    about_image_mime VARCHAR(100) NULL,

    about_image_name VARCHAR(255) NULL,

    manufacturing_stats_json JSON NOT NULL,

    manufacturing_video_blob LONGBLOB NULL,

    manufacturing_video_mime VARCHAR(100) NULL,

    manufacturing_video_name VARCHAR(255) NULL,

    department_stats_json JSON NOT NULL,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

        process_kicker VARCHAR(100)
    NOT NULL DEFAULT 'Our Process',

process_heading_line_1 VARCHAR(150)
    NOT NULL DEFAULT 'From Design',

process_heading_line_2 VARCHAR(150)
    NOT NULL DEFAULT 'To Your Door.',

process_intro TEXT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS homepage_process_steps (

    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    step_order TINYINT UNSIGNED NOT NULL,

    step_number VARCHAR(10) NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    image_blob LONGBLOB NULL,

    image_mime VARCHAR(100) NULL,

    image_name VARCHAR(255) NULL,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_homepage_process_order (
        step_order
    )
);

CREATE TABLE IF NOT EXISTS homepage_departments (

    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    department_order TINYINT UNSIGNED NOT NULL,

    department_number VARCHAR(10) NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    image_blob LONGBLOB NULL,

    image_mime VARCHAR(100) NULL,

    image_name VARCHAR(255) NULL,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uq_homepage_department_order (
        department_order
    )
);

CREATE TABLE IF NOT EXISTS contact_settings (

    id TINYINT UNSIGNED NOT NULL,

    recipient_email VARCHAR(255) NOT NULL,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS homepage_standards_content (

    id TINYINT UNSIGNED NOT NULL,

    kicker VARCHAR(150)
        NOT NULL
        DEFAULT 'Certifications & Compliance',

    heading VARCHAR(255)
        NOT NULL
        DEFAULT 'Documentation Available On Request',

    footer_text TEXT NULL,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS homepage_standards (

    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    display_order INT UNSIGNED
        NOT NULL DEFAULT 0,

    title VARCHAR(180) NOT NULL,

    description TEXT NOT NULL,


    logo_image_blob LONGBLOB NULL,

    logo_image_mime VARCHAR(100) NULL,

    logo_image_name VARCHAR(255) NULL,


    certificate_blob LONGBLOB NULL,

    certificate_mime VARCHAR(100) NULL,

    certificate_name VARCHAR(255) NULL,


    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    PRIMARY KEY (id),

    KEY idx_homepage_standards_order (
        display_order,
        id
    )
);