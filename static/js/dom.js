// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";
import {util as u} from "./util.js";

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
    const container = u.getBoardsContainer();
    container.appendChild(board);
    return container.lastElementChild;
}

function showFeedback(message) {
    const feedbackContainer = document.querySelector('.feedback-container');
    const feedbackElement = document.querySelector('.feedback-message');
    feedbackElement.textContent = message;
    u.toggleElementDisplay(feedbackContainer);
    u.toggleElementDisplay(feedbackElement);
    setTimeout(() => {
        u.toggleElementDisplay(feedbackElement);
        u.toggleElementDisplay(feedbackContainer);
    }, 4000)
}

//----------------------------------------------------------------------
// EVENT HANDLERS
//----------------------------------------------------------------------

//--------------------------------------------------
// HANDLE WINDOW CLICKS
//--------------------------------------------------

function resetBoardTitleInput(activeBoardTitleInput) {
    const saveBoardTitleButton = activeBoardTitleInput.nextElementSibling;
    u.toggleElementActiveState(activeBoardTitleInput);
    u.toggleElementVisibility(saveBoardTitleButton);
    activeBoardTitleInput.value = activeBoardTitleInput.dataset.boardTitle;
}

const outsideClick = {
    handleNewBoard: function (event) {
        const createBoardInput = u.getCreateBoardInput();
        const createBoardButton = u.getCreateBoardButton();
        const createBoardFormContainer = u.getCreateBoardFormContainer();
        if (event.target !== createBoardButton || !u.isElementHidden(createBoardFormContainer)) {
            createBoardInput.value = createBoardInput.dataset.default;
            createBoardInput.blur();
        }
    },
    handleBoardTitle: function (event) {
        const activeBoardTitleInput = u.isElementTypeActive('.board-title');
        if (activeBoardTitleInput && event.target !== activeBoardTitleInput) {
            const activeSaveBoardTitleButton = activeBoardTitleInput.nextElementSibling;
            if (event.target !== activeSaveBoardTitleButton) {
                resetBoardTitleInput(activeBoardTitleInput);
            }
        }
    },
    handleNewCard: function (event) {
        const activeAddCardForm = u.isElementTypeActive('.form');
        if (activeAddCardForm) {
            const addCardButton = activeAddCardForm.previousElementSibling;
            const boardId = addCardButton.dataset.boardId;
            const openBoardButton = document.querySelector(`.open-board[data-board-id="${boardId}"]`);

            const activeNewCardInput = activeAddCardForm.querySelector('.new-card');
            const activeSaveCardButton = activeAddCardForm.querySelector('.save-card');

            const ignoredElements = [addCardButton, openBoardButton, activeNewCardInput, activeSaveCardButton];
            if (!ignoredElements.includes(event.target)) {
                u.setElementActiveState(activeAddCardForm, false);
                u.setElementDisplay(activeAddCardForm, true);
                u.setElementDisplay(addCardButton, false);
            }
        }
    },
    handleCardTitle: function (event) {
        const activeCardTitleInput = document.querySelector('.card-title.active');
        if (activeCardTitleInput) {
            const saveCardTitleButton = activeCardTitleInput.nextElementSibling;
            const deleteCardButton = saveCardTitleButton.nextElementSibling;
            const ignoredElements = [activeCardTitleInput, saveCardTitleButton, deleteCardButton];
            if (!ignoredElements.includes(event.target)) {
                u.toggleElementActiveState(activeCardTitleInput);
                activeCardTitleInput.value = activeCardTitleInput.dataset.cardTitle;
                u.toggleElementDisplay(saveCardTitleButton);
                u.toggleElementDisplay(deleteCardButton);
            }
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
    u.toggleElementActiveState(event.target);
    const createBoardForm = u.getCreateBoardFormContainer();
    createBoardForm.classList.toggle('hidden');
    if (!u.isElementHidden(createBoardForm)) {
        const input = u.getCreateBoardInput();
        u.focusSelectTextInputElement(input);
    }
}

function handleCreateBoardInputClick(event) {
    event.stopPropagation();
}

function handleCreateBoardInputEscPress(event) {
    const input = event.target;
    if (event.keyCode === globals.keyCodeEsc && u.hasElementFocus(input) && !u.isElementHidden(input)) {
        input.value = input.dataset.default;
        input.blur();
    }
}

function handleSaveBoardButtonClick(event) {
    event.preventDefault();
    const input = u.getCreateBoardInput();
    const boardTitle = input.value;
    if (!boardTitle) {
        return;
    }
    dataHandler.createNewBoard(boardTitle, (boardData) => {
        const boardTemplate = u.getBoardTemplate();
        const board = renderBoard(boardData, boardTemplate);
        const appendedBoard = appendBoard(board);
        _addEventListenerToOpenButtons(appendedBoard);
        _addEventListenerToBoardTitles(appendedBoard);
        _addEventListenerToAddCardButtons(appendedBoard);
        _addEventListenerToSaveCardButtons(appendedBoard);
        _addEventListenerToSaveBoardTitleButtons(appendedBoard);

        input.value = input.dataset.default;
        u.toggleElementDisplay(u.getCreateBoardFormContainer());
        showFeedback('Board created!');
    });
}

//--------------------------------------------------
// RENAME BOARD
//--------------------------------------------------

function renameBoard(event) {
    const saveBoardTitleButton = event.target;
    const boardTitleInput = saveBoardTitleButton.previousElementSibling;
    const boardData = {
        id: saveBoardTitleButton.dataset.boardId,
        title: boardTitleInput.value
    };
    dataHandler.renameBoard(boardData, responseBoardData => {
        u.toggleElementActiveState(boardTitleInput);
        boardTitleInput.dataset.boardTitle = responseBoardData.title;
        u.toggleElementVisibility(saveBoardTitleButton);
        showFeedback('Board renamed!');
    })
}

function toggleBoardTitleInput(event) {
    const boardTitleInput = event.target;
    const activeBoardTitleInput = u.isElementTypeActive('.board-title');
    if (activeBoardTitleInput && activeBoardTitleInput !== event.target) {
        event.stopPropagation();
        const clickOutsideActiveInput = new Event('click');
        window.dispatchEvent(clickOutsideActiveInput);
    }
    const saveBoardTitleButton = boardTitleInput.nextElementSibling;
    if (!u.isElementVisible(saveBoardTitleButton)) {
        u.focusSelectTextInputElement(boardTitleInput);
        u.toggleElementVisibility(saveBoardTitleButton);
        u.toggleElementActiveState(boardTitleInput);
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

    if (u.isElementHidden(boardColumns)) {
        u.setElementDisplay(form, true);
        u.setElementActiveState(form, false);
        u.setElementDisplay(addCardButton, true)
    } else {
        u.setElementDisplay(addCardButton, false);
    }

}

//--------------------------------------------------
// RENAME COLUMN
//--------------------------------------------------

function renameColumn(event) {
    const saveButton = event.target;
    const columnTitle = saveButton.parentNode.querySelector('.board-column-title');
    dataHandler.renameColumn(columnTitle.value, columnTitle.dataset.statusId);
    u.toggleElementDisplay(saveButton);
    showFeedback('Column renamed!');
}

function handleRenameColumnClick(event) {
    const input = event.target;
    const saveButton = input.parentNode.querySelector('.save-column-title');
    u.toggleElementDisplay(saveButton);
    saveButton.addEventListener('click', renameColumn);
}

//--------------------------------------------------
// CREATE CARD
//--------------------------------------------------

function handleAddCardClick(event) {
    if (u.isElementTypeActive('.form')) {
        event.stopPropagation();
        const clickOutsideActiveForm = new Event('click');
        window.dispatchEvent(clickOutsideActiveForm);
    }
    const button = event.target;
    const boardId = button.dataset.boardId;
    const board = document.querySelector(`.board[data-board-id="${boardId}"]`);
    const form = board.querySelector('.form');
    u.setElementDisplay(button, true);
    u.setElementDisplay(form, false);
    u.setElementActiveState(form, true);
}

function handleSaveNewCardClick(event, board) {
    const input = board.querySelector(`input.new-card`);
    const cardTitle = input.value;
    const statusId = 1; // as the acceptance criteria asks
    const form = board.querySelector('.form');
    u.setElementDisplay(form, true);
    resetAddCardInput(board);

    dataHandler.createNewCard(cardTitle, board.dataset.boardId, statusId, (card) => {
        dom.showCards([card]); //passed as a length 1 list, in order to use showCards
        const addCardButton = board.querySelector('button.add-card');
        u.setElementDisplay(addCardButton, false);
        showFeedback('Card created!');
    });

}

//--------------------------------------------------
// RENAME CARD
//--------------------------------------------------

function toggleCardTitleInput(event) {
    const cardTitleInput = event.target;
    if (!u.isElementActive(cardTitleInput)) {
        u.searchAndDeactivateElementType(event, 'input.card-title');
    }
    const saveButton = cardTitleInput.nextElementSibling;
    const deleteButton = saveButton.nextElementSibling;
    if (u.isElementHidden(saveButton)) {
        u.toggleElementDisplay(saveButton);
        u.toggleElementDisplay(deleteButton);
        u.focusSelectTextInputElement(cardTitleInput);
        u.setElementActiveState(cardTitleInput, true);
    }
}

function renameCard(event) {
    const saveButton = event.target;
    const cardTitleInput = saveButton.previousElementSibling;
    const cardData = {
        id: saveButton.dataset.cardId,
        title: cardTitleInput.value
    };
    dataHandler.renameCard(cardData, cardData => {
        cardTitleInput.value = cardData.title;
        cardTitleInput.dataset.cardTitle = cardData.title;
        u.toggleElementDisplay(saveButton.nextElementSibling);
        u.toggleElementDisplay(saveButton);
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
    const selectionRoot = board ? board : document;
    const boardTitleInputs = selectionRoot.querySelectorAll('.board-title');
    for (const boardTitleInput of boardTitleInputs) {
        boardTitleInput.addEventListener('click', toggleBoardTitleInput);
    }
}

function _addEventListenerToOpenButtons(board = null) {
    const selectionRoot = board ? board : document;
    const openButtons = selectionRoot.querySelectorAll('.open-board');
    for (const button of openButtons) {
        button.addEventListener('click', handleOpenBoardClick);
    }
}

function _addEventListenerToAddCardButtons(board = null) {
    const selectionRoot = board ? board : document;
    const addCardButtons = selectionRoot.querySelectorAll('button.add-card');
    for (const button of addCardButtons) {
        button.addEventListener('click', (event) => handleAddCardClick(event));
    }
}

function _addEventListenerToSaveCardButtons(board = null) {
    const selectionRoot = board ? board : document;
    const saveButtons = selectionRoot.querySelectorAll('.save-card');
    for (const button of saveButtons) {
        const board = u.getBoardById(button.dataset.boardId);
        button.addEventListener('click', (event) => handleSaveNewCardClick(event, board));
    }
}

function _addEventListenerToSaveBoardTitleButtons(board = null) {
    const selectionRoot = board ? board : document;
    const saveBoardButtons = selectionRoot.querySelectorAll('.save-board-title');
    for (const button of saveBoardButtons) {
        button.addEventListener('click', renameBoard);
    }
}

//----------------------------------------------------------------------
// OBJECT WITH FUNCTIONS FOR EXPORT
//----------------------------------------------------------------------

export const dom = {
    init: function () {
        // This function should run once, when the page is loaded.

        // Get relevant elements
        const createBoardButton = u.getCreateBoardButton();
        const saveBoardButton = u.getSaveBoardButton();
        const createBoardInput = u.getCreateBoardInput();

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
        const boardTemplate = u.getBoardTemplate();
        const container = u.getBoardsContainer();
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
            dom.loadCards(board);
            const columnTitles = document.querySelectorAll('.board-column-title');
            for (const column of columnTitles) {
                column.addEventListener('click', handleRenameColumnClick)
            }

        });
    },
    showColumns: function (board, statuses) {
        for (const status of statuses) {
            const column = createColumns(status, board);
            const columns = board.querySelector('.board-columns');
            columns.appendChild(column);
        }
    }
    // here comes more features
};
