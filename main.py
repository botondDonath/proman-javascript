from flask import Flask, render_template, url_for, request, session
from util import json_response

import data_manager

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html', session=session)


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    boards = data_manager.get_boards()
    return boards


@app.route("/boards", methods=['POST'])
@json_response
def create_board():
    req = request.get_json()
    data_manager.insert_board(req['title'])
    return data_manager.get_newest_board()


@app.route("/get-cards/<board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    cards = data_manager.get_cards_for_board(board_id)
    return cards


@app.route('/new-card', methods=['POST'])
@json_response
def add_new_card():
    req = request.get_json()
    data_manager.new_card(req['board_id'], req['title'], req['status_id'])
    card_id = data_manager.get_new_card_id()
    return card_id['id']


@app.route('/card/<card_id>')
def get_card(card_id: int):
    card = data_manager.get_card_by_id(card_id)
    return card


@app.route("/boards/<int:board_id>", methods=['POST'])
@json_response
def rename_board(board_id: int):
    req = request.get_json()
    data_manager.update_board(req)
    return req


@app.route('/delete-card', methods=['POST'])
@json_response
def delete_card():
    req = request.get_json()
    data_manager.delete_card(req['card_id'])


@app.route('/statuses/board/<int:board_id>')
@json_response
def statuses(board_id: int):
    statuses = data_manager.get_statuses(board_id)
    return statuses


@app.route('/statuses/<int:status_id>')
@json_response
def handle_status(status_id: int):
    status = data_manager.get_status_by_status_id(status_id)
    return status


@app.route('/statuses', methods=['POST'])
@json_response
def add_new_status():
    status_data = request.get_json()
    status_id = data_manager.add_new_status(status_data['status_name'], status_data['board_id'])
    return status_id['id']


@app.route('/cards/<int:card_id>', methods=['POST'])
@json_response
def rename_card(card_id: int):
    card_data = request.get_json()
    card_data.update({'id': card_id})
    data_manager.update_card(card_data)
    return card_data


@app.route('/rename-column', methods=['POST'])
@json_response
def rename_column():
    req = request.get_json()
    data_manager.update_column(req)
    return req


@app.route('/users', methods=['POST'])
@json_response
def register_user():
    user_data = request.get_json()
    return data_manager.insert_user(user_data)


@app.route('/cards/order-and-status', methods=['POST'])
@json_response
def move_cards():
    BOARD_ID = 0
    cards_data = request.get_json()
    board_id = cards_data[BOARD_ID]['board_id']
    data_manager.update_cards_order_and_status(cards_data)
    updated_cards = data_manager.get_cards_for_board(board_id)
    return updated_cards


@app.route('/session', methods=['POST'])
@json_response
def log_user_in():
    user_data = request.get_json()
    authentication_result = data_manager.authenticate_user(user_data)
    if 'error' not in authentication_result:
        session.update(authentication_result)
    return authentication_result


@app.route('/session', methods=['DELETE'])
@json_response
def log_user_out():
    session.clear()
    return '', 200


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
