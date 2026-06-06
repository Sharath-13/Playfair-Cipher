function generateMatrix(key) {
    key = key.toUpperCase().replace(/J/g, 'I');

    let matrix = [];
    let used = {};

    for (let char of key) {
        if (/[A-Z]/.test(char) && !used[char]) {
            matrix.push(char);
            used[char] = true;
        }
    }

    for (let i = 65; i <= 90; i++) {
        let char = String.fromCharCode(i);

        if (char === 'J') continue;

        if (!used[char]) {
            matrix.push(char);
            used[char] = true;
        }
    }

    return matrix;
}

function displayMatrix(matrix) {
    const matrixDiv = document.getElementById("matrix");
    matrixDiv.innerHTML = "";

    matrix.forEach(char => {
        const cell = document.createElement("div");
        cell.textContent = char;
        matrixDiv.appendChild(cell);
    });
}

function updateMatrix() {
    const key = document.getElementById("key").value;
    const matrix = generateMatrix(key);
    displayMatrix(matrix);
}

function preprocessMessage(msg) {
    msg = msg.toUpperCase()
             .replace(/J/g, "I")
             .replace(/[^A-Z]/g, "");

    let result = "";
    let i = 0;

    while (i < msg.length) {
        let first = msg[i];
        let second = (i + 1 < msg.length) ? msg[i + 1] : "X";

        if (first === second) {
            result += first + "X";
            i++;
        } else {
            result += first + second;
            i += 2;
        }
    }

    if (result.length % 2 !== 0) {
        result += "X";
    }

    return result;
}

function findPosition(matrix, char) {
    let index = matrix.indexOf(char);
    return [Math.floor(index / 5), index % 5];
}

function encryptPair(matrix, a, b) {
    let [rowA, colA] = findPosition(matrix, a);
    let [rowB, colB] = findPosition(matrix, b);

    if (rowA === rowB) {
        return matrix[rowA * 5 + (colA + 1) % 5] +
               matrix[rowB * 5 + (colB + 1) % 5];
    }

    if (colA === colB) {
        return matrix[((rowA + 1) % 5) * 5 + colA] +
               matrix[((rowB + 1) % 5) * 5 + colB];
    }

    return matrix[rowA * 5 + colB] +
           matrix[rowB * 5 + colA];
}

function decryptPair(matrix, a, b) {
    let [rowA, colA] = findPosition(matrix, a);
    let [rowB, colB] = findPosition(matrix, b);

    if (rowA === rowB) {
        return matrix[rowA * 5 + (colA + 4) % 5] +
               matrix[rowB * 5 + (colB + 4) % 5];
    }

    if (colA === colB) {
        return matrix[((rowA + 4) % 5) * 5 + colA] +
               matrix[((rowB + 4) % 5) * 5 + colB];
    }

    return matrix[rowA * 5 + colB] +
           matrix[rowB * 5 + colA];
}

function encryptMessage() {
    let key = document.getElementById("key").value;
    let msg = document.getElementById("message").value;

    let matrix = generateMatrix(key);
    let processed = preprocessMessage(msg);

    let result = "";

    for (let i = 0; i < processed.length; i += 2) {
        result += encryptPair(matrix, processed[i], processed[i + 1]);
    }

    document.getElementById("output").innerText =
        "Encrypted: " + result;
}

function decryptMessage() {
    let key = document.getElementById("key").value;
    let msg = document.getElementById("message").value;

    let matrix = generateMatrix(key);

    msg = msg.toUpperCase().replace(/[^A-Z]/g, "");

    let result = "";

    for (let i = 0; i < msg.length; i += 2) {
        result += decryptPair(matrix, msg[i], msg[i + 1]);
    }

    document.getElementById("output").innerText =
        "Decrypted: " + result;
}

updateMatrix();