-- SQL script for concert database schema with drop statements

-- Drop existing tables if they exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS billing;
DROP TABLE IF EXISTS concert;
DROP TABLE IF EXISTS band;
DROP TABLE IF EXISTS venue;
SET FOREIGN_KEY_CHECKS = 1;

-- Create table for venues
CREATE TABLE venue (
    venueId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    totalCapacity INT NOT NULL,
    standingArea INT,
    seatingArea INT,
    vipArea INT
);

-- Create table for bands
CREATE TABLE band (
    bandId INT AUTO_INCREMENT PRIMARY KEY,
    bandName VARCHAR(255) NOT NULL,
    cover TEXT,
    short_desc TEXT,
    description TEXT,
    genre JSON
);

-- Create table for concerts (termin)
CREATE TABLE concert (
    concertId INT AUTO_INCREMENT PRIMARY KEY,
    bandId INT NOT NULL,
    venueId INT NOT NULL,
    duration TIME,
    concertDate DATE,
    concertTime TIME,
    price FLOAT,
    vipPrice FLOAT,
    standingSeatsSold INT,
    seatingSeatsSold INT,
    vipSeatsSold INT,
    
    FOREIGN KEY (bandId) REFERENCES band(bandId) ON DELETE CASCADE,
    FOREIGN KEY (venueId) REFERENCES venue(venueId) ON DELETE CASCADE
);

-- Create table for billing
CREATE TABLE billing (
    billingId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    houseNumber VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    paymentInfo VARCHAR(50) NOT NULL,
    transactionDetails JSON
);

-- Create table for tickets
CREATE TABLE ticket (
    ticketId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    concertTime VARCHAR(5),
    seatNumber VARCHAR(10),
    ticketType VARCHAR(50) NOT NULL,
    price FLOAT NOT NULL,
    purchaseDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ticketNumber VARCHAR(100) NOT NULL,
    concertId INT NOT NULL,
    billingId INT NOT NULL,
    FOREIGN KEY (concertId) REFERENCES concert(concertId) ON DELETE CASCADE,
    FOREIGN KEY (billingId) REFERENCES billing(billingId) ON DELETE CASCADE
);