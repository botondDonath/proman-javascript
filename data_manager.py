from connection import connection_handler


@connection_handler
def get_boards(cursor):
    cursor.execute(
        '''
        SELECT title
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
