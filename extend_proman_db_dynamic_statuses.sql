CREATE TABLE  boards_statuses (
	board_id int NOT NULL REFERENCES boards(id),
    status_id int NOT NULL REFERENCES statuses(id));