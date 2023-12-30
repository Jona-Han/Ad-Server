DROP TABLE creatives;
DROP TABLE advertisers;

CREATE TABLE advertisers (
    id INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE creatives (
    id INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    width INT unsigned NOT NULL,
    height INT unsigned NOT NULL,
    image_name VARCHAR(150) NOT NULL,
    image_link VARCHAR(150) NOT NULL,
    click_url VARCHAR(150),
    alt_text VARCHAR(150),
    advertiser_id INT unsigned NOT NULL,
    FOREIGN KEY (advertiser_id) REFERENCES advertisers(id)
    ON DELETE CASCADE
);

INSERT INTO advertisers(name) VALUES ('nike');