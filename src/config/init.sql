DROP TABLE creatives;
DROP TABLE advertisers;

CREATE TABLE advertisers (
    id INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE creatives (
    id INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    is_active BOOLEAN NOT NULL,
    type_id INT unsigned NOT NULL,
    image_name VARCHAR(150),
    image_link VARCHAR(150),
    click_url VARCHAR(150),
    alt_text VARCHAR(150),
    advertiser_id INT unsigned NOT NULL,
    FOREIGN KEY (advertiser_id) REFERENCES advertisers(id)
    ON DELETE CASCADE
);

INSERT INTO advertisers(id, name) VALUES (1, 'nike');