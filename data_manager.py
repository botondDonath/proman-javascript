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
        SELECT board_id, title, status_id, "order"
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
