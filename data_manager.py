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
