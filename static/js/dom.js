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
    board.querySelector('button.add-column').dataset.boardId = boardData.id;
    board.querySelector('.save-card').dataset.boardId = boardData.id;
    board.querySelector('.save-column').dataset.boardId = boardData.id;
    board.querySelector('.open-board').dataset.boardId = boardData.id;
    return board
}

const createColumns = function (status, board) {
    const template = document.querySelector('#board-column-template');
    const clone = document.importNode(template.content, true);
    const columnTitleInput = clone.querySelector('.board-column-title');

    columnTitleInput.value = status.title;
    columnTitleInput.dataset.title = status.title;
    columnTitleInput.dataset.statusId = status.id;
    columnTitleInput.dataset.boardId = board.dataset.boardId;
    clone.querySelector('.board-column').dataset.statusId = status.id;

    return clone;
};

const createCard = function (card) {
    const template = document.querySelector('#card-template');
    const copy = document.importNode(template.content, true);

    copy.querySelector('.card-title').value = card.title;
    copy.querySelector('.card-title').dataset.cardTitle = card.title;
    copy.querySelector('.card').dataset.cardId = card.id;
    copy.querySelector('.card').dataset.order = card.order;
    copy.querySelector('.card').dataset.boardId = card.board_id;
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
    u.toggleElementDisplay(saveBoardTitleButton);
    activeBoardTitleInput.value = activeBoardTitleInput.dataset.boardTitle;
}

const outsideClick = {
    handleNewBoard: function (event) {
        const createBoardInput = u.getCreateBoardInput();
        const createBoardButton = u.getCreateBoardButton();
        if (event.target !== createBoardButton) {
            createBoardInput.value = createBoardInput.dataset.default;
            createBoardInput.blur();
        }
    },
    handleBoardTitle: function (event) {
        const activeBoardTitleInput = u.isElementTypeActive('.board-title');
        if (activeBoardTitleInput) {
            const activeSaveBoardTitleButton = activeBoardTitleInput.nextElementSibling;
            const ignoredElements = [activeBoardTitleInput, activeSaveBoardTitleButton];
            if (!ignoredElements.includes(event.target)) {
                resetBoardTitleInput(activeBoardTitleInput);
            }
        }
    },
    handleNewCard: function (event) {
        const activeAddCardForm = u.isElementTypeActive('.add-card-form');
        if (activeAddCardForm) {
            const addCardButton = activeAddCardForm.previousElementSibling;
            const boardId = addCardButton.dataset.boardId;
            const openBoardButton = document.querySelector(`.open-board[data-board-id="${boardId}"]`);

            const activeNewCardInput = activeAddCardForm.querySelector('.new-card');
            const activeSaveCardButton = activeAddCardForm.querySelector('.save-card');

            const ignoredElements = [
                addCardButton,
                openBoardButton,
                activeNewCardInput,
                activeSaveCardButton
            ];
            if (!ignoredElements.includes(event.target) && !addCardButton.contains(event.target)) {
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
    },
    handleColumnTitle: function (event) {
        const activeColumnTitleInput = document.querySelector('.board-column-title.active');
        if (activeColumnTitleInput) {
            const activeSaveColumnTitleButton = activeColumnTitleInput.nextElementSibling;
            const ignoredElements = [activeColumnTitleInput, activeSaveColumnTitleButton];
            if (!ignoredElements.includes(event.target)) {
                u.toggleElementActiveState(activeColumnTitleInput);
                activeColumnTitleInput.value = activeColumnTitleInput.dataset.title;
                u.toggleElementDisplay(activeSaveColumnTitleButton);
            }
        }
    },
    handleNewColumn: function (event) {
        const activeAddColumnForm = u.isElementTypeActive('.add-column-form');
        if (activeAddColumnForm) {
            const container = activeAddColumnForm.parentNode;
            const addColumnButton = container.querySelector('button.add-column');
            if (event.target === window || (
                ![activeAddColumnForm, addColumnButton].includes(event.target) &&
                !activeAddColumnForm.contains(event.target) &&
                !addColumnButton.contains(event.target)
            )) {
                u.toggleElementActiveState(activeAddColumnForm);
                u.toggleElementDisplay(activeAddColumnForm);
                u.toggleElementDisplay(addColumnButton);
                const activeInput =  activeAddColumnForm.querySelector('input');
                activeInput.value = activeInput.dataset.default;
            }
        }
    }
};

function handleOutsideClick(event) {
    outsideClick.handleNewBoard(event);
    outsideClick.handleBoardTitle(event);
    outsideClick.handleNewCard(event);
    outsideClick.handleCardTitle(event);
    outsideClick.handleColumnTitle(event);
    outsideClick.handleNewColumn(event);
}

//--------------------------------------------------
// CREATE BOARD
//--------------------------------------------------

function handleCreateBoardButtonClick(event) {
    const button = event.target;
    u.toggleElementActiveState(button);
    const createBoardForm = u.getCreateBoardFormContainer();
    const input = u.getCreateBoardInput();
    createBoardForm.classList.toggle('hidden');
    if (!u.isElementHidden(createBoardForm)) {
        u.focusSelectTextInputElement(input);
        button.textContent = "Cancel";
    } else {
        input.value = input.dataset.default;
        button.textContent = "Create new board";
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

function handleSaveBoardButtonClick() {
    const input = u.getCreateBoardInput();
    const boardTitle = input.value;
    if (!boardTitle) {
        showFeedback('Board title cannot be empty!');
        return;
    }
    dataHandler.createNewBoard(boardTitle, (boardData) => {
        const boardTemplate = u.getBoardTemplate();
        const board = renderBoard(boardData, boardTemplate);
        const appendedBoard = appendBoard(board);
        _addEventListenerToOpenButtons(appendedBoard);
        _addEventListenerToBoardTitles(appendedBoard);
        _addEventListenerToAddColumnButtons(appendedBoard);
        _addEventListenerToSaveColumnButtons(appendedBoard);
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
        u.toggleElementDisplay(saveBoardTitleButton);
        showFeedback('Board renamed!');
    })
}

function toggleBoardTitleInput(event) {
    const boardTitleInput = event.target;
    if (!u.isElementActive(boardTitleInput)) {
        u.searchAndDeactivateElementType(event, '.board-title');
        u.toggleElementActiveState(boardTitleInput);
        u.focusSelectTextInputElement(boardTitleInput);
        const saveBoardTitleButton = boardTitleInput.nextElementSibling;
        u.toggleElementDisplay(saveBoardTitleButton);
    }
}

//--------------------------------------------------
// OPEN BOARD
//--------------------------------------------------

function handleOpenBoardClick(event) {
    const button = event.target;
    const board = document.querySelector(`.board[data-board-id="${button.dataset.boardId}"]`);
    const boardColumns = board.querySelector('.board-columns');
    const addColumnButton = board.querySelector('button.add-column');
    const addCardButton = board.querySelector('button.add-card');
    const addColumnForm = board.querySelector('.add-column-form');
    const addCardForm = board.querySelector('.add-card-form');

    if (!boardColumns.hasChildNodes()) {
        dom.loadColumns(board);
    }

    if (!boardColumns.classList.toggle('hidden')) {
        button.innerHTML = '&#9651';
    } else {
        button.innerHTML = '&#9661';
    }

    if (u.isElementHidden(boardColumns)) {
        u.setElementDisplay(addCardForm, true);
        u.setElementActiveState(addCardForm, false);
        u.setElementDisplay(addCardButton, true);
        u.setElementDisplay(addColumnForm, true);
        u.setElementActiveState(addColumnForm, false);
        u.setElementDisplay(addColumnButton, true);
    } else {
        u.setElementDisplay(addCardButton, false);
        u.setElementDisplay(addColumnButton, false);
    }

}

//--------------------------------------------------
// CREATE COLUMN
//--------------------------------------------------

function handleAddColumnClick(event) {
    const button = event.currentTarget;
    const boardId = button.dataset.boardId;
    const board = document.querySelector(`.board[data-board-id="${boardId}"]`);
    const addColumnForm = board.querySelector('.add-column-form');
    if (!u.isElementActive(addColumnForm)) {
        u.searchAndDeactivateElementType(event, '.add-column-form');
    }
    u.setElementDisplay(button, true);
    u.setElementDisplay(addColumnForm, false);
    u.setElementActiveState(addColumnForm, true);
    u.focusSelectTextInputElement(addColumnForm.querySelector('input'));
}


function handleSaveNewColumnClick(event, board) {
    const input = board.querySelector(`input.new-column`);
    const statusName = input.value;
    let addColumnForm = board.querySelector('.add-column-form');
    u.setElementDisplay(addColumnForm, true);
    u.setElementActiveState(addColumnForm, false);
    // reset column title input

    dataHandler.addNewStatus(statusName, board.dataset.boardId, (status) => {
        dom.showColumns(board, [status]); //passed as a length 1 list, in order to use showColumns
        let addColumnButton = board.querySelector('button.add-column');
        u.setElementDisplay(addColumnButton, false);
        showFeedback('Column created!');
    });

}

//--------------------------------------------------
// RENAME COLUMN
//--------------------------------------------------

function handleSaveColumnTitleButtonClick(event) {
    const saveButton = event.target;
    const columnTitleInput = saveButton.parentNode.querySelector('.board-column-title');
    dataHandler.renameColumn(columnTitleInput.value, columnTitleInput.dataset.statusId, () => {
        u.toggleElementActiveState(columnTitleInput);
        columnTitleInput.dataset.title = columnTitleInput.value;
        u.toggleElementDisplay(saveButton);
        showFeedback('Column renamed!');
    });
}

function handleColumnTitleInputClick(event) {
    const input = event.target;
    if (!u.isElementActive(input)) {
        u.searchAndDeactivateElementType(event, 'input.board-column-title');
        u.setElementActiveState(input, true);
        u.focusSelectTextInputElement(input);
        const saveButton = input.nextElementSibling;
        u.toggleElementDisplay(saveButton);
    }
}

//--------------------------------------------------
// CREATE CARD
//--------------------------------------------------

function handleAddCardClick(event) {
    const button = event.currentTarget;
    const boardId = button.dataset.boardId;
    const board = document.querySelector(`.board[data-board-id="${boardId}"]`);
    const columns = board.querySelectorAll('.board-column-container');
    if (columns.length === 0) {
        showFeedback('Must add columns first!');
        return
    }
    const addCardForm = board.querySelector('.add-card-form');
    if (!u.isElementActive(addCardForm)) {
        u.searchAndDeactivateElementType(event, '.add-card-form');
    }
    const addCardInput = addCardForm.querySelector('input');
    u.setElementDisplay(button, true);
    u.setElementDisplay(addCardForm, false);
    u.setElementActiveState(addCardForm, true);
    u.focusSelectTextInputElement(addCardInput);
}

function handleSaveNewCardClick(event, board) {
    const FIRST_COLUMN = 0;
    const boardId = board.dataset.boardId;
    dataHandler.getStatuses(boardId, (statuses) => {
        const statusId = statuses[FIRST_COLUMN]['id'];
        const input = board.querySelector(`input.new-card`);
        const cardTitle = input.value;
        let form = board.querySelector('.add-card-form');
        u.setElementDisplay(form, true);
        resetAddCardInput(board);

        dataHandler.createNewCard(cardTitle, boardId, statusId, (card) => {
            dom.showCards([card]); //passed as a length 1 list, in order to use showCards
            const addCardButton = board.querySelector('button.add-card');
            u.setElementDisplay(addCardButton, false);
            showFeedback('Card created!');
        });
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
        u.toggleElementActiveState(cardTitleInput);
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


//--------------------------------------------------
// REORDER CARDS
//--------------------------------------------------

function reorderCards(column) {
        let sortableCards = dragula([column]);
        let cards = column.children;
        let nodeListForEach = function (array, callback, scope) {
            for (let i = 0; i < array.length; i++) {
                callback.call(scope, i, array[i]);
            }
        };
        sortableCards.on('dragend', function () {
            let orderOfCards = [];
            nodeListForEach(cards, function(index, row) {
                let orderOfCard = row.dataset.order = index + 1;
                orderOfCards.push({
                    id: parseInt(row.dataset.cardId),
                    order: orderOfCard,
                    board_id: row.dataset.boardId
                });
                });
            dataHandler.reorderCards(orderOfCards);
            });
}

//--------------------------------------------------
// REGISTRATION MODAL
//--------------------------------------------------

function closeRegistrationModal(event) {
    const modalContainer = document.querySelector('.registration-outer');
    const closeButton = modalContainer.querySelector('.close-registration-button');
    if ([modalContainer, closeButton].includes(event.target)) {
        const form = modalContainer.querySelector('form');
        form.reset();
        u.toggleElementDisplay(modalContainer);
    }
}

function openRegistrationModal() {
    const modalContainer = document.querySelector('.registration-outer');
    u.toggleElementDisplay(modalContainer);
}

function processServerResponseForRegistration(response) {
    if ('error' in response) {
        const usernameInput = document.getElementById('username');
        usernameInput.setCustomValidity(response['error']);
        usernameInput.reportValidity();
        usernameInput.setCustomValidity('');
    } else {
        const messageContainer = document.querySelector('.registration-success');
        const registerButton = document.getElementById('register');
        u.setElementVisibility(messageContainer, true);
        registerButton.disabled = true;
        setTimeout(function () {
            u.setElementVisibility(messageContainer, false);
            registerButton.disabled = false;
        }, 2000);
    }
}

function submitRegistration(event) {
    if (event.target === this.querySelector('#register')) {
        const validInputs = this.checkValidity();
        if (validInputs) {
            const usernameInput = document.getElementById('username');
            const username = usernameInput.value;
            const password = document.getElementById('password').value;
            const userData = {username: username, password: password};
            dataHandler.register(userData, processServerResponseForRegistration)
        }
    }
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

function _addEventListenerToAddColumnButtons(board = null) {
    let selectionRoot = board ? board : document;
    const addColumnButtons = selectionRoot.querySelectorAll('button.add-column');
    for (let button of addColumnButtons) {
        button.addEventListener('click', (event) => handleAddColumnClick(event));
    }
}

function _addEventListenerToSaveColumnButtons(board = null) {
    let selectionRoot = board ? board : document;
    let saveButtons = selectionRoot.querySelectorAll('button.save-column');
    for (let button of saveButtons) {
        let board = u.getBoardById(button.dataset.boardId);
        button.addEventListener('click', (event) => handleSaveNewColumnClick(event, board));
    }
}

function _addEventListenerToAddCardButtons(board = null) {
    const selectionRoot = board ? board : document;
    const addCardButtons = selectionRoot.querySelectorAll('button.add-card');
    for (const button of addCardButtons) {
        button.addEventListener('click', handleAddCardClick);
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
        const openRegistrationModalButton = document.querySelector('.registration-button');
        const registrationModalContainer = document.querySelector('.registration-outer');
        const registrationForm = registrationModalContainer.querySelector('.registration-form');

        // Add event listeners
        window.addEventListener('click', handleOutsideClick);
        createBoardButton.addEventListener('click', handleCreateBoardButtonClick);
        saveBoardButton.addEventListener('click', handleSaveBoardButtonClick);
        createBoardInput.addEventListener('click', handleCreateBoardInputClick);
        createBoardInput.addEventListener('keyup', handleCreateBoardInputEscPress);
        openRegistrationModalButton.addEventListener('click', openRegistrationModal);
        registrationModalContainer.addEventListener('click', closeRegistrationModal);
        registrationForm.addEventListener('click', submitRegistration);
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
            _addEventListenerToOpenButtons();
            _addEventListenerToBoardTitles();
            _addEventListenerToAddColumnButtons();
            _addEventListenerToSaveColumnButtons();
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

            reorderCards(column);


        }
    },
    loadColumns: function (board) {
        const boardId = board.dataset.boardId;
        dataHandler.getStatuses(boardId, function (statuses) {
            dom.showColumns(board, statuses);
            dom.loadCards(board);
        });
    },
    showColumns: function (board, statuses) {
        for (const status of statuses) {
            const column = createColumns(status, board);
            const columnTitleInput = column.querySelector('.board-column-title');
            const saveColumnTitleButton = column.querySelector('.save-column-title');
            columnTitleInput.addEventListener('click', handleColumnTitleInputClick);
            saveColumnTitleButton.addEventListener('click', handleSaveColumnTitleButtonClick);
            const columns = board.querySelector('.board-columns');
            columns.appendChild(column);
        }
    }
    // here comes more features
};


