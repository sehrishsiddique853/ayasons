ALTER TABLE categories
    ADD COLUMN hero_image_blob LONGBLOB NULL
        AFTER hero_image,

    ADD COLUMN hero_image_mime VARCHAR(100) NULL
        AFTER hero_image_blob,

    ADD COLUMN hero_image_name VARCHAR(255) NULL
        AFTER hero_image_mime,

    ADD COLUMN collection_image_blob LONGBLOB NULL
        AFTER collection_image,

    ADD COLUMN collection_image_mime VARCHAR(100) NULL
        AFTER collection_image_blob,

    ADD COLUMN collection_image_name VARCHAR(255) NULL
        AFTER collection_image_mime;


ALTER TABLE products
    ADD COLUMN image_blob LONGBLOB NULL
        AFTER image,

    ADD COLUMN image_mime VARCHAR(100) NULL
        AFTER image_blob,

    ADD COLUMN image_name VARCHAR(255) NULL
        AFTER image_mime;