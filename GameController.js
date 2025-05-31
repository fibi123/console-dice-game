const FairRandomProtocol = require('./FairRandomProtocol');
const ProbabilityCalculator = require('./ProbabilityCalculator');
const TableGenerator = require('./TableGenerator');
const readline = require('readline');

class GameController {
    constructor(diceArray) {
        this.diceArray = diceArray;
        this.fairRandom = new FairRandomProtocol();

        // Set up console input/output
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Calculate all win probabilities when game starts
        this.probabilities = ProbabilityCalculator.calculateAllProbabilities(diceArray);
    }

    // Main method to start the game
    async startGame() {
        try {
            console.log("Let's determine who makes the first move.");

            // Use fair random generation to decide who goes first
            const firstPlayerResult = await this.fairRandom.generateFairRandom(2, 'value');
            const computerGoesFirst = firstPlayerResult === 1;

            if (computerGoesFirst) {
                console.log("I make the first move.");
                await this.playGame(true);
            } else {
                console.log("You make the first move.");
                await this.playGame(false);
            }
        } catch (error) {
            console.error('Game error:', error.message);
        } finally {
            this.cleanup();
        }
    }

    // Main game logic
    async playGame(computerFirst) {
        let computerDiceIndex;
        let userDiceIndex;

        if (computerFirst) {
            // Computer selects dice first
            computerDiceIndex = await this.computerSelectDice();
            console.log('I make the first move and choose the [' +
                this.diceArray[computerDiceIndex].toString() + '] dice.');

            // User selects from remaining dice
            userDiceIndex = await this.userSelectDice(computerDiceIndex);
        } else {
            // User selects dice first
            userDiceIndex = await this.userSelectDice();
            console.log('You choose the [' + this.diceArray[userDiceIndex].toString() + '] dice.');

            // Computer selects from remaining dice
            computerDiceIndex = await this.computerSelectDice(userDiceIndex);
            console.log('I choose the [' + this.diceArray[computerDiceIndex].toString() + '] dice.');
        }

        // Now both players roll their selected dice
        await this.performRolls(computerDiceIndex, userDiceIndex);
    }

    // Handle the dice rolling phase
    async performRolls(computerDiceIndex, userDiceIndex) {
        // Computer's roll
        console.log("It's time for my roll.");
        const computerDice = this.diceArray[computerDiceIndex];
        const computerRollIndex = await this.fairRandom.generateFairRandom(computerDice.getNumFaces(), 'value');
        const computerRollValue = computerDice.getFaceValue(computerRollIndex);
        console.log('My roll result is ' + computerRollValue + '.');

        // User's roll
        console.log("It's time for your roll.");
        const userDice = this.diceArray[userDiceIndex];
        const userRollIndex = await this.fairRandom.generateFairRandom(userDice.getNumFaces(), 'value');
        const userRollValue = userDice.getFaceValue(userRollIndex);
        console.log('Your roll result is ' + userRollValue + '.');

        // Determine and announce winner
        this.announceWinner(userRollValue, computerRollValue);
    }

    // Announce the winner based on roll results
    announceWinner(userRoll, computerRoll) {
        if (userRoll > computerRoll) {
            console.log('You win (' + userRoll + ' > ' + computerRoll + ')!');
        } else if (computerRoll > userRoll) {
            console.log('I win (' + computerRoll + ' > ' + userRoll + ')!');
        } else {
            console.log('It\'s a tie (' + userRoll + ' = ' + computerRoll + ')!');
        }
    }

    // Computer selects a dice (simple random strategy)
    async computerSelectDice(excludedIndex) {
        const availableDice = [];

        // Find all dice that are not excluded
        for (let i = 0; i < this.diceArray.length; i++) {
            if (i !== excludedIndex) {
                availableDice.push(i);
            }
        }

        // Choose randomly from available dice
        const randomIndex = Math.floor(Math.random() * availableDice.length);
        return availableDice[randomIndex];
    }

    // User selects a dice through console interface
    async userSelectDice(excludedIndex) {
        return new Promise((resolve) => {
            const getUserChoice = () => {
                const availableOptions = this.showDiceMenu(excludedIndex);

                this.rl.question('Your selection: ', (answer) => {
                    const input = answer.trim().toUpperCase();

                    // Handle special commands
                    if (input === 'X') {
                        console.log('Game cancelled.');
                        process.exit(0);
                    }

                    if (input === '?') {
                        this.showHelp();
                        getUserChoice(); // Ask again after showing help
                        return;
                    }

                    // Handle numeric input
                    const optionNumber = parseInt(input, 10);
                    if (isNaN(optionNumber) || optionNumber < 0 || optionNumber >= availableOptions.length) {
                        console.log('Invalid selection. Please choose a number between 0 and ' +
                            (availableOptions.length - 1) + '.');
                        getUserChoice(); // Ask again
                        return;
                    }

                    const selectedDiceIndex = availableOptions[optionNumber];
                    console.log('You choose the [' + this.diceArray[selectedDiceIndex].toString() + '] dice.');
                    resolve(selectedDiceIndex);
                });
            };

            getUserChoice();
        });
    }

    // Show menu of available dice for user to choose from
    showDiceMenu(excludedIndex) {
        console.log("Choose your dice:");

        let optionIndex = 0;
        const availableOptions = [];

        // Show each available dice with its option number
        for (let i = 0; i < this.diceArray.length; i++) {
            if (i !== excludedIndex) {
                console.log(optionIndex + ' - ' + this.diceArray[i].toString());
                availableOptions.push(i);
                optionIndex++;
            }
        }

        console.log('X - exit');
        console.log('? - help');

        return availableOptions;
    }

    // Show help information including probability tables
    showHelp() {
        console.log('\n' + this.repeatChar('=', 80));
        console.log('HELP - GAME INFORMATION');
        console.log(this.repeatChar('=', 80));

        // Show fair random protocol explanation
        console.log(TableGenerator.generateFairRandomExplanation());

        // Show probability table
        console.log(TableGenerator.generateProbabilityTable(this.diceArray, this.probabilities));

        console.log(this.repeatChar('=', 80) + '\n');
    }

    // Helper method to repeat a character
    repeatChar(char, count) {
        let result = '';
        for (let i = 0; i < count; i++) {
            result += char;
        }
        return result;
    }

    // Clean up resources when game ends
    cleanup() {
        this.fairRandom.close();
        this.rl.close();
    }
}

module.exports = GameController;