const CryptoGenerator = require('./CryptoGenerator');
const readline = require('readline');

class FairRandomProtocol {
    constructor() {
        // Set up console input/output
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // Generate a fair random number with user participation
    async generateFairRandom(max, purpose) {
        if (!purpose) {
            purpose = 'value';
        }

        // Step 1: Computer picks a secret number and key
        const key = CryptoGenerator.generateSecureKey();
        const computerNumber = CryptoGenerator.generateUniformRandom(max);

        // Step 2: Show HMAC proof (so user knows computer picked first)
        const hmac = CryptoGenerator.calculateHMAC(computerNumber, key);
        console.log('I selected a random ' + purpose + ' in the range 0..' + (max - 1) + ' (HMAC=' + hmac + ').');

        // Step 3: Get user's number
        const userNumber = await this.getUserNumber(max);

        // Step 4: Reveal computer's choice and key
        const keyHex = CryptoGenerator.keyToHex(key);
        const choiceWord = (purpose === 'value') ? 'number' : 'selection';
        console.log('My ' + choiceWord + ': ' + computerNumber + ' (KEY=' + keyHex + ').');

        // Step 5: Calculate final result
        const result = (computerNumber + userNumber) % max;
        console.log('The fair ' + purpose + ' generation result is ' + computerNumber + ' + ' + userNumber + ' = ' + result + ' (mod ' + max + ').');

        return result;
    }

    // Get a number from the user
    async getUserNumber(max) {
        return new Promise((resolve) => {
            const showMenu = () => {
                console.log('Add your number modulo ' + max + '.');

                // Show all possible choices
                for (let i = 0; i < max; i++) {
                    console.log(i + ' - ' + i);
                }

                console.log('X - exit');
                console.log('? - help');
            };

            const getInput = () => {
                this.rl.question('Your selection: ', (answer) => {
                    const input = answer.trim().toUpperCase();

                    // Handle exit
                    if (input === 'X') {
                        console.log('Game cancelled.');
                        process.exit(0);
                    }

                    // Handle help
                    if (input === '?') {
                        console.log('Select a number to add to the computer\'s hidden number.');
                        console.log('The result will be calculated using modular arithmetic.');
                        console.log('This ensures fair random generation that neither party can manipulate.');
                        showMenu();
                        getInput();
                        return;
                    }

                    // Handle number input
                    const num = parseInt(input, 10);
                    if (isNaN(num) || num < 0 || num >= max) {
                        console.log('Invalid selection. Please choose a number between 0 and ' + (max - 1) + '.');
                        getInput();
                        return;
                    }

                    resolve(num);
                });
            };

            showMenu();
            getInput();
        });
    }

    // Clean up when done
    close() {
        this.rl.close();
    }
}

module.exports = FairRandomProtocol;