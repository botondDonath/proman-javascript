// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";
import {query as $} from "./query.js";

//----------------------------------------------------------------------
// GLOBALS
//----------------------------------------------------------------------

const globals = {
    keyCodeEsc: 27,
};

//----------------------------------------------------------------------
// FUNCTIONS EXTRACTED FOR THE SAKE OF CLEANER CODE
//----------------------------------------------------------------------

function renderBoard(boardData, template) {
    const board = document.importNode(template.content, true);
    board.querySelector('.board-title').textContent = boardData.title;
    board.querySelector('.board-title').dataset.boardId = boardData.id;
    return board
}

function appendBoard(board) {
    const container = $.getBoardsContainer();
    container.appendChild(board);
}

function focusSelectTextInputElement(element) {
    element.focus();
    element.select();
}

function toggleElementDisplay(element) {
    element.classList.toggle('hidden');
}

function isElementHidden(element) {
    return element.classList.contains('hidden');
}

function hasElementFocus(element) {
    return document.activeElement === element;
}

//----------------------------------------------------------------------
// EVENT HANDLERS
//----------------------------------------------------------------------

function handleCreateBoardButtonClick(event) {
    event.stopPropagation();
    const createBoardForm = $.getCreateBoardFormContainer();
    createBoardForm.classList.toggle('hidden');
    if (!isElementHidden(createBoardForm)) {
        const input = $.getCreateBoardInput();
        focusSelectTextInputElement(input);
    }
}

function handleCreateBoardInputClickOutside() {
    const input = $.getCreateBoardInput();
    input.value = input.dataset.default;
    input.blur();
}

function handleCreateBoardInputClick(event) {
    event.stopPropagation();
}

function handleCreateBoardInputEscPress(event) {
    const input = event.target;
    if (event.keyCode === globals.keyCodeEsc && hasElementFocus(input) && !isElementHidden(input)) {
        input.value = input.dataset.default;
        input.blur();
    }
}

function handleSaveBoardButtonClick(event) {
    event.preventDefault();
    const input = $.getCreateBoardInput();
    const boardTitle = input.value;
    if (!boardTitle) {
        return;
    }
    dataHandler.createNewBoard(boardTitle, (boardData) => {
        const boardTemplate = $.getBoardTemplate();
        const board = renderBoard(boardData, boardTemplate);
        appendBoard(board);

        input.value = input.dataset.default;
        toggleElementDisplay($.getCreateBoardFormContainer());
    })
}

function renameBoard(event) {
    event.stopPropagation();
    let boardTitleElement = event.target;
    let boardTitle = boardTitleElement.textContent;
    let boardId = boardTitleElement.dataset.boardId;
    toggleElementDisplay(boardTitleElement)
}

//----------------------------------------------------------------------
// OBJECT WITH FUNCTIONS FOR EXPORT
//----------------------------------------------------------------------

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.

        // Get relevant elements
        const createBoardButton = $.getCreateBoardButton();
        const saveBoardButton = $.getSaveBoardButton();
        const createBoardInput = $.getCreateBoardInput();

        // Add event listeners
        window.addEventListener('click', handleCreateBoardInputClickOutside);
        createBoardButton.addEventListener('click', handleCreateBoardButtonClick);
        saveBoardButton.addEventListener('click', handleSaveBoardButtonClick);
        createBoardInput.addEventListener('click', handleCreateBoardInputClick);
        createBoardInput.addEventListener('keyup', handleCreateBoardInputEscPress);
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
            let boardElements = document.querySelectorAll(".board");
            for (let board of boardElements) {
                board.querySelector('.board-title').addEventListener('click', renameBoard)
            }
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        const boardTemplate = $.getBoardTemplate();
        const container = $.getBoardsContainer();
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
