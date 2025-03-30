class Game {
    consts = {
        fieldSize: 15, // размер поля по вертикали и горизонтали
        chipsToWin: 5, // количество "фишек" в ряд для выигрыша.
    }

    booleans = {
        isEven: false, //чётность клика
        isLock: false, //блокировка поля
    }

    constructor() {
        this.createField(this.consts.fieldSize);
        this.displayField(this.field);
        this.clicksListener();
        this.submitListener();
    }

    // Основные методы

    createField = (size) => {
        const matrix = [];
        
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(2);
            }
            matrix.push(row);
        }
    
        this.field = matrix;
    }

    displayField = (matrix) => {
        // удаление предыдущей разметки для перерисовки (думаю по-хорошему менять локально, но это потом)
        try {
            const tableElement = document.querySelector('.table');
            tableElement.remove();
        } catch {}
        
        // добавление класса Table
        const containerElement = document.querySelector('.container');
        const tableElement = document.createElement('div');
        tableElement.classList.add('table');
        containerElement.append(tableElement);
    
        // перебор модели
        matrix.forEach((row, i) => {
    
            // Добавление класса Row
            const rowElement = document.createElement('div');
            rowElement.classList.add('table__row');
            tableElement.append(rowElement);
    
            // перебор ряда
            row.forEach((el, j) => {
    
                // создание айтема
                const itemElement = document.createElement('div');
                itemElement.classList.add('table__item');
                itemElement.setAttribute('data-x', i);
                itemElement.setAttribute('data-y', j);
                
                // преобразование значений для отображения
                if (el == 0) itemElement.textContent = 'X';
                if (el == 1) itemElement.textContent = 'O';
    
                // добавление айтема
                rowElement.append(itemElement);
            })
        })
    }

    onButtonClick = (matrix) => {
        this.clearField(matrix);
        this.displayField(matrix);
    
        this.buttonElement = document.querySelector('.button');
        this.buttonElement.remove();
    }

    clicksListener = () => {
        document.addEventListener('click', (event) => {
            console.log(this.booleans.isEven);
            const targetElement = event.target;
        
            if (targetElement.classList.contains('button')) {
                this.onButtonClick(this.field);
                this.booleans.isLock = false;
            }
        
            if (this.booleans.isLock) {
                return 0;
            } 
            else {
                // определение координат ячейки
                this.dataX = +targetElement.dataset.x;
                this.dataY = +targetElement.dataset.y;
        
                if (targetElement.classList.contains('table__item')) {
        
                    // проверка на содержание ячейки
                    if (this.field[this.dataX][this.dataY] != 2) { 
                        return 0;
                    }
        
                    this.field = this.updateField(this.field, this.dataX, this.dataY, this.booleans.isEven); // внесение изменений в модель и перерисовка разметки
        
                    // проверка на победу
                    if (this.isVictory(this.field, this.dataX, this.dataY, this.booleans.isEven)) {
                        this.showWinner();
                        this.booleans.isLock = true;
                    }
        
                    this.booleans.isEven = !this.booleans.isEven; // смена чётности хода
                }
            }
        })
    }

    updateField = (matrix, x, y, even) => {
        matrix[x][y] = +even;
    
        this.displayField(matrix);
    
        return matrix;
    }
    
    isVictory = (matrix, x, y, even) => {
        // двигаясь во все стороны от таргет-ячейки проверяем победу
    
        // По горизонтали
        let countX = 0; // кол-во ячеек горизонтально  
        for (let i = y; i >= 0; i--) {
            if (matrix[x][i] == +even) countX++; 
            else break;
        }
        for (let i = y; i < matrix.length; i++) {
            if (matrix[x][i] == +even) countX++; 
            else break;
        }
        countX--;
        if (countX >= this.consts.chipsToWin) return true;
    
        // По вертикали
        let countY = 0; // кол-во ячеек вертикально  
        for (let i = x; i >= 0; i--) {
            if (matrix[i][y] == +even) countY++; 
            else break;
        }
        for (let i = x; i < matrix.length; i++) {
            if (matrix[i][y] == +even) countY++; 
            else break;
        }
        countY--;
        if (countY >= this.consts.chipsToWin) return true;
    
        // По диагонали 1
        let countDiag1 = 0, curX = x, curY = y;
        while (curX >= 0 && curY >= 0) {
            if (matrix[curX][curY] == +even) {
                countDiag1++;
                curX--; 
                curY--;
            } else break;
        }
        curX = x, curY = y;
        while (curX < matrix.length && curY < matrix.length) {
            if (matrix[curX][curY] == +even) {
                countDiag1++;
                curX++; 
                curY++;
            } else break;
        }
        countDiag1--;
        if (countDiag1 >= this.consts.chipsToWin) return true;
    
        // По диагонали 2
        let countDiag2 = 0; 
        curX = x, curY = y;
        while (curX >= 0 && curY < matrix.length) {
            if (matrix[curX][curY] == +even) {
                countDiag2++;
                curX--; 
                curY++;
            } else break;
        }
        curX = x, curY = y;
        while (curX < matrix.length && curY >= 0) {
            if (matrix[curX][curY] == +even) {
                countDiag2++;
                curX++; 
                curY--;
            } else break;
        }
        countDiag2--;
        if (countDiag2 >= this.consts.chipsToWin) return true;
    
        return false;
    }
    
    clearField = (matrix) => {
        matrix.forEach((row, i) => {
            row.forEach((el, j) => {
                matrix[i][j] = 2;
            })
        })
    }

    showWinner = () => {
        const winnerElement = document.querySelector('[data-js-winner]');
        if (this.booleans.isEven) winnerElement.textContent = 'O';
        else winnerElement.textContent = 'X';
    }

    // Форма

    submitListener = () => {
        const formElement = document.querySelector('form');
        formElement.addEventListener('submit', event => {
            event.preventDefault();
            const formValues = event.target.elements;
            const winnerElement = document.querySelector('[data-js-winner]');

            this.consts.fieldSize = formValues["field-size"].value;
            this.consts.chipsToWin = formValues["chips-to-win"].value;

            this.booleans.isLock = false;
            winnerElement.textContent = 'не определён';
            this.booleans.isEven = false;
            this.createField(this.consts.fieldSize);
            this.displayField(this.field);
        })
    }
}

export default Game;