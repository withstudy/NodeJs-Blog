/*
SQLyog Enterprise v12.08 (64 bit)
MySQL - 5.6.26 : Database - node
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`node` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

USE `node`;

/*Table structure for table `category` */

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `category` */

insert  into `category`(`id`,`name`) values (1,'js'),(3,'css'),(4,'html');

/*Table structure for table `comments` */

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `con_id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `comments` text COLLATE utf8_bin,
  `addTime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `con_id` (`con_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `comments` */

insert  into `comments`(`id`,`con_id`,`username`,`comments`,`addTime`) values (15,10,'admin','123','2019-11-26 14:56:00'),(16,11,'admin','123','2019-11-26 15:10:34'),(17,11,'admin','123','2019-11-26 15:11:20'),(18,11,'admin','','2019-11-26 15:11:27'),(19,9,'admin','123','2019-11-26 15:12:45'),(20,11,'admin','464','2019-11-26 15:14:56'),(21,7,'admin','123','2019-11-26 15:36:38'),(22,11,'admin','123','2019-11-26 15:43:04'),(23,11,'admin','请问','2019-11-26 15:43:11'),(24,11,'admin','123','2019-11-26 15:43:28'),(25,6,'admin','123','2019-11-26 15:43:59'),(26,12,'xhb','123','2019-11-26 16:46:07');

/*Table structure for table `content` */

DROP TABLE IF EXISTS `content`;

CREATE TABLE `content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `c_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `u_name` varchar(255) COLLATE utf8_bin NOT NULL,
  `title` varchar(255) COLLATE utf8_bin NOT NULL,
  `description` text COLLATE utf8_bin,
  `content` text COLLATE utf8_bin,
  `views` int(11) DEFAULT '0',
  `addTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `comments` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `c_id` (`c_id`),
  KEY `u_id` (`u_id`),
  CONSTRAINT `c_id` FOREIGN KEY (`c_id`) REFERENCES `category` (`id`),
  CONSTRAINT `u_id` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `content` */

insert  into `content`(`id`,`c_id`,`u_id`,`u_name`,`title`,`description`,`content`,`views`,`addTime`,`comments`) values (6,3,26,'admin','css权重及计算','关于CSS权重，我们需要一套计算公式来去计算','2). 权重叠加\r\n我们经常用交集选择器，后代选择器等，是有多个基础选择器组合而成，那么此时，就会出现权重叠加。\r\n\r\n就是一个简单的加法计算\r\n\r\ndiv ul li ------> 0,0,0,3\r\n\r\n.nav ul li ------> 0,0,1,2\r\n\r\na:hover -----—> 0,0,1,1\r\n\r\n.nav a ------> 0,0,1,1\r\n\r\n注意：\r\n\r\n数位之间没有进制 比如说： 0,0,0,5 + 0,0,0,5 =0,0,0,10 而不是 0,0, 1, 0， 所以不会存在10个div能赶上一个类选择器的情况。\r\n3). 继承的权重是0\r\n这个不难，但是忽略很容易绕晕。其实，我们修改样式，一定要看该标签有没有被选中。\r\n\r\n1） 如果选中了，那么以上面的公式来计权重。谁大听谁的。\r\n2） 如果没有选中，那么权重是0，因为继承的权重为0.\r\n',1,'2019-11-25 16:58:04',1),(8,3,26,'admin','css元素居中（水平居中、垂直居中）','实用的居中\r\n居中组合 2 种实现方案（包含不固定高度时的居中），水平居中 3 种实现方案，垂直居中 2 种实现方案，代码的世界变幻莫测，有其它更好用的方案，还请多多赐教……','<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <title>居中</title>\r\n    <!-- 方案 1 ：不固定高度 -->\r\n    <style type=\"text/css\">\r\n        body { background-color: black; height: 500px; }\r\n        .parent { background-color: silver; width: 50%; height: 100%; }\r\n        .parent .child { background-color: blueviolet;width: 50%;height: 50%; }\r\n\r\n        .parent {\r\n            text-align: center;/* 水平居中 */\r\n        }\r\n        .child {\r\n            display: inline-block;/* 水平居中 */\r\n            transform: translateY(50%);/* 垂直居中 */\r\n        }\r\n    </style>\r\n    <!-- 方案 2 ：固定高度 -->\r\n    <style type=\"text/css\">\r\n        div { height: 100px; width: 350px; }\r\n        .parent { background-color: silver; width: 500px; height: 150px; }\r\n        .parent .child { background-color: blueviolet; }\r\n\r\n        .parent {\r\n            text-align: center;/* 水平居中 */\r\n            display: table-cell;/* 垂直居中 */\r\n            vertical-align: middle;/* 垂直居中 */\r\n        }\r\n        .child {\r\n            display: inline-block;/* 水平居中 */\r\n        }\r\n    </style>\r\n    <!-- 其它方案自行组合 -->\r\n</head>\r\n<body>\r\n    <div class=\"parent\">\r\n        <div class=\"child\">\r\n            text-align: center;水平居中会被继承\r\n            <br/>\r\n            vertical-align: middle;垂直居中不会被继承\r\n        </div>\r\n    </div>\r\n</body>\r\n</html>\r\n',1,'2019-11-25 17:01:36',0),(10,3,26,'admin','温泉人情味儿','去玩儿','去玩儿玩儿',31,'2019-11-25 18:16:13',1),(11,4,26,'admin','问题为其','玩儿','去玩儿企业获取',104,'2019-11-25 18:34:18',7),(12,1,26,'admin','123','1231','123123123123',20,'2019-11-26 16:32:46',1);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(255) COLLATE utf8_bin NOT NULL,
  `password` char(255) COLLATE utf8_bin NOT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `user` */

insert  into `user`(`id`,`username`,`password`,`isAdmin`) values (23,'xhb','xhb',0),(26,'admin','admin',1),(27,'cl','cl',0),(28,'bl','bl',0),(29,'4520','4520',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
