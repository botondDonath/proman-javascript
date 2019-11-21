// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function

        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json_response => callback(json_response));

    },
    _api_put: function (url, data, callback) {
        fetch(url, {
            method: 'PUT',
            credentials: "same-origin",
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json_response => callback(json_response));
    },
    _api_delete: function (url, callback) {
        fetch(url, {
            method: 'DELETE',
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(json_response => callback(json_response))
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (boardId, callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get(`/statuses/board/${boardId}`, (response) => {
            this._data = response;
            callback(response);
        })
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        this._api_get(`statuses/${statusId}`, (status) => callback(status));
    },
    addNewStatus: function(statusName, boardId, callback) {
        // adds a new status/column into the database
        this._api_post('/statuses', {'status_name': statusName, 'board_id': boardId}, (statusId) => {
            dataHandler.getStatus(statusId, (status) => callback(status));
        })
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data = response;
            callback(response);
        })
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
        this._api_get(`/card/${cardId}`, (card) => callback(card))
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        this._api_post('/boards', {'title': boardTitle}, boardData => callback(boardData))
    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        this._api_post('/new-card', {
            'title': cardTitle,
            'board_id': boardId,
            'status_id': statusId
        }, (cardId) => {
            dataHandler.getCard(cardId, (card) => {
                callback(card)
            })
        })
    },
    renameBoard: function (boardData, callback) {
        this._api_post(`/boards/${boardData.id}`, boardData, boardData => callback(boardData))
    },
    deleteCard: function (cardId) {
        // deletes card
        this._api_post('/delete-card', {'card_id': cardId}, (response) => {
            this._data = response;
        })
    },
    renameCard: function (cardData, callback) {
        this._api_post(`/cards/${cardData.id}`, {'title': cardData.title}, (cardData) => callback(cardData));
    },
    renameColumn: function (columnTitle, columnId, callback) {
        this._api_post('/rename-column', {'title': columnTitle, 'id': columnId}, (data) => {
            this._data = data;
            callback();
        })
    },
    moveCards: function (updatedCards) {
        this._api_put('/cards/order-and-status', updatedCards, (response) => {
           this._data = response;
        })
    },
    register: function (userData, callback) {
        this._api_post('/users', userData, (response) => {
            callback(response, userData);
        })
    },
    login: function (userData, callback) {
        this._api_post('/session', userData, (response) => {
            callback(response);
        })
    },
    logout: function (callback) {
        this._api_delete('/session', (response) => {
            callback(response);
        })
    }
};
