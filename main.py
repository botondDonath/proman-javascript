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


@app.route("/get-cards/<board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    cards = data_manager.get_cards_for_board(board_id)
    return cards


@app.route("/boards", methods=['POST'])
@json_response
def create_board():
    req = request.get_json()
    data_manager.insert_board(req['title'])
    return data_manager.get_newest_board()


@app.route('/statuses')
@json_response
def statuses():
    statuses = data_manager.get_statuses()
    return statuses


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
