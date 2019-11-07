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

function resetAddCardInput(board) {
    const input = board.querySelector('input.new-card');
    input.value = input.dataset.default;
}

function renderBoard(boardData, template) {
    const board = document.importNode(template.content, true);
    board.querySelector('.board-title').textContent = boardData.title;
    board.querySelector('.board-title').dataset.boardId = boardData.id;
    board.querySelector('.board').dataset.boardId = boardData.id;
    board.querySelector('.open-board').dataset.boardId = boardData.id;
    board.querySelector('.add-card').dataset.boardId = boardData.id;
    return board
}

const createColumns = function(status){
    const template = document.querySelector('#board-column-template');
    const clone = document.importNode(template.content, true);

    clone.querySelector('.board-column-title').textContent = status.title;
    clone.querySelector('.board-column').dataset.statusId = status.id;
    return clone;
};

const createCard = function(card){
    const template = document.querySelector('#card-template');
    const copy = document.importNode(template.content, true);

    copy.querySelector('.card-title').textContent = card.title;
    copy.querySelector('.card').dataset.cardId = card.id;
    copy.querySelector('.card-delete').cardId = card.id;

    return copy;
};

function appendBoard(board) {
    const container = $.getBoardsContainer();
    container.appendChild(board);
}

function toggleNewCardInput(board) {
    const form = board.querySelector('.form');
    form.classList.toggle('hidden');
}

function toggleAddCardButton(board) {
    const addCardButton = board.querySelector('.add-card');
    addCardButton.classList.toggle('hidden');
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
    if (event.target !== input && (event.target !== saveButton || newTitle) && !input.classList.contains('clicked')) {
        renameBoardInput.remove();
        let renamedBoard = document.querySelector('.board-title.hidden');
        if (newTitle) {
            renamedBoard.textContent = newTitle;
        }
        toggleElementDisplay(renamedBoard);
    }
    input.classList.remove('clicked');
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
        _addEventListenerToOpenButtons();
        _addEventListenerToRenameBoard();

        input.value = input.dataset.default;
        toggleElementDisplay($.getCreateBoardFormContainer());
    });
}

function handleOpenBoardClick() {
    const button = this;
    const board = document.querySelector(`.board[data-board-id="${button.dataset.boardId}"]`);
    const boardColumns = board.querySelector('.board-columns');
    const addCardButton = board.querySelector('.add-card');

    if (!boardColumns.hasChildNodes()) {
        dom.loadColumns(board);
    }

    toggleAddCardButton(board);
    boardColumns.classList.toggle('hidden');

    removeFormOnClose(board);

    function removeFormOnClose(board) {
        const form = board.querySelector('.form');
        if (!form.classList.contains('hidden')) {
            form.classList.toggle('hidden');
            toggleAddCardButton(board);
        }
    }

    addCardButton.addEventListener('click', (event) => handleAddCardClick(event));
}

function handleAddCardClick(event) {
    const button = event.target;
    const boardId = button.dataset.boardId;
    const board = document.querySelector(`.board[data-board-id="${boardId}"]`);
    toggleAddCardButton(board);
    toggleNewCardInput(board);

    const saveButton = board.querySelector('.save-card');
    saveButton.addEventListener('click', (event) => handleSaveNewCardClick(event, board));

}

function handleSaveNewCardClick(event, board) {
    const input = board.querySelector(`input.new-card`);
    const cardTitle = input.value;
    const statusId = 1; // as the acceptance criteria asks
    toggleNewCardInput(board);
    resetAddCardInput(board);

    dataHandler.createNewCard(cardTitle, board.dataset.boardId, statusId, (card) => {
        dom.showCards([card]); //passed as a length 1 list, in order to use showCards
    });

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
    document.querySelector('.rename-board-input').addEventListener('mousedown', function(event) {
        event.stopPropagation();
        event.target.classList.add('clicked');
    })
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

function _addEventListenerToRenameBoard() {
    let boardElements = document.querySelectorAll(".board");
    for (let board of boardElements) {
        board.querySelector('.board-title').addEventListener('click', displayInputToRenameBoard)
    }
}

function _addEventListenerToOpenButtons() {
    const openButtons = document.querySelectorAll('.open-board');
    for (let button of openButtons) {
        button.addEventListener('click', handleOpenBoardClick);
    }
}

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
            _addEventListenerToOpenButtons();
            _addEventListenerToRenameBoard();
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
    loadCards: function (board) {
        // retrieves cards and makes showCards called
        const boardId = board.dataset.boardId;
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            if (cards.length) {
                dom.showCards(cards);
            }
        });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        const board = document.querySelector(`.board[data-board-id="${cards[0].board_id}"]`);
        for (const card of cards) {
            const column = board.querySelector(`.board-column[data-status-id="${card.status_id}"]`);
            const cardNode = createCard(card);
            column.appendChild(cardNode);
        }
    },
    loadColumns: function (board) {
        dataHandler.getStatuses(function (statuses) {
            dom.showColumns(board, statuses);
            dom.loadCards(board)
        });
    },
    showColumns: function (board, statuses) {
        for (let status of statuses) {
            const column = createColumns(status);
            const columns = board.querySelector('.board-columns');
            columns.appendChild(column);
        }
    }
    // here comes more features
};
