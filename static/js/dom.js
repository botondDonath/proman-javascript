// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

const createCard = function(card){
    const template = document.querySelector('#card-template');
    const copy = document.importNode(template.content, true);

    copy.querySelector('.card-title').textContent = card.title;

    return copy;
};

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
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
    loadCards: function () {
        // retrieves cards and makes showCards called
        const board = this;
        const boardId = board.dataset.boardId;
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
        });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let cardNodes = [];
        for (let card of cards) {
            cardNodes.push(createCard(card));
        }

        for (let cardNode of cardNodes) {

        }
    },
    // here comes more features
};
