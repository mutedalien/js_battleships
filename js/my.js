//  Представление
let view = {
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        let cell = document.getElementById(location);   // через location получаем элемент и сохраняем его в cell (ячейку)
        cell.setAttribute("class", "hit");  //  к ячейке через setAttribute добавляем класс и его зачение
    },

    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

//  Далее модель поведения игры

let model = {   //  создаем модель и определяем ее свойства
    boardSize: 7,   //  размер игрового поля
    numShips: 3,    //  кол-во кораблей в игре
    shipLength: 3,  //  длинна корабля
    shipsSunk: 0,   //  кол-во потопленных кораблей на начало игры

    /*	ships: [ // массив для хранения кораблей и статуса попаданий
            { locations: ["06", "16", "26"], hits: ["", "", ""]},
            { locations: ["24", "34", "44"], hits: ["", "", ""]},
            { locations: ["10", "11", "12"], hits: ["", "", ""]}
        ],
    */
    ships: [
        { locations: ["", "", ""], hits: ["", "", ""]},
        { locations: ["", "", ""], hits: ["", "", ""]},
        { locations: ["", "", ""], hits: ["", "", ""]}
    ],


    fire: function(guess) { //  метод, получающий координаты выстрела (явл св-вом объекта модели)
        for (let i = 0; i < this.numShips; i++) {   //  перебираем массив ships исходя из кол-ва (numShips)
            let ship = this.ships[i];   //  создаем один экземпляр корабля, равняющийся одному элементу массива (ships[i])
            let index = ship.locations.indexOf(guess);  //  метод indexOf ищет точку guess и возвращает ее в index (иначе -1)

            if (ship.hits[index] === "hit") {
                view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {    //  если есть попадание (совпадение)
                ship.hits[index] = "hit";   //  записываем отметку "hit" в массив hits нужного экземпляра ship
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Miss!");
        return false;
    },

    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++)  {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Ships array: ");
        console.log(this.ships);
    },

    generateShip: function() {
        let direction = createRandom(2);
        let row, col;

        if (direction === 1) { // horizontal
            row = createRandom(this.boardSize);
            col = createRandom(this.boardSize - this.shipLength + 1);
        } else { // vertical
            row = createRandom(this.boardSize - this.shipLength + 1);
            col = createRandom(this.boardSize);
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};


function createRandom(num) {
    let rand = Math.floor(Math.random() * num);
    return rand;
}

let controller = {
    guesses: 0,

    processGuess: function(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");
            }
        }
    }
};

function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
}

// event handlers
function handleFireButton () {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value.toUpperCase();

    controller.processGuess(guess);

    guessInput.value = "";
};

function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

window.onload = init;