//----------------------------------------------------------------------
// FUNCTIONS TO GET ELEMENTS
//----------------------------------------------------------------------

export let util = {
    getCreateBoardInput: () => document.querySelector('input.create-board'),
    getCreateBoardFormContainer: () => document.querySelector('.form-container.create-board'),
    getCreateBoardButton: () => document.querySelector('button.create-board'),
    getSaveBoardButton: () => document.querySelector('button.save-board'),
    getBoardTemplate: () => document.getElementById('board-template'),
    getBoardsContainer: () => document.getElementById('boards'),
    getBoardById: (boardId) => document.querySelector(`.board[data-board-id="${boardId}"]`),
    focusSelectTextInputElement: (element) => {
        element.focus();
        element.select();
    },
    toggleElementDisplay: (element) => {
        element.classList.toggle('hidden');
    },
    setElementDisplay: (element, hide = false) => {
        element.classList.toggle('hidden', hide);
    },
    isElementHidden: (element) => element.classList.contains('hidden'),
    isElementVisible: (element) => !element.classList.contains('invisible'),
    toggleElementVisibility: (element) => {
        element.classList.toggle('invisible');
    },
    hasElementFocus: (element) => document.activeElement === element,
    toggleElementActiveState: (element) => {
        element.classList.toggle('active');
    },
    setElementActiveState: (element, active = true) => {
        element.classList.toggle('active', active);
    },
    isElementTypeActive: (selectors) => document.querySelector(`${selectors}.active`)
};