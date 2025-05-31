const crypto = require('crypto');

class FairNumberGenerator {
    constructor(range) {
        this.range = range;
        this.secretKey = crypto.randomBytes(32);
        this.secretNumber = crypto.randomInt(0, this.range);
    }

    // Create a hash of the secret number using the secret key
    static hashCode(secretKey, secretNumber) {
        const hmac = crypto.createHmac('sha3-256', secretKey);
        hmac.update(secretNumber.toString());
        return hmac.digest('hex');
    }

    // Get the hash of this generator's secret number
    getHash() {
        return FairNumberGenerator.hashCode(this.secretKey, this.secretNumber);
    }

    // Reveal the secret key
    getSecretKey() {
        return this.secretKey.toString('hex').toUpperCase();
    }

    // Reveal the secret number
    getSecretNumber() {
        return this.secretNumber;
    }

    // Calculate final result by adding user number
    calculateResult(userNumber) {
        return (this.secretNumber + userNumber) % this.range;
    }
}

module.exports = FairNumberGenerator;