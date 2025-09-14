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
    ('Metallica', 'https://t4.ftcdn.net/jpg/09/07/89/09/360_F_907890951_ro0QZIF3dFqnxn7hiL19FNLL96uU7HhD.jpg', 'Heavy Metal Legends', 'Die legendären Heavy Metal Titanen Metallica', '["Heavy Metal", "Thrash Metal"]'),
    ('Taylor Swift', 'https://cdn.shopify.com/s/files/1/0594/4639/5086/files/Taylor_Swift_Autograph_49ae9544-0be9-410c-810d-9517437bcc98.webp?v=1747155069', 'Pop Superstar', 'Taylor Swift ist eine US-amerikanische Singer-Songwriterin', '["Pop", "Country"]'),
    ('Rammstein', 'https://www.webwandtattoo.com/de/img/asmu288-jpg/folder/products-listado-merchant/aufkleber-rammstein-emblem-.jpg', 'Industrial Metal', 'Deutsche Industrial Metal Band', '["Industrial Metal", "Neue Deutsche Härte"]'),
    ('Ed Sheeran', 'https://2wjyoqczplq2loncx0jfrnk1q5w-thumbnail.storage.muc1.de.bnerd.com/thumbnail/de/Veranstaltungen/2025/Ed%20Sheeran/10955/image-thumb__10955__thumbnail-event-detail-hero/2025_03_07_ED%20SHEERAN_Shot09_034%20copy%201.2f4e5768.webp', 'Singer-Songwriter', 'Britischer Singer-Songwriter', '["Pop", "Folk"]');

-- Insert sample data into concerts (Termine)
INSERT INTO concert (bandId, venueId, duration, concertDate, concertTime, price, vipPrice, standingSeatsSold, seatingSeatsSold, vipSeatsSold)
VALUES
    (1, 1, '02:30:00', '2025-10-15', '19:30:00', 89.99, 249.99., 6112, 5344, 191),  -- Metallica in Arena Hauptstadt
    (2, 3, '03:15:00', '2025-11-20', '18:00:00', 149.99, 399.99, 18750, 2210, 488), -- Taylor Swift in Open Air Bühne
    (3, 3, '02:00:00', '2025-09-05', '20:00:00', 99.99, 299.99, 63, 120, 22),  -- Rammstein in Open Air Bühne
    (4, 2, '02:15:00', '2025-12-10', '19:00:00', 79.99, 189.99, 0, 1530, 73);  -- Ed Sheeran in Konzerthaus Berlin

-- Insert sample data into billing
INSERT INTO billing (firstName, lastName, street, zip, houseNumber, city, paymentInfo, transactionDetails)
VALUES
    ('John', 'Doe', 'Main Street', '12345', '10', 'Berlin', 'paypal', '{}'),
    ('Jane', 'Smith', 'Elm Street', '54321', '5', 'Hamburg', 'creditcard', '{"last4": "1234", "expiry": "12/25"}'),
    ('Alice', 'Johnson', 'Oak Avenue', '67890', '15', 'München', 'banktransfer', '{"iban": "DE89370400440532013000"}');

-- Insert sample data into tickets (angepasst an die neue Struktur)
INSERT INTO ticket (firstName, lastName, concertId, concertTime, seatNumber, ticketType, price, ticketNumber, billingId)
VALUES
    -- Metallica tickets
    ('Max', 'Mustermann', 1, '19:30', 'A12', 'VIP', 249.99, 'TKT-MET-001', 1),
    ('Anna', 'Schmidt', 1, '19:30', 'B15', 'Standard', 89.99, 'TKT-MET-002', 2),
    
    -- Taylor Swift tickets
    ('Lisa', 'Müller', 2, '18:00', 'VIP1', 'VIP', 399.99, 'TKT-TS-001', 3),
    ('Tom', 'Weber', 2, '18:00', 'C25', 'Standard', 149.99, 'TKT-TS-002', 1),
    
    -- Rammstein tickets
    ('Sarah', 'Fischer', 3, '20:00', 'VIP2', 'VIP', 299.99, 'TKT-RAM-001', 2),
    ('David', 'Wagner', 3, '20:00', 'D10', 'Standard', 99.99, 'TKT-RAM-002', 3),
    
    -- Ed Sheeran tickets
    ('Maria', 'Becker', 4, '19:00', 'VIP3', 'VIP', 189.99, 'TKT-ED-001', 1),
    ('Paul', 'Hoffmann', 4, '19:00', 'E5', 'Standard', 79.99, 'TKT-ED-002', 2);

SET FOREIGN_KEY_CHECKS = 1; -- Re-enable foreign key checks