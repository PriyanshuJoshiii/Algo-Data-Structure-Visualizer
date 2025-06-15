const algorithmBtn = document.getElementById('algorithm-btn');
const datastructureBtn = document.getElementById('datastructure-btn');
const algorithmSection = document.getElementById('algorithm-section');
const datastructureSection = document.getElementById('datastructure-section');
const algorithmSelect = document.getElementById('algorithm');
const datastructureSelect = document.getElementById('datastructure');
const arrayInput = document.getElementById('array-input');
const arrayInputDs = document.getElementById('array-input-ds');
const generateRandomBtn = document.getElementById('generate-random');
const generateRandomDsBtn = document.getElementById('generate-random-ds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const resetBtnDs = document.getElementById('reset-btn-ds');
const speedSlider = document.getElementById('speed');
const speedSliderDs = document.getElementById('speed-ds');
const arrayContainer = document.getElementById('array-container');
const graphContainer = document.getElementById('graph-container');
const algorithmInfo = document.getElementById('algorithm-info');
const complexityInfo = document.getElementById('complexity');
const passCounter = document.getElementById('pass-counter');
const comparisonDisplay = document.getElementById('comparison-display');
const originalArrayValues = document.getElementById('original-array-values');
const sortedArrayValues = document.getElementById('sorted-array-values');
const pushBtn = document.getElementById('push-btn');
const popBtn = document.getElementById('pop-btn');
const enqueueBtn = document.getElementById('enqueue-btn');
const dequeueBtn = document.getElementById('dequeue-btn');
const stackQueueControls = document.querySelector('.stack-queue-controls');
const stackControls = document.querySelector('.stack-controls');
const queueControls = document.querySelector('.queue-controls');
const rabinKarpInputs = document.getElementById('rabin-karp-inputs');
const textInput = document.getElementById('text-input');
const patternInput = document.getElementById('pattern-input');

let array = [];
let originalArray = []; 
let isRunning = false;
let isPaused = false;
let animationSpeed = 1000; 
let currentAlgorithm = 'bubbleSort';
let currentDatastructure = 'stack';

// Stack and Queue data structures
let stack = [];
let queue = [];

const algorithmDetails = {
    bubbleSort: {
        info: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        complexity: "Time Complexity: O(n²)\nSpace Complexity: O(1)"
    },
    mergeSort: {
        info: "Merge Sort is a divide-and-conquer algorithm that recursively breaks down the problem into smaller subproblems until they become simple enough to solve directly.",
        complexity: "Time Complexity: O(n log n)\nSpace Complexity: O(n)"
    },
    binarySearch: {
        info: "Binary Search is an efficient algorithm for finding an element in a sorted array by repeatedly dividing the search interval in half.",
        complexity: "Time Complexity: O(log n)\nSpace Complexity: O(1)"
    },
    rabinKarp: {
        info: "Rabin-Karp is a string searching algorithm that uses hashing to find patterns in text. It uses a rolling hash function to efficiently compare substrings.",
        complexity: "Time Complexity: O(n+m) average case, O(nm) worst case\nSpace Complexity: O(1)"
    }
};

const datastructureDetails = {
    stack: {
        info: "Stack is a linear data structure that follows LIFO (Last In First Out) principle. Elements can only be added or removed from the top.",
        complexity: "Time Complexity: O(1) for push and pop operations\nSpace Complexity: O(n)"
    },
    queue: {
        info: "Queue is a linear data structure that follows FIFO (First In First Out) principle. Elements are added at the rear and removed from the front.",
        complexity: "Time Complexity: O(1) for enqueue and dequeue operations\nSpace Complexity: O(n)"
    }
};

// Event Listeners
algorithmBtn.addEventListener('click', () => switchVisualizationType('algorithm'));
datastructureBtn.addEventListener('click', () => switchVisualizationType('datastructure'));
algorithmSelect.addEventListener('change', () => {
    updateAlgorithmInfo();
    if (algorithmSelect.value === 'rabinKarp') {
        rabinKarpInputs.style.display = 'block';
        document.querySelector('.input-section').style.display = 'none';
    } else {
        rabinKarpInputs.style.display = 'none';
        document.querySelector('.input-section').style.display = 'block';
    }
});
datastructureSelect.addEventListener('change', updateDatastructureInfo);
generateRandomBtn.addEventListener('click', generateRandomArray);
generateRandomDsBtn.addEventListener('click', generateRandomArray);
startBtn.addEventListener('click', startVisualization);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetVisualization);
resetBtnDs.addEventListener('click', resetVisualization);
speedSlider.addEventListener('input', updateSpeed);
speedSliderDs.addEventListener('input', updateSpeed);
pushBtn.addEventListener('click', pushOperation);
popBtn.addEventListener('click', popOperation);
enqueueBtn.addEventListener('click', enqueueOperation);
dequeueBtn.addEventListener('click', dequeueOperation);

// Initialize
updateAlgorithmInfo();

// Functions
function switchVisualizationType(type) {
    if (type === 'algorithm') {
        algorithmBtn.classList.add('active');
        datastructureBtn.classList.remove('active');
        algorithmSection.style.display = 'block';
        datastructureSection.style.display = 'none';
        resetVisualization();
    } else {
        algorithmBtn.classList.remove('active');
        datastructureBtn.classList.add('active');
        algorithmSection.style.display = 'none';
        datastructureSection.style.display = 'block';
        resetVisualization();
    }
}

function updateAlgorithmInfo() {
    currentAlgorithm = algorithmSelect.value;
    const details = algorithmDetails[currentAlgorithm];
    algorithmInfo.textContent = details.info;
    complexityInfo.textContent = details.complexity;
}

function updateDatastructureInfo() {
    currentDatastructure = datastructureSelect.value;
    const details = datastructureDetails[currentDatastructure];
    algorithmInfo.textContent = details.info;
    complexityInfo.textContent = details.complexity;

    if (currentDatastructure === 'stack') {
        stackControls.style.display = 'block';
        queueControls.style.display = 'none';
    } else {
        stackControls.style.display = 'none';
        queueControls.style.display = 'block';
    }
}

function generateRandomArray() {
    const isDatastructure = datastructureSection.style.display !== 'none';
    if (isDatastructure) {
        array = Array.from({length: 5}, () => Math.floor(Math.random() * 100) + 1);
    } else {
        array = Array.from({length: 7}, () => Math.floor(Math.random() * 100) + 1);
    }
    originalArray = [...array];
    updateArrayDisplay();
}

function updateArrayDisplay() {
    arrayContainer.innerHTML = '';
    
    const isDatastructure = datastructureSection.style.display !== 'none';
    if (isDatastructure) {
        if (currentDatastructure === 'stack') {
            arrayContainer.style.flexDirection = 'column-reverse';
            arrayContainer.classList.add('stack-mode');
            arrayContainer.classList.remove('queue-mode');
        } else {
            arrayContainer.style.flexDirection = 'row';
            arrayContainer.classList.add('queue-mode');
            arrayContainer.classList.remove('stack-mode');
        }
    } else {
        arrayContainer.style.flexDirection = 'row';
        arrayContainer.classList.remove('stack-mode', 'queue-mode');
    }
    
    array.forEach((value, index) => {
        const block = document.createElement('div');
        block.className = 'array-block';
        block.textContent = value;
        block.setAttribute('data-value', value);
        block.setAttribute('data-index', index);
        arrayContainer.appendChild(block);
    });
}

function updateSpeed() {
    const isDatastructure = datastructureSection.style.display !== 'none';
    const slider = isDatastructure ? speedSliderDs : speedSlider;
    animationSpeed = 2000 - (slider.value * 15);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startVisualization() {
    if (isRunning) return;
    isRunning = true;
    isPaused = false;
    
    if (currentAlgorithm === 'rabinKarp') {
        await rabinKarp();
    } else {
        const inputArray = arrayInput.value.split(',').map(num => parseInt(num.trim()));
        if (inputArray.length > 0 && !inputArray.includes(NaN)) {
            array = inputArray;
            originalArray = [...array];
        }
        
        updateArrayDisplay();
        
        switch (currentAlgorithm) {
            case 'bubbleSort':
                await bubbleSort();
                break;
            case 'mergeSort':
                await mergeSort(0, array.length - 1);
                break;
            case 'binarySearch':
                await binarySearch();
                break;
        }
        
        if (currentAlgorithm !== 'binarySearch') {
            showArrayComparison();
        }
    }
    
    isRunning = false;
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
}

function resetVisualization() {
    isRunning = false;
    isPaused = false;
    arrayContainer.innerHTML = '';
    arrayContainer.classList.remove('string-container');
    graphContainer.innerHTML = '';
    graphContainer.style.display = 'none';
    arrayContainer.style.display = 'flex';
    document.querySelector('.pointer')?.remove();
    passCounter.textContent = 'Pass: 0';
    comparisonDisplay.style.display = 'none';
    arrayContainer.style.flexDirection = 'row';
    arrayContainer.classList.remove('stack-mode', 'queue-mode');
    array = [];
    originalArray = [];
    textInput.value = '';
    patternInput.value = '';
}

function showArrayComparison() {
    comparisonDisplay.style.display = 'block';
    originalArrayValues.innerHTML = '';
    sortedArrayValues.innerHTML = '';
    
    originalArray.forEach(value => {
        const valueElement = document.createElement('div');
        valueElement.className = 'array-value';
        valueElement.textContent = value;
        originalArrayValues.appendChild(valueElement);
    });
    
    array.forEach(value => {
        const valueElement = document.createElement('div');
        valueElement.className = 'array-value';
        valueElement.textContent = value;
        sortedArrayValues.appendChild(valueElement);
    });
}

// Stack Operations
async function stackOperations() {
    const blocks = document.querySelectorAll('.array-block');
    let passCount = 0;
    
    // Push operation
    for (let i = 0; i < array.length; i++) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = setInterval(() => {
                    if (!isPaused) {
                        clearInterval(checkPause);
                        resolve();
                    }
                }, 100);
            });
        }
        
        passCount++;
        passCounter.textContent = `Pass: ${passCount}`;
        
        blocks[i].classList.add('pushing');
        await sleep(animationSpeed);
        blocks[i].classList.remove('pushing');
        blocks[i].classList.add('pushed');
    }
    
    // Pop operation
    for (let i = array.length - 1; i >= 0; i--) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = setInterval(() => {
                    if (!isPaused) {
                        clearInterval(checkPause);
                        resolve();
                    }
                }, 100);
            });
        }
        
        passCount++;
        passCounter.textContent = `Pass: ${passCount}`;
        
        blocks[i].classList.add('popping');
        await sleep(animationSpeed);
        blocks[i].classList.remove('popping', 'pushed');
    }
}

// Queue Operations
async function queueOperations() {
    const blocks = document.querySelectorAll('.array-block');
    let passCount = 0;
    
    // Enqueue operation
    for (let i = 0; i < array.length; i++) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = setInterval(() => {
                    if (!isPaused) {
                        clearInterval(checkPause);
                        resolve();
                    }
                }, 100);
            });
        }
        
        passCount++;
        passCounter.textContent = `Pass: ${passCount}`;
        
        blocks[i].classList.add('enqueueing');
        await sleep(animationSpeed);
        blocks[i].classList.remove('enqueueing');
        blocks[i].classList.add('enqueued');
    }
    
    // Dequeue operation
    for (let i = 0; i < array.length; i++) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = setInterval(() => {
                    if (!isPaused) {
                        clearInterval(checkPause);
                        resolve();
                    }
                }, 100);
            });
        }
        
        passCount++;
        passCounter.textContent = `Pass: ${passCount}`;
        
        blocks[i].classList.add('dequeueing');
        await sleep(animationSpeed);
        blocks[i].classList.remove('dequeueing', 'enqueued');
    }
}

// Algorithm Implementations
async function bubbleSort() {
    const blocks = document.querySelectorAll('.array-block');
    let passCount = 0;

    for (let i = 0; i < array.length - 1; i++) {
        passCount++;
        document.getElementById('pass-counter').textContent = `Pass: ${passCount}`;

        for (let j = 0; j < array.length - i - 1; j++) {
            if (isPaused) {
                await new Promise(resolve => {
                    const checkPause = setInterval(() => {
                        if (!isPaused) {
                            clearInterval(checkPause);
                            resolve();
                        }
                    }, 100);
                });
            }

            // Add 'comparing' class
            blocks[j].classList.add('comparing');
            blocks[j + 1].classList.add('comparing');

            await sleep(animationSpeed);

            if (array[j] > array[j + 1]) {
                await swapElements(j, j + 1);

                // Refresh block references after swap
                const newBlocks = document.querySelectorAll('.array-block');
                blocks[j] = newBlocks[j];
                blocks[j + 1] = newBlocks[j + 1];
            }

            // Remove 'comparing' class after comparison/swap
            blocks[j].classList.remove('comparing');
            blocks[j + 1].classList.remove('comparing');
        }
    }

    alert(`Sorting completed in ${passCount} passes`);
}

async function swapElements(index1, index2) {
    const blocks = document.querySelectorAll('.array-block');
    const block1 = blocks[index1];
    const block2 = blocks[index2];

    // Get positions
    const pos1 = block1.getBoundingClientRect();
    const pos2 = block2.getBoundingClientRect();
    const containerRect = arrayContainer.getBoundingClientRect();

    const x1 = pos1.left - containerRect.left;
    const x2 = pos2.left - containerRect.left;

    // Animate swap
    block1.style.transform = `translateX(${x2 - x1}px)`;
    block2.style.transform = `translateX(${x1 - x2}px)`;

    await sleep(animationSpeed);

    // Swap data in array
    [array[index1], array[index2]] = [array[index2], array[index1]];

    // Swap heights and text content manually
    const tempHeight = block1.style.height;
    const tempText = block1.textContent;

    block1.style.height = block2.style.height;
    block1.textContent = block2.textContent;

    block2.style.height = tempHeight;
    block2.textContent = tempText;

    // Reset animation
    block1.style.transform = '';
    block2.style.transform = '';
}

async function mergeSort(start, end) {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
    
    // Show division step
    const blocks = document.querySelectorAll('.array-block');
    for (let i = start; i <= end; i++) {
        blocks[i].classList.add('dividing');
    }
    await sleep(animationSpeed);
    
    // Show left subarray
    for (let i = start; i <= mid; i++) {
        blocks[i].classList.add('left-subarray');
    }
    await sleep(animationSpeed);
    
    // Show right subarray
    for (let i = mid + 1; i <= end; i++) {
        blocks[i].classList.add('right-subarray');
    }
    await sleep(animationSpeed);
    
    // Clear highlights
    for (let i = start; i <= end; i++) {
        blocks[i].classList.remove('dividing', 'left-subarray', 'right-subarray');
    }
    
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const blocks = document.querySelectorAll('.array-block');
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    
    let i = 0, j = 0, k = start;
    let passCount = parseInt(passCounter.textContent.split(': ')[1]) || 0;
    passCount++;
    passCounter.textContent = `Pass: ${passCount}`;
    
    // Create temporary array to store merged result
    const tempArray = new Array(end - start + 1);
    let tempIndex = 0;
    
    // Show merging process
    for (let i = start; i <= end; i++) {
        blocks[i].classList.add('merging');
    }
    await sleep(animationSpeed);
    
    while (i < left.length && j < right.length) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = setInterval(() => {
                    if (!isPaused) {
                        clearInterval(checkPause);
                        resolve();
                    }
                }, 100);
            });
        }
        
        // Highlight elements being compared
        const leftIndex = start + i;
        const rightIndex = mid + 1 + j;
        
        if (leftIndex < blocks.length) blocks[leftIndex].classList.add('comparing');
        if (rightIndex < blocks.length) blocks[rightIndex].classList.add('comparing');
        await sleep(animationSpeed);
        
        if (left[i] <= right[j]) {
            tempArray[tempIndex] = left[i];
            if (leftIndex < blocks.length) {
                blocks[leftIndex].classList.add('moving');
                blocks[leftIndex].style.transform = `translateY(-20px)`;
            }
            i++;
        } else {
            tempArray[tempIndex] = right[j];
            if (rightIndex < blocks.length) {
                blocks[rightIndex].classList.add('moving');
                blocks[rightIndex].style.transform = `translateY(-20px)`;
            }
            j++;
        }
        
        await sleep(animationSpeed);
        
        // Clear highlights and reset transforms
        if (leftIndex < blocks.length) {
            blocks[leftIndex].classList.remove('comparing', 'moving');
            blocks[leftIndex].style.transform = '';
        }
        if (rightIndex < blocks.length) {
            blocks[rightIndex].classList.remove('comparing', 'moving');
            blocks[rightIndex].style.transform = '';
        }
        
        tempIndex++;
    }
    
    // Copy remaining elements of left array
    while (i < left.length) {
        const leftIndex = start + i;
        if (leftIndex < blocks.length) {
            blocks[leftIndex].classList.add('moving');
            blocks[leftIndex].style.transform = `translateY(-20px)`;
        }
        tempArray[tempIndex] = left[i];
        await sleep(animationSpeed);
        if (leftIndex < blocks.length) {
            blocks[leftIndex].classList.remove('moving');
            blocks[leftIndex].style.transform = '';
        }
        i++;
        tempIndex++;
    }
    
    // Copy remaining elements of right array
    while (j < right.length) {
        const rightIndex = mid + 1 + j;
        if (rightIndex < blocks.length) {
            blocks[rightIndex].classList.add('moving');
            blocks[rightIndex].style.transform = `translateY(-20px)`;
        }
        tempArray[tempIndex] = right[j];
        await sleep(animationSpeed);
        if (rightIndex < blocks.length) {
            blocks[rightIndex].classList.remove('moving');
            blocks[rightIndex].style.transform = '';
        }
        j++;
        tempIndex++;
    }
    
    // Copy back to original array and update visualization
    for (let i = 0; i < tempArray.length; i++) {
        array[start + i] = tempArray[i];
        if (start + i < blocks.length) {
            blocks[start + i].textContent = tempArray[i];
            blocks[start + i].classList.add('sorted');
        }
    }
    
    // Clear merging highlights
    for (let i = start; i <= end; i++) {
        blocks[i].classList.remove('merging');
    }
    
    await sleep(animationSpeed);
}

async function binarySearch() {
    // First, ensure the array is sorted
    array.sort((a, b) => a - b);
    updateArrayDisplay();
    
    const target = parseInt(prompt('Enter the number to search for:'));
    if (isNaN(target)) {
        alert('Please enter a valid number');
        return;
    }
    
    const blocks = document.querySelectorAll('.array-block');
    let left = 0;
    let right = array.length - 1;
    let passCount = 0;
    
    // Clear any existing highlights
    blocks.forEach(block => {
        block.classList.remove('comparing', 'search-range', 'sorted');
    });
    
    while (left <= right) {
        passCount++;
        document.getElementById('pass-counter').textContent = `Pass: ${passCount}`;
        
        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = setInterval(() => {
                    if (!isPaused) {
                        clearInterval(checkPause);
                        resolve();
                    }
                }, 100);
            });
        }
        
        const mid = Math.floor((left + right) / 2);
        
        // Clear previous highlights
        blocks.forEach(block => {
            block.classList.remove('comparing', 'search-range');
        });
        
        // Highlight current search range
        for (let i = left; i <= right; i++) {
            blocks[i].classList.add('search-range');
        }
        
        // Highlight middle element being compared
        blocks[mid].classList.add('comparing');
        await sleep(animationSpeed);
        
        if (array[mid] === target) {
            // Found the target
            blocks[mid].classList.remove('comparing', 'search-range');
            blocks[mid].classList.add('sorted');
            alert(`Found ${target} at index ${mid} in ${passCount} passes`);
            return;
        }
        
        if (array[mid] < target) {
            // Search in right half
            left = mid + 1;
        } else {
            // Search in left half
            right = mid - 1;
        }
        
        await sleep(animationSpeed);
    }
    
    // Clear all highlights
    blocks.forEach(block => {
        block.classList.remove('comparing', 'search-range');
    });
    
    alert(`${target} not found in the array after ${passCount} passes`);
}

// Stack Operations
async function pushOperation() {
    if (isRunning) return;
    isRunning = true;

    const value = prompt('Enter a number to push:');
    if (value === null || value === '') {
        isRunning = false;
        return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
        alert('Please enter a valid number');
        isRunning = false;
        return;
    }

    array.push(numValue);
    updateArrayDisplay();
    
    const blocks = document.querySelectorAll('.array-block');
    const newBlock = blocks[blocks.length - 1];
    
    newBlock.classList.add('pushing');
    await sleep(animationSpeed);
    newBlock.classList.remove('pushing');
    newBlock.classList.add('pushed');
    
    isRunning = false;
}

async function popOperation() {
    if (isRunning || array.length === 0) return;
    isRunning = true;

    const blocks = document.querySelectorAll('.array-block');
    const lastBlock = blocks[blocks.length - 1];
    
    lastBlock.classList.add('popping');
    await sleep(animationSpeed);
    
    array.pop();
    updateArrayDisplay();
    
    isRunning = false;
}

// Queue Operations
async function enqueueOperation() {
    if (isRunning) return;
    isRunning = true;

    const value = prompt('Enter a number to enqueue:');
    if (value === null || value === '') {
        isRunning = false;
        return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
        alert('Please enter a valid number');
        isRunning = false;
        return;
    }

    array.push(numValue);
    updateArrayDisplay();
    
    const blocks = document.querySelectorAll('.array-block');
    const newBlock = blocks[blocks.length - 1];
    
    newBlock.classList.add('enqueueing');
    await sleep(animationSpeed);
    newBlock.classList.remove('enqueueing');
    newBlock.classList.add('enqueued');
    
    isRunning = false;
}

async function dequeueOperation() {
    if (isRunning || array.length === 0) return;
    isRunning = true;

    const blocks = document.querySelectorAll('.array-block');
    const firstBlock = blocks[0];
    
    firstBlock.classList.add('dequeueing');
    await sleep(animationSpeed);
    
    array.shift();
    updateArrayDisplay();
    
    isRunning = false;
}

// Rabin-Karp algorithm implementation
async function rabinKarp() {
    const text = textInput.value.toLowerCase();
    const pattern = patternInput.value.toLowerCase();
    
    if (!text || !pattern) {
        alert('Please enter both text and pattern');
        return;
    }

    if (pattern.length > text.length) {
        alert('Pattern length cannot be greater than text length');
        return;
    }

    // Clear previous visualization
    arrayContainer.innerHTML = '';
    arrayContainer.classList.add('string-container');

    // Create character blocks for text
    for (let i = 0; i < text.length; i++) {
        const charBlock = document.createElement('div');
        charBlock.className = 'char-block';
        charBlock.textContent = text[i];
        charBlock.setAttribute('data-index', i);
        arrayContainer.appendChild(charBlock);
    }

    const MOD = 11; // Using mod 11 as requested
    const d = 26; // Base for hashing (a=1, b=2, c=3, ..., z=26)
    const h = Math.pow(d, pattern.length - 1) % MOD;
    
    // Calculate pattern hash
    let patternHash = 0;
    for (let i = 0; i < pattern.length; i++) {
        const charValue = pattern.charCodeAt(i) - 96; // a=1, b=2, c=3, ..., z=26
        patternHash = (d * patternHash + charValue) % MOD;
    }

    // Calculate initial text hash
    let textHash = 0;
    for (let i = 0; i < pattern.length; i++) {
        const charValue = text.charCodeAt(i) - 96; // a=1, b=2, c=3, ..., z=26
        textHash = (d * textHash + charValue) % MOD;
    }

    let passCount = 0;
    const blocks = document.querySelectorAll('.char-block');

    // Add hash value display
    const hashDisplay = document.createElement('div');
    hashDisplay.className = 'hash-value';
    arrayContainer.appendChild(hashDisplay);

    // Slide the pattern over text
    for (let i = 0; i <= text.length - pattern.length; i++) {
        passCount++;
        passCounter.textContent = `Pass: ${passCount}`;

        if (isPaused) {
            await new Promise(resolve => {
                const checkPause = setInterval(() => {
                    if (!isPaused) {
                        clearInterval(checkPause);
                        resolve();
                    }
                }, 100);
            });
        }

        // Highlight current window
        for (let j = 0; j < pattern.length; j++) {
            blocks[i + j].classList.add('comparing');
        }

        // Update hash display
        hashDisplay.textContent = `Pattern Hash: ${patternHash} | Window Hash: ${textHash}`;

        await sleep(animationSpeed);

        // Check for match
        if (patternHash === textHash) {
            let match = true;
            for (let j = 0; j < pattern.length; j++) {
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    blocks[i + j].classList.add('mismatch');
                    break;
                }
            }

            if (match) {
                for (let j = 0; j < pattern.length; j++) {
                    blocks[i + j].classList.remove('comparing');
                    blocks[i + j].classList.add('matching');
                }
            } else {
                // Clear mismatch highlights after a short delay
                setTimeout(() => {
                    for (let j = 0; j < pattern.length; j++) {
                        blocks[i + j].classList.remove('mismatch');
                    }
                }, animationSpeed);
            }
        } else {
            // If hash doesn't match, mark as mismatch
            for (let j = 0; j < pattern.length; j++) {
                blocks[i + j].classList.add('mismatch');
            }
            // Clear mismatch highlights after a short delay
            setTimeout(() => {
                for (let j = 0; j < pattern.length; j++) {
                    blocks[i + j].classList.remove('mismatch');
                }
            }, animationSpeed);
        }

        // Clear comparing highlights
        for (let j = 0; j < pattern.length; j++) {
            blocks[i + j].classList.remove('comparing');
        }

        // Calculate hash for next window
        if (i < text.length - pattern.length) {
            const oldCharValue = text.charCodeAt(i) - 96;
            const newCharValue = text.charCodeAt(i + pattern.length) - 96;
            textHash = (d * (textHash - oldCharValue * h) + newCharValue) % MOD;
            if (textHash < 0) textHash += MOD;
        }

        await sleep(animationSpeed);
    }

    // Show results
    const matches = document.querySelectorAll('.char-block.matching').length / pattern.length;
    alert(`Found ${matches} matches in ${passCount} passes`);
}

// Add new CSS classes for merge sort visualization
const style = document.createElement('style');
style.textContent = `
    .dividing {
        background-color: #9b59b6 !important;
        box-shadow: 0 0 15px rgba(155, 89, 182, 0.5);
    }
    
    .left-subarray {
        background-color: #e74c3c !important;
        box-shadow: 0 0 15px rgba(231, 76, 60, 0.5);
    }
    
    .right-subarray {
        background-color: #3498db !important;
        box-shadow: 0 0 15px rgba(52, 152, 219, 0.5);
    }
    
    .merging {
        background-color: #f1c40f !important;
        box-shadow: 0 0 15px rgba(241, 196, 15, 0.5);
    }
`;
document.head.appendChild(style); 