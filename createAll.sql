CREATE DATABASE IF NOT EXISTS CoinCalendar;
USE CoinCalendar;

CREATE TABLE IF NOT EXISTS `Account` (
  `username` VARCHAR(30) NOT NULL PRIMARY KEY, -- also the username (PK ensures unique)
  `accountID` INT AUTO_INCREMENT UNIQUE, -- account id that is unique to each account
  `password` VARCHAR(150) NOT NULL, -- hashed password
  `fname` VARCHAR(50), -- first name
  `lname` VARCHAR(50), -- last name
  `email` VARCHAR(255), -- email address linked to account, only one
  `phone` VARCHAR(20) -- phone number linked to account, only one
);

CREATE TABLE IF NOT EXISTS `Expense` (
  `expenseID` INT AUTO_INCREMENT PRIMARY KEY, -- expense id, auto generated
  `accountID` INT NOT NULL, -- associated account id that created the expense
  `expenseName` VARCHAR(50), -- name of expense
  `category` VARCHAR(30), -- category that expense falls under
  `date` DATE, -- date of expense
  `cost` DECIMAL(10, 2) -- cost of expense
);

CREATE TABLE IF NOT EXISTS `Event` (
  `eventID` INT AUTO_INCREMENT PRIMARY KEY, -- event id, auto generated
  `accountID` INT NOT NULL, -- associated account id that created the event
  `eventName` VARCHAR(50), -- name of event
  `description` VARCHAR(300), -- description of event
  `repeat` BOOL, -- repeat is a true/false, if true, then stays in system after date ending
  `datespan_start` DATE, -- start of event
  `datespan_end` DATE -- end of event (can be same day)
);

CREATE TABLE IF NOT EXISTS `Recurring-Bill` (
  `recurID` INT AUTO_INCREMENT PRIMARY KEY, -- recurring bill id, auto generated
  `accountID` INT NOT NULL, -- associated account id that created the recurring bill
  `billName` VARCHAR(50), -- name of bill
  `renewDay` INT, -- int indicates the day of the month that the bill will renew
  `frequency` ENUM('weekly', 'monthly', 'yearly'), -- choice between a weekly, monthly, and yearly budget plan option
  `category` VARCHAR(50), -- category field, to group the bills in the home display containers
  `cost` DECIMAL(10, 2) -- 10 digit upper limit, rounds to two decimal places for cents
);

CREATE TABLE IF NOT EXISTS `Budget-Info` ( 
 `budgetID` INT PRIMARY KEY AUTO_INCREMENT,
 `accountID` INT NOT NULL,
 `totalBalance` DECIMAL(10,2), 
 `monthlySavings` DECIMAL(10,2), 
 `monthlyEssentials` DECIMAL(10,2), 
 `monthlySpending` DECIMAL(10,2), 
 `frequency` ENUM('weekly', 'monthly', 'yearly')
);

CREATE TABLE IF NOT EXISTS `resetpassword` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(30) NOT NULL,
  `code` TEXT NOT NULL
);

