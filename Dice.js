class Dice {
    constructor(faces) {
        // Check if faces is a valid array
        if (!Array.isArray(faces) || faces.length === 0) {
            throw new Error('Dice faces must be a non-empty array');
        }

        //Checking if dice has 6 faces or not
        if(!Array.isArray(faces)|| faces.length>6||faces.length < 6){
            throw new Error('Incorrect number of faces. Dice must have 6 faces only.');
        }

        // Check if all faces are whole numbers
        for (let i = 0; i < faces.length; i++) {
            if (!Number.isInteger(faces[i])) {
                throw new Error('All dice faces must be integers');
            }
        }

        // Store a copy of the faces array
        this.faces = [];
        for (let i = 0; i < faces.length; i++) {
            this.faces[i] = faces[i];
        }
    }

    // Get a copy of all face values
    getFaces() {
        const facesCopy = [];
        for (let i = 0; i < this.faces.length; i++) {
            facesCopy[i] = this.faces[i];
        }
        return facesCopy;
    }

    // Get the number of faces on this dice
    getNumFaces() {
        return this.faces.length;
    }

    // Get the value of a specific face by its index
    getFaceValue(index) {
        if (index < 0 || index >= this.faces.length) {
            throw new Error('Invalid face index: ' + index);
        }
        return this.faces[index];
    }

    // Convert dice to string format like "1,2,3,4,5,6"
    toString() {
        let result = '';
        for (let i = 0; i < this.faces.length; i++) {
            if (i > 0) {
                result += ',';
            }
            result += this.faces[i];
        }
        return result;
    }

    // Create a dice from a string like "1,2,3,4,5,6"
    static fromString(str) {
        const parts = str.split(',');
        const faces = [];

        for (let i = 0; i < parts.length; i++) {
            const trimmed = parts[i].trim();
            const num = parseInt(trimmed, 10);

            if (isNaN(num)) {
                throw new Error('Invalid face value: ' + parts[i]);
            }

            faces[i] = num;
        }

        return new Dice(faces);
    }
}

module.exports = Dice;