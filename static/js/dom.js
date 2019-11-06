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


function resetBoardTitleIfNecessary(event, newTitle=null) {
    const renameBoardInput = document.querySelector('.rename-board-container');
    if (!renameBoardInput) {
        return;
    }
    let saveButton = document.querySelector('.save-board-title');
    let input = document.querySelector('.rename-board-input');
    if (event.target !== input && (event.target !== saveButton || newTitle)) {
        renameBoardInput.remove();
        let renamedBoard = document.querySelector('.board-title.hidden');
        if (newTitle) {
            renamedBoard.textContent = newTitle;
        }
        toggleElementDisplay(renamedBoard);
    }
}

function handleOutsideClick(event) {
    const createBoardInput = $.getCreateBoardInput();
    createBoardInput.value = createBoardInput.dataset.default;
    createBoardInput.blur();
    resetBoardTitleIfNecessary(event);

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

function displayInputToRenameBoard(event) {
    event.stopPropagation();
    resetBoardTitleIfNecessary(event);
    let boardTitleElement = event.target;
    let boardTitle = boardTitleElement.textContent;
    let boardId = boardTitleElement.dataset.boardId;
    toggleElementDisplay(boardTitleElement);
    let inputContainer = document.createElement('div');
    inputContainer.classList.add("rename-board-container");
    let input = document.createElement('input');
    input.classList.add('rename-board-input');
    input.type = "text";
    input.setAttribute('value', `${boardTitle}`);
    inputContainer.appendChild(input);
    let button = document.createElement('button');
    button.classList.add('save-board-title');
    button.type = "button";
    button.dataset.boardId = boardId;
    button.textContent = "Save";
    inputContainer.appendChild(button);
    boardTitleElement.parentNode.insertAdjacentHTML('afterbegin', inputContainer.outerHTML);
    document.querySelector('.save-board-title').addEventListener('click', renameBoard);
}

function renameBoard(event) {
    event.stopPropagation();
    let button = event.target;
    let boardData = {
        id: button.dataset.boardId,
        title: document.querySelector('.rename-board-input').value
    };
    dataHandler.renameBoard(boardData, boardData => {
        resetBoardTitleIfNecessary(event, boardData.title);

    })

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
        window.addEventListener('click', handleOutsideClick);
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
                board.querySelector('.board-title').addEventListener('click', displayInputToRenameBoard)
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
