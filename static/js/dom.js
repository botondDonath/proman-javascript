// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        document.querySelector('button.create-board').addEventListener('click', () => {
            const form = document.querySelector('.form.create-board');
            form.classList.toggle('hidden');
        });
        document.querySelector('button.save-new-board').addEventListener('click', () => {
            const boardTitle = document.querySelector('input.create-board').value;
            dataHandler.createNewBoard(boardTitle, (boardData) => {
                const boardTemplate = document.getElementById('board-template');
                const board = this.renderBoard(boardData, boardTemplate);
                const container = document.getElementById('boards');
                container.appendChild(board);
            })
        })
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        const boardTemplate = document.getElementById('board-template');
        const container = document.getElementById('boards');
        for (const boardData of boards) {
            const board = this.renderBoard(boardData, boardTemplate);
            container.appendChild(board);
        }
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
    renderBoard: function (boardData, template) {
        const board = document.importNode(template.content, true);
        board.querySelector('.board-title').textContent = boardData.title;
        return board
    }
};
