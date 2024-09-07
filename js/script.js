// Declaration: This file was build with the help of ChatGPT.

class MessageHandler {
    constructor() {
        this.messages = messages;
    }

    getMessage(key) {
        return this.messages[key];
    }
}

// Button class to handle each button's properties and behaviors
class GameButton {
    constructor(number, color) {
        this.number = number;
        this.color = color;
        this.buttonElement = document.createElement('button');
        this.buttonElement.id = `game-button-${number}`;
        this.buttonElement.innerText = number;
        this.buttonElement.style.backgroundColor = color;
        this.buttonElement.style.height = '5em';
        this.buttonElement.style.width = '10em';
        this.buttonElement.style.color = 'white';
        this.buttonElement.style.border = 'none';
        this.buttonElement.style.fontSize = '1em';
        this.buttonElement.style.cursor = 'pointer';
    }

    hideNumber() {
        this.buttonElement.innerText = '';
    }

    showNumber() {
        this.buttonElement.innerText = this.number;
    }

    setPosition(x, y) {
        this.buttonElement.style.position = 'absolute';
        this.buttonElement.style.left = `${x}px`;
        this.buttonElement.style.top = `${y}px`;
    }

    onClick(callback) {
        this.buttonElement.addEventListener('click', callback);
    }

    getElement() {
        return this.buttonElement;
    }
}

// GameController class to control the game flow
class GameController {
    constructor(messageHandler) {
        this.messageHandler = messageHandler;
        this.buttons = [];
        this.originalOrder = [];
        this.currentClickIndex = 0;
        this.buttonsContainer = document.getElementById('buttonsContainer');
        this.init();
    }

    init() {
        document.getElementById('submitButton').addEventListener('click', () => {
            const input = document.getElementById('buttonNumber').value;
            this.startGame(parseInt(input));
        });
    }

    startGame(n) {
        if (isNaN(n) || n < 3 || n > 7) {
            alert(this.messageHandler.getMessage('enter_valid_number'));
            return;
        }

        this.buttonsContainer.innerHTML = '';  
        this.buttons = [];  
        this.originalOrder = [];

        for (let i = 1; i <= n; i++) {
            const color = this.getRandomColor();
            const button = new GameButton(i, color);
            this.buttons.push(button);
            this.originalOrder.push(button);
            this.buttonsContainer.appendChild(button.getElement());
        }

        setTimeout(() => this.scrambleButtons(n), n * 1000); 
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    scrambleButtons(n) {
        let scrambleCount = 0;

        const scrambleInterval = setInterval(() => {
            this.buttons.forEach(button => {
                const { x, y } = this.getRandomPosition(button);
                button.setPosition(x, y);
            });

            scrambleCount++;
            if (scrambleCount >= n) {
                clearInterval(scrambleInterval);
                this.hideButtonNumbers();
                this.startMemoryGame();  
            }
        }, 2000); 
    }

    
    getRandomPosition(button) {
        const container = document.getElementById('buttonsContainer');
    
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
    
        const buttonWidth = button.getElement().offsetWidth;
        const buttonHeight = button.getElement().offsetHeight;
    
        const maxX = containerWidth - buttonWidth;
        const maxY = containerHeight - buttonHeight;
    
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
    
        return { x: randomX, y: randomY };
    }
    

    hideButtonNumbers() {
        this.buttons.forEach(button => button.hideNumber());
    }

    startMemoryGame() {
        this.currentClickIndex = 0; // Reset the click index

        this.buttons.forEach((button, index) => {
            button.onClick(() => this.handleButtonClick(button));
        });
    }

    handleButtonClick(button) {
        if (button === this.originalOrder[this.currentClickIndex]) {
            button.showNumber();
            this.currentClickIndex++;

            if (this.currentClickIndex === this.originalOrder.length) {
                alert(this.messageHandler.getMessage('excellent_memory'));
            }
        } else {
            alert(this.messageHandler.getMessage('wrong_order'));

            this.originalOrder.forEach(btn => btn.showNumber());

            this.buttons.forEach(btn => btn.getElement().style.pointerEvents = 'none');
        }
    }
}

// Initialize the game
const messageHandler = new MessageHandler();
const gameController = new GameController(messageHandler);
