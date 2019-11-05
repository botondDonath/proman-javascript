// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

function getCreateBoardInput() {
    return document.querySelector('input.create-board');
}

function getCreateBoardForm() {
    return document.querySelector('.form.create-board');
}

function getCreateBoardButton() {
    return document.querySelector('button.create-board');
}

function getSaveBoardButton() {
    return document.querySelector('button.save-board');
}

function getBoardTemplate() {
    return document.getElementById('board-template');
}

function getBoardsContainer() {
    return document.getElementById('boards');
}

function resetCreateBoardInput() {
    const input = getCreateBoardInput();
    input.value = input.dataset.default;
}

function renderBoard(boardData, template) {
    const board = document.importNode(template.content, true);
    board.querySelector('.board-title').textContent = boardData.title;
    return board
}

function appendBoard(board) {
    const container = getBoardsContainer();
    container.appendChild(board);
}

function handleCreateBoardInputClickOutside() {
    const input = getCreateBoardInput();
    if (input.value !== input.dataset.default) {
        input.value = input.dataset.default;
    }
}

function toggleCreateBoardFormDisplay() {
    const form = getCreateBoardForm();
    form.classList.toggle('hidden');
}

function focusSelectInput() {
    const input = getCreateBoardInput();
    input.focus();
    input.select();
}

function handleCreateBoardButtonClick() {
    toggleCreateBoardFormDisplay();
    focusSelectInput();
}

function handleSaveBoardButtonClick() {
    const input = getCreateBoardInput();
    const boardTitle = input.value;
    if (!boardTitle) {
        return;
    }
    dataHandler.createNewBoard(boardTitle, (boardData) => {
        const boardTemplate = getBoardTemplate();
        const board = renderBoard(boardData, boardTemplate);
        appendBoard(board);
        resetCreateBoardInput();
        toggleCreateBoardFormDisplay();
    })
}

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.

        // Get relevant elements
        const createBoardButton = getCreateBoardButton();
        const saveBoardButton = getSaveBoardButton();

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
        const boardTemplate = getBoardTemplate();
        const container = getBoardsContainer();
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
