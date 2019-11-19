CREATE TABLE users (
	id serial not null PRIMARY KEY,
	username varchar(20) UNIQUE NOT NULL,
	password varchar(20) NOT NULL
);
