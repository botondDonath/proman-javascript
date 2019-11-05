// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

function renderBoard(boardData, template) {
    const board = document.importNode(template.content, true);
    board.querySelector('.board-title').textContent = boardData.title;
    return board
}

function handleCreateBoardInputClickOutside() {
    const input = document.querySelector('input.create-board');
    if (input.value) {
        input.value = '';
    }
}

function handleCreateBoardButtonClick() {
    const form = document.querySelector('.form.create-board');
    form.classList.toggle('hidden');
}

function handleSaveBoardButtonClick() {
    const boardTitle = document.querySelector('input.create-board').value;
    if (!boardTitle) {
        return;
    }
    dataHandler.createNewBoard(boardTitle, (boardData) => {
        const boardTemplate = document.getElementById('board-template');
        const board = renderBoard(boardData, boardTemplate);
        const container = document.getElementById('boards');
        container.appendChild(board);
        const form = document.querySelector('.form.create-board');
        form.querySelector('input').value = '';
        form.classList.toggle('hidden');
    })
}

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.

        // Get relevant elements
        const createBoardButton = document.querySelector('button.create-board');
        const saveBoardButton = document.querySelector('button.save-new-board');

        // Add event listeners
        window.addEventListener('click', handleCreateBoardInputClickOutside);
        createBoardButton.addEventListener('click', handleCreateBoardButtonClick);
        saveBoardButton.addEventListener('click', handleSaveBoardButtonClick);
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
            const board = renderBoard(boardData, boardTemplate);
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
};
