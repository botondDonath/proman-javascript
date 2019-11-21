from connection import connection_handler
from psycopg2 import IntegrityError
import util


@connection_handler
def get_boards(cursor):
    cursor.execute(
        '''
        SELECT id, title
        FROM boards
        ORDER BY id;
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
        ORDER BY "order";
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
def get_statuses(cursor, board_id):
    cursor.execute(
        '''
        SELECT id, title
        FROM statuses
        WHERE id IN (SELECT status_id
                     FROM boards_statuses
                     WHERE board_id = %(board_id)s
                     ORDER BY status_id)
        ORDER BY id
        ''',
        {'board_id': board_id}
    )
    statuses = cursor.fetchall()
    return statuses


@connection_handler
def get_status_by_status_id(cursor, status_id):
    cursor.execute(
        '''
        SELECT id, title
        FROM statuses
        WHERE id = %(status_id)s
        ''',
        {'status_id': status_id}
    )
    status = cursor.fetchone()
    return status


@connection_handler
def add_new_status(cursor, status_name, board_id):
    cursor.execute(
        '''
        INSERT INTO statuses (title)
        VALUES (%(status_name)s)
        ''',
        {'status_name': status_name}
    )
    cursor.execute(
        '''
        SELECT id
        FROM statuses
        ORDER BY id DESC
        LIMIT 1
        '''
    )
    status_id = cursor.fetchone()
    cursor.execute(
        '''
        INSERT INTO boards_statuses (board_id, status_id)
        VALUES (%(board_id)s, %(status_id)s)
        ''',
        {'board_id': board_id, 'status_id': status_id['id']}
    )
    return status_id


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


@connection_handler
def update_card(cursor, card_data):
    cursor.execute(
        '''
        UPDATE cards
        SET title = %(title)s
        WHERE id = %(id)s
        ''',
        card_data
    )


@connection_handler
def update_column(cursor, column_data):
    cursor.execute(
        '''
        UPDATE statuses SET title = %(title)s WHERE id = %(id)s;
        ''', column_data
    )


@connection_handler
def insert_user(cursor, user_data):
    user_data['password'] = util.hash_password(user_data['password'])
    try:
        cursor.execute(
            '''
            INSERT INTO users (username, password)
            VALUES (%(username)s, %(password)s)
            RETURNING id, username
            ''',
            user_data
        )
    except IntegrityError:
        return {'error': 'Username already exists!'}
    else:
        return cursor.fetchone()


@connection_handler
def update_cards_order_and_status(cursor, cards_data):
    for card in cards_data:
        cursor.execute(
            """
            UPDATE cards 
            SET "order" = %(order)s , status_id = %(status_id)s
            WHERE id = %(id)s
            """, {'id': card['id'], 'order': card['order'], 'status_id': card['status_id']}
        )


@connection_handler
def authenticate_user(cursor, user_data):
    cursor.execute(
        '''
        SELECT id, username, password FROM users
        WHERE username = %(username)s
        ''',
        {'username': user_data['username']}
    )
    result = cursor.fetchone()
    authenticated = util.verify_password(user_data['password'], result.pop('password')) if result is not None else False
    return result if authenticated else {'error': 'Invalid username or password!'}
