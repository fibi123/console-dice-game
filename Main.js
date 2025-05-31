const DiceParser = require('./DiceParser');
const GameController = require('./GameController');

async function main() {
    try {
        // Get command line arguments (skip 'node' and 'main.js')
        const args = process.argv.slice(2);

        // Check if user provided dice configurations
        if (args.length === 0) {
            console.log('Usage: node main.js <dice1> <dice2> <dice3> [dice4] ...');
            console.log('Example: node main.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3');
            console.log('Each dice configuration should be comma-separated integers.');
            process.exit(1);
        }

        // Convert string arguments to Dice objects
        const diceArray = DiceParser.parse(args);

        // Show what dice were loaded
        console.log('Dice configurations loaded:');
        for (let i = 0; i < diceArray.length; i++) {
            console.log('Dice ' + i + ': [' + diceArray[i].toString() + ']');
        }
        console.log();

        // Start the game
        const gameController = new GameController(diceArray);
        await gameController.startGame();

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

// Handle when user presses Ctrl+C
process.on('SIGINT', () => {
    console.log('\nGame interrupted. Goodbye!');
    process.exit(0);
});

// Handle when system terminates the process
process.on('SIGTERM', () => {
    console.log('\nGame terminated. Goodbye!');
    process.exit(0);
});

// Start the program
main().catch(error => {
    console.error('Unexpected error:', error.message);
    process.exit(1);
});