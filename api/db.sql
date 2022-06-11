CREATE DATABASE `aszendit` COLLATE 'utf8_general_ci';
CREATE TABLE `tasks`
(
  `id`          int(10) unsigned    NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `description` varchar(100)        NOT NULL,
  `done`        tinyint(1) unsigned NOT NULL
);
INSERT INTO `tasks` (`description`, `done`)
VALUES ('Mi primera tarea', '1');

INSERT INTO `tasks` (`description`, `done`)
VALUES ('Mi segunda tarea', '1');

INSERT INTO `tasks` (`description`, `done`)
VALUES ('Mi tercera tarea', '0');

INSERT INTO `tasks` (`description`, `done`)
VALUES ('Mi cuarta tarea', '0');
