class ProbabilityCalculator {
    // Calculate probability that dice1 beats dice2
    static calculateWinProbability(dice1, dice2) {
        const faces1 = dice1.getFaces(); // Get all face values of dice1
        const faces2 = dice2.getFaces(); // Get all face values of dice2

        let wins = 0;  // Count how many times dice1 wins
        let total = 0; // Count total number of comparisons

        // Compare every face of dice1 with every face of dice2
        for (let i = 0; i < faces1.length; i++) {
            const face1 = faces1[i];

            for (let j = 0; j < faces2.length; j++) {
                const face2 = faces2[j];
                total++;

                if (face1 > face2) {
                    wins++;
                }
            }
        }

        // Return probability as a decimal (0.0 to 1.0)
        return wins / total;
    }

    // Calculate probabilities for all dice pairs
    static calculateAllProbabilities(diceArray) {
        const numDice = diceArray.length;
        const probabilities = [];

        // Create a 2D array to store all probabilities
        for (let i = 0; i < numDice; i++) {
            probabilities[i] = [];

            for (let j = 0; j < numDice; j++) {
                if (i === j) {
                    // Same dice - always 50% chance
                    probabilities[i][j] = 0.5;
                } else {
                    // Different dice - calculate actual probability
                    probabilities[i][j] = this.calculateWinProbability(diceArray[i], diceArray[j]);
                }
            }
        }

        return probabilities;
    }

    // Convert probability to percentage with 1 decimal place
    static formatProbability(probability) {
        const percentage = probability * 100;
        return percentage.toFixed(1) + '%';
    }

    // Convert probability to percentage with 2 decimal places (more detailed)
    static formatProbabilityDetailed(probability) {
        const percentage = probability * 100;
        return percentage.toFixed(2) + '%';
    }

    // Find non-transitive relationships (A beats B, B beats C, C beats A)
    static findNonTransitiveRelations(diceArray, probabilities) {
        const relations = [];
        const numDice = diceArray.length;

        // Check all possible combinations of 3 dice
        for (let a = 0; a < numDice; a++) {
            for (let b = 0; b < numDice; b++) {
                for (let c = 0; c < numDice; c++) {
                    // Make sure we're looking at 3 different dice
                    if (a !== b && b !== c && c !== a) {
                        // Check if we have a cycle: A beats B, B beats C, C beats A
                        const aBeatsBProbability = probabilities[a][b];
                        const bBeatsCProbability = probabilities[b][c];
                        const cBeatsAProbability = probabilities[c][a];

                        if (aBeatsBProbability > 0.5 && bBeatsCProbability > 0.5 && cBeatsAProbability > 0.5) {
                            const description = 'Dice ' + a + ' beats Dice ' + b +
                                ' (' + this.formatProbabilityDetailed(aBeatsBProbability) + '), ' +
                                'Dice ' + b + ' beats Dice ' + c +
                                ' (' + this.formatProbabilityDetailed(bBeatsCProbability) + '), ' +
                                'Dice ' + c + ' beats Dice ' + a +
                                ' (' + this.formatProbabilityDetailed(cBeatsAProbability) + ')';

                            relations.push({
                                cycle: [a, b, c],
                                description: description
                            });
                        }
                    }
                }
            }
        }

        return relations;
    }

    // Analyze the dice set to find interesting characteristics
    static analyzeDiceSet(diceArray, probabilities) {
        const numDice = diceArray.length;
        const analysis = {
            hasNonTransitive: false,
            dominantDice: [],
            weakestDice: [],
            averageWinRates: []
        };

        // Calculate average win rate for each dice
        for (let i = 0; i < numDice; i++) {
            let totalWinRate = 0;
            let gamesPlayed = 0;

            // Sum up win rates against all other dice
            for (let j = 0; j < numDice; j++) {
                if (i !== j) {
                    totalWinRate += probabilities[i][j];
                    gamesPlayed++;
                }
            }

            // Calculate average win rate for this dice
            analysis.averageWinRates[i] = totalWinRate / gamesPlayed;
        }

        // Check for non-transitive relations
        const relations = this.findNonTransitiveRelations(diceArray, probabilities);
        analysis.hasNonTransitive = relations.length > 0;

        return analysis;
    }
}

module.exports = ProbabilityCalculator;