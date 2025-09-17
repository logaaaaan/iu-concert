-- SQL script for inserting test data into the concert database
SET FOREIGN_KEY_CHECKS = 0; -- Temporarily disable foreign key checks

-- Insert sample data into venues (angepasst an die neue Struktur)
INSERT INTO venue (name, totalCapacity, standingArea, seatingArea, vipArea)
VALUES
    ('Arena Hauptstadt', 15000, 8000, 7000, 500),
    ('Konzerthaus Berlin', 2000, 0, 2000, 100),
    ('Open Air Bühne', 25000, 20000, 5000, 500);

-- Insert sample data into bands
INSERT INTO band (bandName, cover, short_desc, description, genre)
VALUES
    ('Metallica', 'https://t4.ftcdn.net/jpg/09/07/89/09/360_F_907890951_ro0QZIF3dFqnxn7hiL19FNLL96uU7HhD.jpg', 'Heavy Metal Legends', 'Die Metal-Legenden live auf der Bühne! Erwartet euch eine donnernde Show mit Klassikern wie ''Enter Sandman'', ''Master of Puppets'' und neuen Hits. Pyrotechnik und Lichtshow inklusive!', '["Heavy Metal", "Thrash Metal"]'),
    ('Taylor Swift', 'https://cdn.shopify.com/s/files/1/0594/4639/5086/files/Taylor_Swift_Autograph_49ae9544-0be9-410c-810d-9517437bcc98.webp?v=1747155069', 'Pop Superstar', 'Erlebe Taylor Swifts ikonische ''Eras Tour'' mit Hits aus allen ihren Alben. Eine spektakuläre Show mit atemberaubenden Bühnenbildern, Kostümwechseln und über 3 Stunden voller musikalischer Highlights.', '["Pop", "Country"]'),
    ('Rammstein', 'https://www.webwandtattoo.com/de/img/asmu288-jpg/folder/products-listado-merchant/aufkleber-rammstein-emblem-.jpg', 'Industrial Metal', 'Feuer, Pyrotechnik und deutsche Lyrik - das typische Rammstein-Erlebnis. Eine der spektakulärsten Live-Shows der Welt mit atemberaubenden Effekten und mitreißender Energie.', '["Industrial Metal", "Neue Deutsche Härte"]'),
    ('Ed Sheeran', 'https://2wjyoqczplq2loncx0jfrnk1q5w-thumbnail.storage.muc1.de.bnerd.com/thumbnail/de/Veranstaltungen/2025/Ed%20Sheeran/10955/image-thumb__10955__thumbnail-event-detail-hero/2025_03_07_ED%20SHEERAN_Shot09_034%20copy%201.2f4e5768.webp', 'Singer-Songwriter', 'Intim und doch grandios: Ed Sheeran bezaubert mit seiner Loop-Station und seiner charismatischen Bühnenpräsenz. Perfekt für einen unvergesslichen Akustik-Abend.', '["Pop", "Folk"]');

-- Insert sample data into concerts (Termine)
INSERT INTO concert (bandId, venueId, duration, concertDate, concertTime, price, vipPrice, standingSeatsSold, seatingSeatsSold, vipSeatsSold, highlights)
VALUES
    (1, 1, '02:30:00', '2025-10-15', '19:30:00', 89.99, 249.99, 6112, 5344, 191,  '["Pyrotechnische Spezialeffekte", "Extended Drum-Solo", "Guest Appearances", "Meet & Greet"]'),  -- Metallica in Arena Hauptstadt
    (2, 3, '03:15:00', '2025-11-20', '18:00:00', 149.99, 399.99, 18750, 2210, 488, '["Open-Air Event", "Sommernachtsspecial", "Picknick-Bereich", "Feuerwerk", "Bühnenoutfit-Wechsel"]'), -- Taylor Swift in Open Air Bühne
    (3, 3, '02:00:00', '2025-09-05', '20:00:00', 99.99, 299.99, 63, 120, 22, '["Feuer-Show", "Bühnen-Akrobatik", "Deutsche Lyrik-Performance", "Special Effects", "Pyrotechnik"]'),  -- Rammstein in Open Air Bühne
    (4, 2, '02:15:00', '2025-12-10', '19:00:00', 79.99, 189.99, 0, 1530, 96, '["Akustische Unpacked Session", "Loop-Station Performance", "Intime Atmosphäre", "Akustik-optimierte Halle"]');  -- Ed Sheeran in Konzerthaus Berlin

-- Insert sample data into billing
INSERT INTO billing (firstName, lastName, street, zip, houseNumber, city, paymentInfo, transactionDetails)
VALUES
    ('John', 'Doe', 'Main Street', '12345', '10', 'Berlin', 'paypal', '{}'),
    ('Jane', 'Smith', 'Elm Street', '54321', '5', 'Hamburg', 'creditcard', '{"last4": "1234", "expiry": "12/25"}'),
    ('Alice', 'Johnson', 'Oak Avenue', '67890', '15', 'München', 'banktransfer', '{"iban": "DE89370400440532013000"}');

SET FOREIGN_KEY_CHECKS = 1; -- Re-enable foreign key checks