-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 04 ก.ค. 2020 เมื่อ 02:26 PM
-- เวอร์ชันของเซิร์ฟเวอร์: 10.1.44-MariaDB-cll-lve
-- PHP Version: 7.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thaiallt_planthaisomdej17`
--
CREATE DATABASE IF NOT EXISTS `thaiallt_planthaisomdej17` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `thaiallt_planthaisomdej17`;

-- --------------------------------------------------------

--
-- โครงสร้างตาราง `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `booking_name` varchar(200) NOT NULL,
  `booking_time_start` time NOT NULL,
  `booking_time_end` time NOT NULL,
  `booking_create_datetime` datetime DEFAULT NULL,
  `booking_timestamp` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `booking_limit` int(3) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- dump ตาราง `booking`
--

INSERT INTO `booking` (`id`, `booking_name`, `booking_time_start`, `booking_time_end`, `booking_create_datetime`, `booking_timestamp`, `booking_limit`, `status`) VALUES
(1, 'รอบที่ 1 เวลาเริ่ม 08:00', '08:00:00', '10:00:00', '2020-01-07 16:10:22', '2020-01-07 09:35:49', 2, 1),
(2, 'รอบที่ 2 เวลาเริ่ม 10:00', '10:00:00', '12:00:00', '2020-01-07 16:36:42', '2020-01-07 09:44:21', 2, 1),
(3, 'รอบที่ 3 เวลาเริ่ม 13:00', '13:00:00', '15:00:00', '2020-01-07 16:45:22', '2020-01-07 09:45:16', 2, 1);

-- --------------------------------------------------------

--
-- โครงสร้างตาราง `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_img` text NOT NULL,
  `customer_age` int(3) NOT NULL,
  `customer_tel` varchar(20) NOT NULL,
  `customer_weight` float(5,2) DEFAULT NULL,
  `customer_congenitaldisease` text COMMENT 'โรคประจำตัว *ถ้ามี',
  `customer_date_create` datetime NOT NULL,
  `customer_date_update` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `customer_line_userId` varchar(50) NOT NULL,
  `customer_lat` double(10,7) DEFAULT NULL COMMENT ' no use',
  `customer_lng` double(11,7) DEFAULT NULL COMMENT ' no use',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `customer_map_note` varchar(255) DEFAULT NULL COMMENT ' no use'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ลูกค้า';

--
-- dump ตาราง `customer`
--

INSERT INTO `customer` (`customer_id`, `customer_name`, `customer_img`, `customer_age`, `customer_tel`, `customer_weight`, `customer_congenitaldisease`, `customer_date_create`, `customer_date_update`, `customer_line_userId`, `customer_lat`, `customer_lng`, `status`, `customer_map_note`) VALUES
(1, 'นายนิรวิทย์​ คำมา', 'https://profile.line-scdn.net/0h8sYneerhZ1xkF0ogqT8YC1hSaTETOWEUHHAsMkAUOm5OcCIJWnkrP0ASP2hKJiJdUXEuPkMXaTsb', 27, '0610742188​', 79.99, '', '2020-01-05 17:48:36', '2020-01-08 13:24:53', 'U190074374a43d7f6354155264b726e3a', NULL, NULL, 1, NULL),
(2, 'ผาณิต', 'https://profile.line-scdn.net/0h4TxhqUxoa3tFEUaz2B4ULHlUZRYyP20zPX9xFGgTPENuJiUpfnEjFTAWNEs9JiwoKSUsTWBDYU08', 50, '0924561983', 9.99, '', '2020-01-07 15:58:18', '0000-00-00 00:00:00', 'Uf29848cf9c4a9bba2cd67bb56605efc2', NULL, NULL, 1, NULL),
(4, 'Niphaphan Usangthong', 'https://profile.line-scdn.net/0h1USEWkwBbnpuPETyr54RLVJ5YBcZEmgyFlgoGkI7YhhAX3spVgh1FR4-Mh0WXCx-VAogGkM5M0pF', 23, ' 66616306617', 9.99, '', '2020-01-07 16:00:29', '0000-00-00 00:00:00', 'U3878f1f586937245aa2dc77c3246cd9c', NULL, NULL, 1, NULL);

-- --------------------------------------------------------

--
-- โครงสร้างตาราง `inorder_booking`
--

CREATE TABLE `inorder_booking` (
  `id` int(11) NOT NULL,
  `inorder_booking_custometype` tinyint(1) DEFAULT NULL,
  `inorder_booking_fullname` varchar(200) DEFAULT NULL,
  `inorder_booking_age` int(3) DEFAULT NULL,
  `inorder_booking_weight` float(5,2) DEFAULT NULL,
  `inorder_booking_congenitaldisease` text,
  `inorder_booking_tel` varchar(20) DEFAULT NULL,
  `inorder_booking_selectdate` date DEFAULT NULL,
  `inorder_booking_ref_id` int(11) DEFAULT NULL,
  `inorder_booking_create_datetime` datetime DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `line_userId` (`customer_line_userId`);

--
-- Indexes for table `inorder_booking`
--
ALTER TABLE `inorder_booking`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inorder_booking`
--
ALTER TABLE `inorder_booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
