const ProbabilityCalculator = require('./ProbabilityCalculator');

class TableGenerator {
    // Main method to create a complete probability table with explanations
    static generateProbabilityTable(diceArray, probabilities) {
        let output = '';

        // Add game rules explanation
        output += this.addGameRules();

        // Create the main probability table
        output += this.createProbabilityTable(diceArray, probabilities);

        // Add helpful notes
        output += this.addImportantNotes();

        // Show dice configurations
        output += this.showDiceConfigurations(diceArray);

        // Check for special non-transitive relationships
        output += this.addNonTransitiveInfo(diceArray, probabilities);

        return output;
    }

    // Add game rules explanation at the top
    static addGameRules() {
        let rules = '';
        rules += 'GAME RULES:\n';
        rules += '==========\n';
        rules += 'This is a non-transitive dice game where each player selects a dice and rolls it.\n';
        rules += 'The player with the higher roll wins. The table below shows win probabilities.\n';
        rules += 'Note: Some dice may have surprising advantages over others!\n\n';
        return rules;
    }

    // Create the main probability table with borders
    static createProbabilityTable(diceArray, probabilities) {
        let table = '';
        table += 'PROBABILITY TABLE - Win chances for each dice against opponents:\n';
        table += '================================================================\n\n';

        const numDice = diceArray.length;

        // Convert dice to string format for display
        const diceStrings = [];
        for (let i = 0; i < numDice; i++) {
            diceStrings.push('[' + diceArray[i].toString() + ']');
        }

        // Calculate how wide each column should be
        let maxDiceWidth = 0;
        for (let i = 0; i < diceStrings.length; i++) {
            if (diceStrings[i].length > maxDiceWidth) {
                maxDiceWidth = diceStrings[i].length;
            }
        }

        const headerWidth = Math.max(15, maxDiceWidth); // "User dice v" width
        const cellWidth = Math.max(maxDiceWidth + 2, 10); // probability width

        // Create top border
        table += '┌' + this.repeatChar('─', headerWidth + 2);
        for (let i = 0; i < numDice; i++) {
            table += '┬' + this.repeatChar('─', cellWidth + 2);
        }
        table += '┐\n';

        // Create header row
        table += '│' + this.centerText('User dice v', headerWidth + 2);
        for (let i = 0; i < numDice; i++) {
            table += '│' + this.centerText(diceStrings[i], cellWidth + 2);
        }
        table += '│\n';

        // Create separator line
        table += '├' + this.repeatChar('─', headerWidth + 2);
        for (let i = 0; i < numDice; i++) {
            table += '┼' + this.repeatChar('─', cellWidth + 2);
        }
        table += '┤\n';

        // Create data rows
        for (let i = 0; i < numDice; i++) {
            table += '│' + this.centerText(diceStrings[i], headerWidth + 2);

            for (let j = 0; j < numDice; j++) {
                let probabilityText;
                if (i === j) {
                    // Same dice against itself
                    probabilityText = '- (0.5000)';
                } else {
                    // Show probability with 4 decimal places
                    const probability = probabilities[i][j];
                    probabilityText = probability.toFixed(4);
                }
                table += '│' + this.centerText(probabilityText, cellWidth + 2);
            }
            table += '│\n';

            // Add separator between rows (except last row)
            if (i < numDice - 1) {
                table += '├' + this.repeatChar('─', headerWidth + 2);
                for (let k = 0; k < numDice; k++) {
                    table += '┼' + this.repeatChar('─', cellWidth + 2);
                }
                table += '┤\n';
            }
        }

        // Create bottom border
        table += '└' + this.repeatChar('─', headerWidth + 2);
        for (let i = 0; i < numDice; i++) {
            table += '┴' + this.repeatChar('─', cellWidth + 2);
        }
        table += '┘\n';

        return table;
    }

    // Add important notes to help understand the table
    static addImportantNotes() {
        let notes = '';
        notes += '\nIMPORTANT NOTES:\n';
        notes += '- Numbers show the probability that the row dice beats the column dice\n';
        notes += '- Diagonal values show 0.5000 (50% chance) since a dice cannot play against itself\n';
        notes += '- Values > 0.5000 indicate an advantage, < 0.5000 indicate a disadvantage\n';
        notes += '- Remember: larger numbers can appear on dice faces, so column widths may vary\n\n';
        return notes;
    }

    // Show the actual dice configurations for reference
    static showDiceConfigurations(diceArray) {
        let configs = '';
        configs += 'DICE CONFIGURATIONS:\n';
        configs += '===================\n';
        for (let i = 0; i < diceArray.length; i++) {
            configs += 'Dice ' + i + ': [' + diceArray[i].toString() + ']\n';
        }
        return configs;
    }

    // Check for and display non-transitive relationships
    static addNonTransitiveInfo(diceArray, probabilities) {
        const relations = ProbabilityCalculator.findNonTransitiveRelations(diceArray, probabilities);
        let info = '';

        if (relations.length > 0) {
            info += '\nNON-TRANSITIVE RELATIONS DISCOVERED:\n';
            info += '====================================\n';
            info += 'This set of dice exhibits non-transitive properties!\n';

            for (let i = 0; i < relations.length; i++) {
                info += (i + 1) + '. ' + relations[i].description + '\n';
            }

            info += '\nThis means there\'s no single "best" dice - each has advantages over others!\n';
        }

        return info;
    }

    // Helper method to repeat a character multiple times
    static repeatChar(char, count) {
        let result = '';
        for (let i = 0; i < count; i++) {
            result += char;
        }
        return result;
    }

    // Helper method to center text within a given width
    static centerText(text, width) {
        const padding = width - text.length;
        const leftPadding = Math.floor(padding / 2);
        const rightPadding = padding - leftPadding;

        let result = '';
        // Add left padding
        for (let i = 0; i < leftPadding; i++) {
            result += ' ';
        }
        // Add text
        result += text;
        // Add right padding
        for (let i = 0; i < rightPadding; i++) {
            result += ' ';
        }

        return result;
    }

    // Simple table method for backward compatibility
    static generateSimpleTable(diceArray, probabilities) {
        let table = 'Win Probabilities:\n';
        table += '================\n\n';

        const numDice = diceArray.length;

        for (let i = 0; i < numDice; i++) {
            for (let j = 0; j < numDice; j++) {
                if (i !== j) {
                    const probability = probabilities[i][j] * 100;
                    const probabilityText = probability.toFixed(1) + '%';
                    table += 'Dice ' + i + ' vs Dice ' + j + ': ' + probabilityText + '\n';
                }
            }
        }

        return table;
    }

    // Generate explanation of fair random number protocol
    static generateFairRandomExplanation() {
        let explanation = '';
        explanation += 'FAIR RANDOM NUMBER GENERATION PROTOCOL:\n';
        explanation += '======================================\n\n';
        explanation += 'This game uses a cryptographically secure protocol to ensure fairness:\n\n';

        explanation += '┌───┬─────────────────────────────────────┬─────────────────────────────────┐\n';
        explanation += '│ # │ Computer                            │ User                            │\n';
        explanation += '├───┼─────────────────────────────────────┼─────────────────────────────────┤\n';
        explanation += '│ 1 │ Generates a random number           │                                 │\n';
        explanation += '│   │ \'x ∈ {0,1,2,3,4,5}\'                │                                 │\n';
        explanation += '├───┼─────────────────────────────────────┼─────────────────────────────────┤\n';
        explanation += '│ 2 │ Generates a secret key              │                                 │\n';
        explanation += '├───┼─────────────────────────────────────┼─────────────────────────────────┤\n';
        explanation += '│ 3 │ Calculates and displays             │                                 │\n';
        explanation += '│   │ \'HMAC(key).calculate(x)\'            │                                 │\n';
        explanation += '├───┼─────────────────────────────────────┼─────────────────────────────────┤\n';
        explanation += '│ 4 │                                     │ Selects a number                │\n';
        explanation += '│   │                                     │ \'y ∈ {0,1,2,3,4,5}\'            │\n';
        explanation += '├───┼─────────────────────────────────────┼─────────────────────────────────┤\n';
        explanation += '│ 5 │ Calculates the result               │                                 │\n';
        explanation += '│   │ \'(x + y) % 6\'                       │                                 │\n';
        explanation += '├───┼─────────────────────────────────────┼─────────────────────────────────┤\n';
        explanation += '│ 6 │ Shows both the result               │                                 │\n';
        explanation += '│   │ and the key                         │                                 │\n';
        explanation += '└───┴─────────────────────────────────────┴─────────────────────────────────┘\n\n';

        explanation += 'WHY THIS IS FAIR:\n';
        explanation += '- The HMAC proves the computer chose its number before seeing yours\n';
        explanation += '- Neither party can predict or manipulate the final result\n';
        explanation += '- The cryptographic hash makes it impossible to cheat\n';
        explanation += '- Both parties contribute to the randomness\n\n';

        return explanation;
    }
}

module.exports = TableGenerator;