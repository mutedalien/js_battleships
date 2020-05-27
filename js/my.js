//  Представление
let view = {
    displayMessage: function(msg) { //  метод вывода сообщения игроку
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {    //  метод вывода сообщения игроку
        let cell = document.getElementById(location);   // через location получаем элемент и сохраняем его в cell (ячейку)
        cell.setAttribute("class", "hit");  //  к ячейке через setAttribute добавляем класс и его зачение
    },

    displayMiss: function(location) { //  метод вывода сообщения игроку
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
    ships: [    // массив для хранения рандомных кораблей и статуса попаданий
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
                view.displayHit(guess); //  передаем в метод точку выстрела guess
                view.displayMessage("HIT!");    //  передаем сообщение о попадании в метод displayMessage

                if (this.isSunk(ship)) {    //  проверка, возвращающая либо true, либо false
                    view.displayMessage("You sank my battleship!"); //  сообщаем игроку о потоплении корабля
                    this.shipsSunk++;   //  увеличиваем счетчик утопленных кораблей
                }
                return true;
            }
        }
        view.displayMiss(guess);    //  выводим точку выстрела guess
        view.displayMessage("Miss!");   //  сообщаем о промахе
        return false;   //  ничего не делаем
    },

    isSunk: function(ship) {    //  метод получает объект корабля и проверяет не потоплен ли он
        for (let i = 0; i < this.shipLength; i++)  {    //  проверяем длинну корабля
            if (ship.hits[i] !== "hit") {   //  если у корабля есть попадания в массиве hits
                return false;   //  то возвращаем false, корабль потоплен
            }
        }
        return true;    //  если хоть одна клетка "живая", то жив и корабль.
    },
    //  генерируем массив рандомных кораблей
    generateShipLocations: function() {
        let locations;  //  создаем локальную переменную
        for (let i = 0; i < this.numShips; i++) {   //  пока i меньше количества кораблей...
            do {
                locations = this.generateShip();    //  генерируем набор позиций (строка 86)
            } while (this.collision(locations));    //  проверяем, не перекрывают ли они друг-друга (строка 109)
            this.ships[i].locations = locations;    //  получение позиции уже без перекрытий и сохранение ее в locations
        }
        console.log("Ships array: ");
        console.log(this.ships);    //  читы =)
    },
    //  метод, создающий корабль
    generateShip: function() {
        let direction = createRandom(2); // (строка 123)
        let row, col;

        if (direction === 1) { //  генерируем начальную точку для горизонтального корабля
            row = createRandom(this.boardSize); //  позиция в строке
            col = createRandom(this.boardSize - this.shipLength + 1);   //  позиция в колонке
        } else { //  генерируем начальную точку для вертикального корабля
            row = createRandom(this.boardSize - this.shipLength + 1);
            col = createRandom(this.boardSize);
        }

        let newShipLocations = [];  //  переменная - массив с набором позиций для нового корабля
        for (let i = 0; i < this.shipLength; i++) { //  цикл до длинны корабля
            if (direction === 1) {  //  добавляем в массив для горизонтального корабля
                newShipLocations.push(row + "" + (col + i));    //  добавляем данные в конец массива
            } else {  //  добавляем в массив для вертикального корабля
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;    // возвращаем сгенерированные позиции
    },
    //  метод, проверяющий корабли на пересечение координат
    collision: function(locations) {    //  принимаем locations - массив позиций нового корабля
        for (let i = 0; i < this.numShips; i++) {   //  для каждого корабля на поле, проверяем есль ли совпадения по позициям в массиве
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {    //  если совпадения есть, значит коллизия
                    return true;
                }
            }
        }
        return false;   //  если совпадений нет, значит коллизии нет
    }
};


function createRandom(num) {    //  создаем рандомное целое число
    let rand = Math.floor(Math.random() * num);
    return rand;
}
//  контроллер обработки выстрелов, подсчета их количества, обработки этих данных в модели и завершения игры
let controller = {  //  создаем объект контроллера
    guesses: 0, //  количество выстрелов

    processGuess: function(guess) { //  метод точки выстрела
        let location = parseGuess(guess);   //  создаем переменную, принимающую результат метода parseGuess (строка 159)
        if (location) {
            this.guesses++; //  суммируем выстрелы
            let hit = model.fire(location); // создаем переменную с выстрелом
            if (hit && model.shipsSunk === model.numShips) {    //  проверяем соответствие кол-ва утопленников с кол-вом кораблей
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");   //  сообщаем результат игры
            }
        }
    }
};

function parseGuess(guess) {    //  функция проверки координат выстрела
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"]; //  создаем массив допустимых координат

    if (guess === null || guess.length !== 2) { //  проверяем не отдает ли null и содержит ли только два символа
        alert("Oops, please enter a letter and a number on the board.");    //  косяк в вводе
    } else {    // если все честно, то...
        let firstChar = guess.charAt(0);    //  извлекаем первый символ из строки
        let row = alphabet.indexOf(firstChar);  //  создаем переменную с значением первого символа относительно массива alphabet
        let column = guess.charAt(1);   //  создаем переменную для второго символа

        if (isNaN(row) || isNaN(column)) {  //  проверяем второй символ координат на соответствие ширины игрового поля
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {    //  если все ок, то возвращаем оба символа координат выстрела
            return row + column;
        }
    }
    return null;    //  иначе возвращаем null
}

/* //   тестируем
console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));
* */

// event handlers
function handleFireButton () {  //  получение значений координат выстрела
    let guessInput = document.getElementById("guessInput"); //  поле для ввода координат
    let guess = guessInput.value.toUpperCase(); //  значение, введенное в поле ввода координат

    controller.processGuess(guess); //  передаем это в контроллер (строка 131)

    guessInput.value = "";  //  очищаем поле ввода
};

function handleKeyPress(e) {    //  функция - обработчик нажатия Enter при выстреле (строка 194)
    let fireButton = document.getElementById("fireButton"); //  получаем элемент кнопки Fire
    if (e.keyCode === 13) { //  если keyCode соответствует клавише Enter (13)
        fireButton.click(); //  создаем клик кнопки Fire
        return false;   //  чистим данные
    }
}

function init() {   //  функция для обработки события нажатия кнопки выстрела
    let fireButton = document.getElementById("fireButton"); //  получаем в переменную ссылку на кнопку
    fireButton.onclick = handleFireButton;  //  привязываем к действию onclick функцию handleFireButton (строка 174)
    //  добавляем обработчик события нажатия клавиши Enter
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress; //  при нажатии Enter запускаем handleKeyPress (строка 183)

    model.generateShipLocations();
}

window.onload = init;