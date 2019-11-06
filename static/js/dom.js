// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

//----------------------------------------------------------------------
// FUNCTIONS TO GET ELEMENTS
//----------------------------------------------------------------------

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

//----------------------------------------------------------------------
// FUNCTIONS EXTRACTED FOR THE SAKE OF CLEANER CODE
//----------------------------------------------------------------------

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

function toggleCreateBoardFormDisplay() {
    const form = getCreateBoardForm();
    form.classList.toggle('hidden');
}

function focusSelectTextInputElement(element) {
    element.focus();
    element.select();
}

const createColumns = function(status){
    const template = document.querySelector('#board-column-template');
    const clone = document.importNode(template.content, true);

    clone.querySelector('.board-column-title').textContent = status.title;

    return clone;
};

//----------------------------------------------------------------------
// EVENT HANDLERS
//----------------------------------------------------------------------

function handleCreateBoardInputClickOutside() {
    const input = getCreateBoardInput();
    if (input.value !== input.dataset.default) {
        input.value = input.dataset.default;
    }
}

function handleCreateBoardButtonClick() {
    toggleCreateBoardFormDisplay();
    const input = getCreateBoardInput();
    focusSelectTextInputElement(input);
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

function handleOpenBoardClick() {
    const button = this;
    const board = button.parentNode.parentNode;
    console.log(board);
    dom.loadColumns(board);
}

//----------------------------------------------------------------------
// OBJECT WITH FUNCTIONS FOR EXPORT
//----------------------------------------------------------------------

const createCard = function(card){
    const template = document.querySelector('#card-template');
    const copy = document.importNode(template.content, true);

    copy.querySelector('.card-title').textContent = card.title;

    return copy;
};

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
            const openButtons = document.querySelectorAll('.open-board');
            console.log(openButtons);
            for (let button of openButtons) {
                button.addEventListener('click', handleOpenBoardClick);
                }
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
    loadCards: function () {
        // retrieves cards and makes showCards called
        const board = this;
        const boardId = board.dataset.boardId;
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
        });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let cardNodes = [];
        for (let card of cards) {
            cardNodes.push(createCard(card));
        }

        for (let cardNode of cardNodes) {

        }
    },
    loadColumns: function (board) {
        alert('AI');
        dataHandler.getStatuses(function (statuses) {
            dom.showColumns(board, statuses);
        });
    },
    showColumns: function (board, statuses) {
        for (let status of statuses) {
            const column = createColumns(status);
            board.appendChild(column)
        }
        // loadcards, showcards
    }
    // here comes more features
};
