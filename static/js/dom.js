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
    board.querySelector('button.add-card').dataset.boardId = boardData.id;
    board.querySelector('.save-card').dataset.boardId = boardData.id;
    board.querySelector('.open-board').dataset.boardId = boardData.id;
    return board
}

const createColumns = function (status, board) {
    const template = document.querySelector('#board-column-template');
    const clone = document.importNode(template.content, true);

    clone.querySelector('.board-column-title').value = status.title;
    clone.querySelector('.board-column').dataset.statusId = status.id;
    clone.querySelector('.board-column-title').dataset.statusId = status.id;
    clone.querySelector('.board-column-title').dataset.boardId = board.dataset.boardId;

    return clone;
};

const createCard = function (card) {
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
    return container.lastElementChild;
}

function showFeedback(message) {
    let feedbackContainer = document.querySelector('.feedback-container');
    let feedbackElement = document.querySelector('.feedback-message');
    feedbackElement.textContent = message;
    $.toggleElementDisplay(feedbackContainer);
    $.toggleElementDisplay(feedbackElement);
    setTimeout(() => {
        $.toggleElementDisplay(feedbackElement);
        $.toggleElementDisplay(feedbackContainer);
    }, 4000)
}

//----------------------------------------------------------------------
// EVENT HANDLERS
//----------------------------------------------------------------------

//--------------------------------------------------
// HANDLE WINDOW CLICKS
//--------------------------------------------------

function resetBoardTitleInput(activeBoardTitleInput) {
    let saveBoardTitleButton = activeBoardTitleInput.nextElementSibling;
    $.toggleElementActiveState(activeBoardTitleInput);
    $.toggleElementVisibility(saveBoardTitleButton);
    activeBoardTitleInput.value = activeBoardTitleInput.dataset.boardTitle;
}

let outsideClick = {
    handleNewBoard: function () {
        let createBoardInput = $.getCreateBoardInput();
        let createBoardButton = $.getCreateBoardButton();
        let createBoardFormContainer = $.getCreateBoardFormContainer();
        if (event.target !== createBoardButton || !$.isElementHidden(createBoardFormContainer)) {
            createBoardInput.value = createBoardInput.dataset.default;
            createBoardInput.blur();
        }
    },
    handleBoardTitle: function () {
        let activeBoardTitleInput = $.isElementTypeActive('.board-title');
        if (activeBoardTitleInput && event.target !== activeBoardTitleInput) {
            let activeSaveBoardTitleButton = activeBoardTitleInput.nextElementSibling;
            if (event.target !== activeSaveBoardTitleButton) {
                resetBoardTitleInput(activeBoardTitleInput);
            }
        }
    },
    handleNewCard: function (event) {
        let activeAddCardForm = $.isElementTypeActive('.form');
        if (activeAddCardForm) {
            let addCardButton = activeAddCardForm.previousElementSibling;
            let boardId = addCardButton.dataset.boardId;
            let openBoardButton = document.querySelector(`.open-board[data-board-id="${boardId}"]`);

            let activeNewCardInput = activeAddCardForm.querySelector('.new-card');
            let activeSaveCardButton = activeAddCardForm.querySelector('.save-card');

            let ignoredElements = [addCardButton, openBoardButton, activeNewCardInput, activeSaveCardButton];
            if (!ignoredElements.includes(event.target)) {
                $.setElementActiveState(activeAddCardForm, false);
                $.setElementDisplay(activeAddCardForm, true);
                $.setElementDisplay(addCardButton, false);
            }
        }
    },
    handleCardTitle: function (event) {
        let saveCardTitleButton = document.querySelector('.card-save-title');
        if (!saveCardTitleButton) {
            return;
        }
        let cardTitleInput = document.querySelector('.card-title');
        let ignoredElements = [saveCardTitleButton, cardTitleInput];
        if (!ignoredElements.includes(event.target) && !$.isElementHidden(saveCardTitleButton)) {
            $.toggleElementDisplay(saveCardTitleButton);
            $.toggleElementDisplay(saveCardTitleButton.nextElementSibling);
            cardTitleInput.value = cardTitleInput.dataset.cardTitle;
        }
    }
};

function handleOutsideClick(event) {
    outsideClick.handleNewBoard(event);
    outsideClick.handleBoardTitle(event);
    outsideClick.handleNewCard(event);
    outsideClick.handleCardTitle(event);
}

//--------------------------------------------------
// CREATE BOARD
//--------------------------------------------------

function handleCreateBoardButtonClick(event) {
    $.toggleElementActiveState(event.target);
    const createBoardForm = $.getCreateBoardFormContainer();
    createBoardForm.classList.toggle('hidden');
    if (!$.isElementHidden(createBoardForm)) {
        const input = $.getCreateBoardInput();
        $.focusSelectTextInputElement(input);
    }
}

function handleCreateBoardInputClick(event) {
    event.stopPropagation();
}

function handleCreateBoardInputEscPress(event) {
    const input = event.target;
    if (event.keyCode === globals.keyCodeEsc && $.hasElementFocus(input) && !$.isElementHidden(input)) {
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
        let appendedBoard = appendBoard(board);
        _addEventListenerToOpenButtons(appendedBoard);
        _addEventListenerToBoardTitles(appendedBoard);
        _addEventListenerToAddCardButtons(appendedBoard);
        _addEventListenerToSaveCardButtons(appendedBoard);
        _addEventListenerToSaveBoardTitleButtons(appendedBoard);

        input.value = input.dataset.default;
        $.toggleElementDisplay($.getCreateBoardFormContainer());
        showFeedback('Board created!');
    });
}

//--------------------------------------------------
// RENAME BOARD
//--------------------------------------------------

function renameBoard(event) {
    let saveBoardTitleButton = event.target;
    let boardTitleInput = saveBoardTitleButton.previousElementSibling;
    let boardData = {
        id: saveBoardTitleButton.dataset.boardId,
        title: boardTitleInput.value
    };
    dataHandler.renameBoard(boardData, responseBoardData => {
        $.toggleElementActiveState(boardTitleInput);
        boardTitleInput.dataset.boardTitle = responseBoardData.title;
        $.toggleElementVisibility(saveBoardTitleButton);
        showFeedback('Board renamed!');
    })
}

function toggleBoardTitleInput(event) {
    let boardTitleInput = event.target;
    let activeBoardTitleInput = $.isElementTypeActive('.board-title');
    if (activeBoardTitleInput && activeBoardTitleInput !== event.target) {
        event.stopPropagation();
        let clickOutsideActiveInput = new Event('click');
        window.dispatchEvent(clickOutsideActiveInput);
    }
    let saveBoardTitleButton = boardTitleInput.nextElementSibling;
    if (!$.isElementVisible(saveBoardTitleButton)) {
        $.focusSelectTextInputElement(boardTitleInput);
        $.toggleElementVisibility(saveBoardTitleButton);
        $.toggleElementActiveState(boardTitleInput);
    }
}

//--------------------------------------------------
// OPEN BOARD
//--------------------------------------------------

function handleOpenBoardClick(event) {
    const button = event.target;
    const board = document.querySelector(`.board[data-board-id="${button.dataset.boardId}"]`);
    const boardColumns = board.querySelector('.board-columns');
    const addCardButton = board.querySelector('button.add-card');
    const form = board.querySelector('.form');

    if (!boardColumns.hasChildNodes()) {
        dom.loadColumns(board);
    }

    if (!boardColumns.classList.toggle('hidden')) {
        button.innerHTML = '&#9651';
    } else {
        button.innerHTML = '&#9661';
    }

    if ($.isElementHidden(boardColumns)) {
        $.setElementDisplay(form, true);
        $.setElementActiveState(form, false);
        $.setElementDisplay(addCardButton, true)
    } else {
        $.setElementDisplay(addCardButton, false);
    }

}

//--------------------------------------------------
// RENAME COLUMN
//--------------------------------------------------

function renameColumn(event) {
    let saveButton = event.target;
    let columnTitle = saveButton.parentNode.querySelector('.board-column-title');
    dataHandler.renameColumn(columnTitle.value, columnTitle.dataset.statusId);
    $.toggleElementDisplay(saveButton);
    showFeedback('Column renamed!');
}

function handleRenameColumnClick(event) {
    let input = event.target;
    let saveButton = input.parentNode.querySelector('.save-column-title');
    $.toggleElementDisplay(saveButton);
    saveButton.addEventListener('click', renameColumn);
}

//--------------------------------------------------
// CREATE CARD
//--------------------------------------------------

function handleAddCardClick(event) {
    if ($.isElementTypeActive('.form')) {
        event.stopPropagation();
        let clickOutsideActiveForm = new Event('click');
        window.dispatchEvent(clickOutsideActiveForm);
    }
    const button = event.target;
    const boardId = button.dataset.boardId;
    const board = document.querySelector(`.board[data-board-id="${boardId}"]`);
    let form = board.querySelector('.form');
    $.setElementDisplay(button, true);
    $.setElementDisplay(form, false);
    $.setElementActiveState(form, true);
}

function handleSaveNewCardClick(event, board) {
    const input = board.querySelector(`input.new-card`);
    const cardTitle = input.value;
    const statusId = 1; // as the acceptance criteria asks
    let form = board.querySelector('.form');
    $.setElementDisplay(form, true);
    resetAddCardInput(board);

    dataHandler.createNewCard(cardTitle, board.dataset.boardId, statusId, (card) => {
        dom.showCards([card]); //passed as a length 1 list, in order to use showCards
        let addCardButton = board.querySelector('button.add-card');
        $.setElementDisplay(addCardButton, false);
        showFeedback('Card created!');
    });

}

//--------------------------------------------------
// RENAME CARD
//--------------------------------------------------

function toggleCardTitleInput(event) {
    const cardTitleInput = event.target;
    const saveButton = cardTitleInput.nextElementSibling;
    const deleteButton = saveButton.nextElementSibling;
    if ($.isElementHidden(saveButton)) {
        $.toggleElementDisplay(saveButton);
        $.toggleElementDisplay(deleteButton);
        $.focusSelectTextInputElement(cardTitleInput)
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
        cardTitleInput.dataset.cardTitle = cardData.title;
        $.toggleElementDisplay(saveButton.nextElementSibling);
        $.toggleElementDisplay(saveButton);
        showFeedback('Card renamed!');
    })
}

//--------------------------------------------------
// DELETE CARD
//--------------------------------------------------

function deleteCard(event) {
    const button = event.target;
    const cardId = button.dataset.cardId;
    dataHandler.deleteCard(cardId);
    const cardToDelete = button.parentNode;
    cardToDelete.remove();
    showFeedback('Card deleted!');
}

//----------------------------------------------------------------------
// ADD EVENT HANDLERS WHEN LOADING BOARDS OR ONE BOARD
//----------------------------------------------------------------------

function _addEventListenerToBoardTitles(board = null) {
    let selectionRoot = board ? board : document;
    let boardTitleInputs = selectionRoot.querySelectorAll('.board-title');
    for (let boardTitleInput of boardTitleInputs) {
        boardTitleInput.addEventListener('click', toggleBoardTitleInput);
    }
}

function _addEventListenerToOpenButtons(board = null) {
    let selectionRoot = board ? board : document;
    let openButtons = selectionRoot.querySelectorAll('.open-board');
    for (let button of openButtons) {
        button.addEventListener('click', handleOpenBoardClick);
    }
}

function _addEventListenerToAddCardButtons(board = null) {
    let selectionRoot = board ? board : document;
    let addCardButtons = selectionRoot.querySelectorAll('button.add-card');
    for (let button of addCardButtons) {
        button.addEventListener('click', (event) => handleAddCardClick(event));
    }
}

function _addEventListenerToSaveCardButtons(board = null) {
    let selectionRoot = board ? board : document;
    let saveButtons = selectionRoot.querySelectorAll('.save-card');
    for (let button of saveButtons) {
        let board = $.getBoardById(button.dataset.boardId);
        button.addEventListener('click', (event) => handleSaveNewCardClick(event, board));
    }
}

function _addEventListenerToSaveBoardTitleButtons(board = null) {
    let selectionRoot = board ? board : document;
    let saveBoardButtons = selectionRoot.querySelectorAll('.save-board-title');
    for (let button of saveBoardButtons) {
        button.addEventListener('click', renameBoard);
    }
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
            _addEventListenerToOpenButtons();
            _addEventListenerToBoardTitles();
            _addEventListenerToAddCardButtons();
            _addEventListenerToSaveCardButtons();
            _addEventListenerToSaveBoardTitleButtons();
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
        const boardId = board.dataset.boardId;
        dataHandler.getStatuses(boardId, function (statuses) {
            dom.showColumns(board, statuses);
            dom.loadCards(board);
            let columnTitles = document.querySelectorAll('.board-column-title');
            for (let column of columnTitles) {
                column.addEventListener('click', handleRenameColumnClick)
            }

        });
    },
    showColumns: function (board, statuses) {
        for (let status of statuses) {
            const column = createColumns(status, board);
            const columns = board.querySelector('.board-columns');
            columns.appendChild(column);
        }
    }
    // here comes more features
};
