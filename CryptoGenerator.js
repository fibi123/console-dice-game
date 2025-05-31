const crypto = require('crypto');

class CryptoGenerator {
    static generateSecureKey() {
        // Generate 256-bit (32 bytes) cryptographically secure key
        return crypto.randomBytes(32);
    }

    static generateUniformRandom(max) {
        // Generate uniform random number in range [0, max) without modulo bias
        const byteLength = Math.ceil(Math.log2(max) / 8);
        const maxValidValue = Math.floor(0x100 ** byteLength / max) * max;

        let randomValue;
        do {
            const randomBytes = crypto.randomBytes(byteLength);
            randomValue = 0;
            for (let i = 0; i < byteLength; i++) {
                randomValue = (randomValue << 8) | randomBytes[i];
            }
        } while (randomValue >= maxValidValue);

        return randomValue % max;
    }

    static calculateHMAC(message, key) {
        // Use SHA3-256 for HMAC calculation
        const hmac = crypto.createHmac('sha3-256', key);
        hmac.update(message.toString());
        return hmac.digest('hex').toUpperCase();
    }

    static keyToHex(key) {
        return key.toString('hex').toUpperCase();
    }

    static verifyHMAC(message, key, expectedHMAC) {
        const calculatedHMAC = this.calculateHMAC(message, key);
        return calculatedHMAC === expectedHMAC.toUpperCase();
    }
}

module.exports = CryptoGenerator;