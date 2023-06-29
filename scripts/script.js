myCanvas.width = (window.innerWidth > 0) ? window.innerWidth / 2 : screen.width / 2;
myCanvas.height = 400;
const margin = 30;
let n = 15;
let array = [];
let moves = [];
let cols = [];
let frameSpeed = 20;
let spacing = (myCanvas.width - margin * 2) / n;
const ctx = myCanvas.getContext("2d");
const maxColumnHeight = 200;

var arraySize = document.getElementById("arraySize");

arraySize.oninput = function generate() {
    n = parseInt(this.value);
    check = true;
    spacing = (myCanvas.width - margin * 2) / n;
    newArray();
}

var sortSpeed = document.getElementById("sortSpeed");

sortSpeed.oninput = function () {
    frameSpeed = parseInt(this.value);
}

newArray();

let audioCtx = null;

function playNote(freq, type) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.2;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.type = type;
    osc.stop(audioCtx.currentTime + dur);

    const node = audioCtx.createGain();
    node.gain.value = 0.4;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function newArray() {
    document.getElementById("Time_Worst").innerText = "";
    document.getElementById("Time_Average").innerText = "";
    document.getElementById("Time_Best").innerText = "";

    //Setting Space complexity
    document.getElementById("Space_Worst").innerText = "";

    array = [];
    cols = [];
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    moves = [];
    for (let i = 0; i < array.length; i++) {
        const x = i * spacing + spacing / 2 + margin;
        const y = myCanvas.height - margin - i * 3;
        const width = spacing - 4;
        const height = maxColumnHeight * array[i];
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const color = { r, g, b };
        cols[i] = new Column(x, y, width, height, color);
    }
}

function bubble() {
    //Setting Time complexities
    document.getElementById("Time_Worst").innerText = "O(N^2)";
    document.getElementById("Time_Average").innerText = "Θ(N^2)";
    document.getElementById("Time_Best").innerText = "Ω(N)";

    //Setting Space complexity
    document.getElementById("Space_Worst").innerText = "O(1)";
    moves = [];
    moves = bubbleSort(array);
}

function insertion() {
    //Setting Time complexities
    document.getElementById("Time_Worst").innerText = "O(N^2)";
    document.getElementById("Time_Average").innerText = "Θ(N^2)";
    document.getElementById("Time_Best").innerText = "Ω(N)";

    //Setting Space complexity
    document.getElementById("Space_Worst").innerText = "O(1)";
    moves = [];
    moves = insertionSort(array);
}

function selection() {
    //Setting Time complexities
    document.getElementById("Time_Worst").innerText = "O(N^2)";
    document.getElementById("Time_Average").innerText = "Θ(N^2)";
    document.getElementById("Time_Best").innerText = "Ω(N^2)";

    //Setting Space complexity
    document.getElementById("Space_Worst").innerText = "O(1)";
    moves = [];
    moves = selectionSort(array);
}

function quick() {
    //Setting Time complexities
    document.getElementById("Time_Worst").innerText = "O(N^2)";
    document.getElementById("Time_Average").innerText = "Θ(N log N)";
    document.getElementById("Time_Best").innerText = "Ω(N log N)";

    //Setting Space complexity
    document.getElementById("Space_Worst").innerText = "O(log N)";
    moves = [];
    moves = quickSort(array, 0, array.length - 1);
}

animate();

function bubbleSort(array) {
    for (let j = 0; j < array.length - 1; j++) {
        var swapped = false;
        for (let i = 1; i < array.length - j; i++) {
            if (array[i - 1] > array[i]) {
                swapped = true;
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
                moves.push(
                    { indices: [i - 1, i], swap: true }
                );
            } else {
                moves.push(
                    { indices: [i - 1, i], swap: false }
                );
            }
        }
        if (!swapped) break;
    }
    return moves;
}

function insertionSort(array) {
    let i, key, j;
    for (i = 1; i < array.length; i++) {
        key = array[i];
        j = i - 1;
        moves.push({
            indices: [i, i],
            swap: false
        })
        // Move elements of arr[0..i-1],
        // that are greater than key,
        // to one position ahead of their
        // current position
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            moves.push({ indices: [j + 1, j], swap: true });
            j = j - 1;
        }
        array[j + 1] = key;
    }
    // console.log(array);
    return moves;
}

function selectionSort(array) {
    let i, j, min_idx;

    // One by one move boundary of
    // unsorted subarray
    for (i = 0; i < array.length - 1; i++) {

        // Find the minimum element in
        // unsorted array
        min_idx = i;
        for (j = i + 1; j < array.length; j++) {
            if (array[j] < array[min_idx])
                min_idx = j;
        }

        // Swap the found minimum element
        // with the first element
        if (min_idx != i) {
            // swap(array[min_idx], array[i]);
            [array[min_idx], array[i]] = [array[i], array[min_idx]]
            moves.push({ indices: [min_idx, i], swap: true });
        }
        else {
            moves.push({ indices: [min_idx, i], swap: false });
        }
    }
    return moves;
}

function quickSort(array, low, high) {
    if (low < high) {
        let pivot = array[high];
        let i = (low - 1);
        for (let j = low; j < high; j++) {
            if (array[j] <= pivot) {
                i++;
                // swap(& array[i], & array[j]);
                [array[i], array[j]] = [array[j], array[i]];
                moves.push({ indices: [i, j], swap: true });
            }
            else if (array[j] > pivot && i >= 0) {
                moves.push({ indices: [i, j], swap: false });
            }
        }
        // swap(& array[i + 1], & array[high]);
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        moves.push({ indices: [i + 1, high], swap: true });
        let pi = i + 1;
        quickSort(array, low, pi - 1);
        quickSort(array, pi + 1, high);
    }
    return moves;
}

function animate() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    let changed = false;
    for (let i = 0; i < cols.length; i++) {
        changed = cols[i].draw(ctx) || changed;
    }

    if (!changed && moves.length > 0) {
        const move = moves.shift();
        const [i, j] = move.indices;
        const waveformType = move.swap ? "square" : "sine";
        if (i == j) {
            playNote(cols[i].height * 2, waveformType);
        }
        else {
            playNote(cols[i].height + cols[j].height, waveformType);
        }
        if (i != j) {
            cols[i].jump(frameSpeed);
            cols[j].jump(frameSpeed);
        }
        else {
            cols[i].jump();
        }
        if (move.swap) {
            cols[i].moveTo(cols[j], 1, frameSpeed);
            cols[j].moveTo(cols[i], -1, frameSpeed);
            [cols[i], cols[j]] = [cols[j], cols[i]];
        }
    }

    requestAnimationFrame(animate);
}