from connection import connection_handler


@connection_handler
def get_boards(cursor):
    cursor.execute(
        '''
        SELECT id, title
        FROM boards
        '''
    )
    boards = cursor.fetchall()
    return boards


@connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute(
        '''
        SELECT id, board_id, title, status_id, "order"
        FROM cards
        WHERE board_id = %(board_id)s
        ''',
        {'board_id': board_id}
    )
    cards = cursor.fetchall()
    return cards


@connection_handler
def delete_card(cursor, card_id):
    cursor.execute(
        '''
        DELETE FROM cards
        WHERE id = %(card_id)s
        ''',
        {'card_id': card_id}
    )


@connection_handler
def insert_board(cursor, title):
    cursor.execute(
        '''
        INSERT INTO boards (title)
        VALUES (%(title)s)
        ''',
        {'title': title}
    )


@connection_handler
def get_newest_board(cursor):
    cursor.execute(
        '''
        SELECT id, title FROM boards
        ORDER BY id DESC LIMIT 1;
        '''
    )
    board = cursor.fetchone()
    return board


@connection_handler
def get_statuses(cursor):
    cursor.execute(
        '''
        SELECT id, title
        FROM statuses
        '''
    )
    statuses = cursor.fetchall()
    return statuses


@connection_handler
def new_card(cursor, board_id, title, status_id):
    cursor.execute(
        '''
        INSERT INTO cards (board_id, title, status_id, "order")
        VALUES (%(board_id)s, %(title)s, %(status_id)s, 0)
        ''',
        {'board_id': board_id, 'title': title, 'status_id': status_id}
    )


@connection_handler
def get_card_by_id(cursor, card_id):
    cursor.execute(
        '''
        SELECT id, board_id, title, status_id, "order"
        FROM cards
        WHERE id = %(id)s
        ''',
        {'id': card_id}
    )
    card = cursor.fetchone()
    return card


@connection_handler
def get_new_card_id(cursor):
    cursor.execute(
        '''
        SELECT MAX(id) as id
        FROM cards
        '''
    )
    _id = cursor.fetchone()
    return _id


@connection_handler
def update_board(cursor, board_data):
    cursor.execute(
        '''
        UPDATE boards SET title = %(title)s WHERE id = %(id)s;
        ''', board_data
    )
