from flask import Flask, render_template, url_for, request
from util import json_response

import data_manager

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


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


@app.route('/statuses/<int:board_id>')
@json_response
def statuses(board_id: int):
    statuses = data_manager.get_statuses(board_id)
    return statuses


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
    print(req)
    data_manager.update_column(req)
    return req


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
