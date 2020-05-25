# Obstar.io/Korexk.io server
This is the original Obstar source code.
The game still need a lot of work and love, I could help a little bit if some of you are planning on remaking a serious version of it.
## Prerequisites
Run on nodejs 10 an above;
All the dependencies are in package.json.
## Things you need to know
The game could still be optimized. Also, the code is not clean, so it might be hard to understad what's happening. Again, if you are planning on working on it seriously, i could help a little bit.
###
There is two main server files, ```obstarWeb.js``` and ```Alex.js```
ObstarWeb.js is the web server, its handling the http request, the html/css/js files and the shop/leaderboad/accounts databases.
Alex.js is the actual game.
###
it's possible to put the web server, the game server and the mysql server on different machines.
The files /lib/AlexMysql.js, /lib/webMysql.js, are both the config for to the mysql databse connection, and the file /public/share/ws_link.js is the link to the game server. (they are all set to localhost);
## Mysql Database
To work, obstar needs a mysql database with the following tables:
###
Create statement for the database 
```
CREATE DATABASE `users` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
```
Then, you have to use the database users: ```use users```

Create statement for the accounts table :
```
CREATE TABLE `acc` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `userKey` varchar(25) NOT NULL,
  `userData` text,
  `ip` varchar(30) DEFAULT NULL,
  `lastConnection` date NOT NULL,
  `coins` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `key_UNIQUE` (`userKey`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf16;
```

Create statement for the shops :
```
CREATE TABLE `shop` (
  `id` int(11) NOT NULL,
  `class` varchar(45) NOT NULL,
  `label` varchar(45) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`class`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

Create statement for the leaderboard table :
```
CREATE TABLE `wrs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT 'unnamed',
  `score` int(11) NOT NULL DEFAULT '0',
  `tank` varchar(20) DEFAULT NULL,
  `gm` varchar(15) DEFAULT NULL,
  `userKey` varchar(25) DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8;
```
For the leaderboard to work, you need to insert at least one row: 
```
insert into wrs value(NULL,'unnamed',0,'Basic','ffa',NULL,NOW());
```

Create statement for the dev-token table :
```
CREATE TABLE `devs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(25) NOT NULL,
  `level` int(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
```
