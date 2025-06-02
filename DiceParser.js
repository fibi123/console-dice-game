const Dice = require('./Dice');

class DiceParser {
    static parse(args) {
        const errors = this.validate(args);
        if (errors.length > 0) {
            throw new Error(this.formatErrorMessage(errors));
        }

        return args.map(arg => Dice.fromString(arg));
    }

    static validate(args) {
        const errors = [];

        if (!Array.isArray(args) || args.length < 3) {
            errors.push('At least 3 dice configurations are required');
            return errors;
        }

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];

            if (typeof arg !== 'string') {
                errors.push(`Argument ${i + 1} must be a string`);
                continue;
            }

            const parts = arg.split(',');

            if (parts.length === 0) {
                errors.push(`Dice ${i + 1} has no face values`);
                continue;
            }

            for (let j = 0; j < parts.length; j++) {
                const part = parts[j].trim();

                // First check if it's a valid number using parseFloat
                const floatNum = parseFloat(part);

                if (isNaN(floatNum)) {
                    errors.push(`Dice ${i + 1}, face ${j + 1}: "${part}" is not a valid number`);
                    continue;
                }

                // Then check if it's an integer by comparing parseFloat and parseInt
                const intNum = parseInt(part, 10);

                if (floatNum !== intNum) {
                    errors.push(`Dice ${i + 1}, face ${j + 1}: "${part}" is not an integer`);
                }
            }
        }

        return errors;
    }

    static formatErrorMessage(errors) {
        let message = 'Invalid dice configuration:\n';
        errors.forEach(error => {
            message += `  - ${error}\n`;
        });
        message += '\nExample usage: node main.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3\n';
        message += 'Each argument should be comma-separated integers representing dice faces.';
        return message;
    }
}

module.exports = DiceParser;