CREATE TABLE boards (
	id serial NOT NULL PRIMARY KEY,
	title varchar(100) NOT NULL);

CREATE TABLE statuses (
	id serial NOT NULL PRIMARY KEY,
	title varchar(100) NOT NULL);

CREATE TABLE cards (
	id serial NOT NULL PRIMARY KEY,
	board_id int NOT NULL REFERENCES boards(id),
	title varchar(100) NOT NULL,
	status_id int NOT NULL REFERENCES statuses(id),
	"order" int NOT NULL);
