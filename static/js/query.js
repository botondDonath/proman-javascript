//----------------------------------------------------------------------
// FUNCTIONS TO GET ELEMENTS
//----------------------------------------------------------------------

export let query = {
    getCreateBoardInput: () => document.querySelector('input.create-board'),
    getCreateBoardForm: () => document.querySelector('form.create-board'),
    getCreateBoardButton: () => document.querySelector('button.create-board'),
    getSaveBoardButton: () => document.querySelector('button.save-board'),
    getBoardTemplate: () => document.getElementById('board-template'),
    getBoardsContainer: () => document.getElementById('boards'),
};