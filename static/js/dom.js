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
    board.querySelector('.board').dataset.boardId = boardData.id;
    board.querySelector('.board-title').value = boardData.title;
    board.querySelector('.board-title').dataset.boardTitle = boardData.title;
    board.querySelector('.board-title').dataset.boardId = boardData.id;
    board.querySelector('.save-board-title').dataset.boardId = boardData.id;
    board.querySelector('.add-card').dataset.boardId = boardData.id;
    board.querySelector('.open-board').dataset.boardId = boardData.id;
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

    copy.querySelector('.card-title').value = card.title;
    copy.querySelector('.card-title').dataset.cardTitle = card.title;
    copy.querySelector('.card').dataset.cardId = card.id;
    copy.querySelector('.card-save-title').dataset.cardId = card.id;
    copy.querySelector('.card-delete').dataset.cardId = card.id;

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

function toggleElementActiveState(element) {
    element.classList.toggle('active');
}

function isElementTypeActive(selectors) {
    return document.querySelector(`${selectors}.active`);
}

//----------------------------------------------------------------------
// EVENT HANDLERS
//----------------------------------------------------------------------

function handleCreateBoardButtonClick(event) {
    const createBoardForm = $.getCreateBoardFormContainer();
    createBoardForm.classList.toggle('hidden');
    if (!isElementHidden(createBoardForm)) {
        const input = $.getCreateBoardInput();
        focusSelectTextInputElement(input);
    }
}

function resetBoardTitleInput(activeBoardTitleInput) {
    let saveBoardTitleButton = activeBoardTitleInput.nextElementSibling;
    toggleElementActiveState(activeBoardTitleInput);
    toggleElementDisplay(saveBoardTitleButton);
    activeBoardTitleInput.value = activeBoardTitleInput.dataset.boardTitle;
}

function resetCardTitleInputIfNecessary(event) {
    let saveCardTitleButton = document.querySelector('.card-save-title');
    if (!saveCardTitleButton) {
        return;
    }
    let cardTitleInput = document.querySelector('.card-title');
    let ignoredElements = [saveCardTitleButton, cardTitleInput];
    if (!ignoredElements.includes(event.target) && !isElementHidden(saveCardTitleButton)) {
        toggleElementDisplay(saveCardTitleButton);
        toggleElementDisplay(saveCardTitleButton.nextElementSibling);
        cardTitleInput.value = cardTitleInput.dataset.cardTitle;
    }
}

function handleOutsideClick(event) {
    let createBoardInput = $.getCreateBoardInput();
    let createBoardButton = $.getCreateBoardButton();
    let createBoardFormContainer = $.getCreateBoardFormContainer();
    if (event.target !== createBoardButton || !isElementHidden(createBoardFormContainer)) {
        createBoardInput.value = createBoardInput.dataset.default;
        createBoardInput.blur();
    }
    let activeBoardTitleInput = isElementTypeActive('.board-title');
    if (activeBoardTitleInput && event.target !== activeBoardTitleInput) {
        let activeSaveBoardTitleButton = activeBoardTitleInput.nextElementSibling;
        if (event.target !== activeSaveBoardTitleButton) {
            resetBoardTitleInput(activeBoardTitleInput);
        }
    }
    resetCardTitleInputIfNecessary(event);
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

//------------------------------------------------------------
// RENAME BOARD
//------------------------------------------------------------

function toggleBoardTitleInput(event) {
    let boardTitleInput = event.target;
    let activeBoardTitleInput = isElementTypeActive('.board-title');
    if (activeBoardTitleInput && activeBoardTitleInput !== event.target) {
        event.stopPropagation();
        let clickOutsideActiveInput = new Event('click');
        window.dispatchEvent(clickOutsideActiveInput);
    }
    let saveBoardTitleButton = boardTitleInput.nextElementSibling;
    if (isElementHidden(saveBoardTitleButton)) {
        focusSelectTextInputElement(boardTitleInput);
        toggleElementDisplay(saveBoardTitleButton);
        toggleElementActiveState(boardTitleInput);
        saveBoardTitleButton.addEventListener('click', renameBoard);
    }
}

function renameBoard(event) {
    let saveBoardTitleButton = event.target;
    let boardTitleInput = saveBoardTitleButton.previousElementSibling;
    let boardData = {
        id: saveBoardTitleButton.dataset.boardId,
        title: boardTitleInput.value
    };
    dataHandler.renameBoard(boardData, responseBoardData => {
        toggleElementDisplay(saveBoardTitleButton);
        toggleElementActiveState(boardTitleInput);
        boardTitleInput.dataset.boardTitle = responseBoardData.title;
    })
}

//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------


function deleteCard(event) {
    const button = event.target;
    const cardId = button.dataset.cardId;
    dataHandler.deleteCard(cardId);
    const cardToDelete = button.parentNode;
    cardToDelete.remove();
}

function toggleCardTitleInput(event) {
    const cardTitleInput = event.target;
    const saveButton = cardTitleInput.nextElementSibling;
    const deleteButton = saveButton.nextElementSibling;
    if (isElementHidden(saveButton)) {
        toggleElementDisplay(saveButton);
        toggleElementDisplay(deleteButton);
        focusSelectTextInputElement(cardTitleInput)
    }
}

function renameCard(event) {
    let saveButton = event.target;
    let cardTitleInput = saveButton.previousElementSibling;
    let cardData = {
        id: saveButton.dataset.cardId,
        title: cardTitleInput.value
    };
    dataHandler.renameCard(cardData, cardData => {
        cardTitleInput.value = cardData.title;
        toggleElementDisplay(saveButton.nextElementSibling);
        toggleElementDisplay(saveButton);
    })
}

//----------------------------------------------------------------------
// OBJECT WITH FUNCTIONS FOR EXPORT
//----------------------------------------------------------------------

function _addEventListenerToRenameBoard() {
    let boardElements = document.querySelectorAll(".board");
    for (let board of boardElements) {
        board.querySelector('.board-title').addEventListener('click', toggleBoardTitleInput)
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
            const cardTitle = cardNode.querySelector('.card-title');
            const saveButton = cardNode.querySelector('.card-save-title');
            const deleteButton = cardNode.querySelector('.card-delete');
            cardTitle.addEventListener('click', toggleCardTitleInput);
            saveButton.addEventListener('click', renameCard);
            deleteButton.addEventListener('click', (event) => deleteCard(event));
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
