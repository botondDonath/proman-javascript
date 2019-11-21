CREATE TABLE users_boards (
	board_id int NOT NULL REFERENCES boards(id),
	user_id int REFERENCES users(id)
);
