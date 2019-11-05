// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        document.querySelector('button.create-board').addEventListener('click', () => {
            const form = document.querySelector('.form.create-board');
            form.classList.toggle('hidden');
        });
        document.querySelector('button.save-new-board').addEventListener('click', () => {
            const boardTitle = document.querySelector('input.create-board').value;
            dataHandler.createNewBoard(boardTitle, (boardTitle) => {
                const boardHTML = `<li>${boardTitle}</li>`;
                console.log('boardHTML created');
                const boardContainer = document.querySelector('.board-container');
                boardContainer.insertAdjacentHTML('beforeend', boardHTML);
            })
        })
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for (let board of boards) {
            boardList += `
                <li>${board.title}</li>
            `;
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
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
