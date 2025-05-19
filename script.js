// DOM Elements
const algorithmSelect = document.getElementById('algorithm');
const arrayInput = document.getElementById('array-input');
const generateRandomBtn = document.getElementById('generate-random');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const speedSlider = document.getElementById('speed');
const arrayContainer = document.getElementById('array-container');
const graphContainer = document.getElementById('graph-container');
const algorithmInfo = document.getElementById('algorithm-info');
const complexityInfo = document.getElementById('complexity');
const passCounter = document.getElementById('pass-counter');
const comparisonDisplay = document.getElementById('comparison-display');
const originalArrayValues = document.getElementById('original-array-values');
const sortedArrayValues = document.getElementById('sorted-array-values');

// Global variables
let array = [];
let originalArray = []; // Store the original array
let isRunning = false;
let isPaused = false;
let animationSpeed = 1000; // Default to 1 second
let currentAlgorithm = 'bubbleSort';

// Algorithm information
const algorithmDetails = {
    bubbleSort: {
        info: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        complexity: "Time Complexity: O(n²)\nSpace Complexity: O(1)"
    },
    mergeSort: {
        info: "Merge Sort is a divide-and-conquer algorithm that recursively breaks down the problem into smaller subproblems until they become simple enough to solve directly.",
        complexity: "Time Complexity: O(n log n)\nSpace Complexity: O(n)"
    },
    quickSort: {
        info: "Quick Sort is a divide-and-conquer algorithm that picks an element as pivot and partitions the array around the pivot.",
        complexity: "Time Complexity: O(n log n) average case, O(n²) worst case\nSpace Complexity: O(log n)"
    },
    binarySearch: {
        info: "Binary Search is an efficient algorithm for finding an element in a sorted array by repeatedly dividing the search interval in half.",
        complexity: "Time Complexity: O(log n)\nSpace Complexity: O(1)"
    },
    dfs: {
        info: "Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures.",
        complexity: "Time Complexity: O(V + E)\nSpace Complexity: O(V)"
    }
};

// Event Listeners
algorithmSelect.addEventListener('change', updateAlgorithmInfo);
generateRandomBtn.addEventListener('click', generateRandomArray);
startBtn.addEventListener('click', startVisualization);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetVisualization);
speedSlider.addEventListener('input', updateSpeed);

// Initialize
updateAlgorithmInfo();

// Functions
function updateAlgorithmInfo() {
    currentAlgorithm = algorithmSelect.value;
    const details = algorithmDetails[currentAlgorithm];
    algorithmInfo.textContent = details.info;
    complexityInfo.textContent = details.complexity;
}

function generateRandomArray() {
    array = Array.from({length: 7}, () => Math.floor(Math.random() * 100) + 1);
    originalArray = [...array]; // Store a copy of the original array
    updateArrayDisplay();
}

function updateArrayDisplay() {
    arrayContainer.innerHTML = '';
    
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
    // Convert slider value (1-100) to milliseconds (2000-500)
    // This means:
    // - Slider at 1: 2000ms (2 seconds)
    // - Slider at 50: 1250ms (1.25 seconds)
    // - Slider at 100: 500ms (0.5 seconds)
    animationSpeed = 2000 - (speedSlider.value * 15);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startVisualization() {
    if (isRunning) return;
    isRunning = true;
    isPaused = false;
    
    const inputArray = arrayInput.value.split(',').map(num => parseInt(num.trim()));
    if (inputArray.length > 0 && !inputArray.includes(NaN)) {
        array = inputArray;
        originalArray = [...array]; // Store a copy of the original array
    }
    
    updateArrayDisplay();
    
    switch (currentAlgorithm) {
        case 'bubbleSort':
            await bubbleSort();
            break;
        case 'mergeSort':
            await mergeSort(0, array.length - 1);
            break;
        case 'quickSort':
            await quickSort(0, array.length - 1);
            break;
        case 'binarySearch':
            await binarySearch();
            break;
        case 'dfs':
            await dfs();
            break;
    }
    
    if (currentAlgorithm !== 'dfs' && currentAlgorithm !== 'binarySearch') {
        showArrayComparison();
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
    graphContainer.innerHTML = '';
    graphContainer.style.display = 'none';
    arrayContainer.style.display = 'flex';
    document.querySelector('.pointer')?.remove();
    passCounter.textContent = 'Pass: 0';
    comparisonDisplay.style.display = 'none';
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
            
            movePointer(blocks[j]);
            blocks[j].classList.add('comparing');
            blocks[j + 1].classList.add('comparing');
            
            await sleep(animationSpeed);
            
            if (array[j] > array[j + 1]) {
                await swapElements(j, j + 1);
            }
            
            blocks[j].classList.remove('comparing');
            blocks[j + 1].classList.remove('comparing');
        }
        blocks[array.length - i - 1].classList.add('sorted');
    }
    blocks[0].classList.add('sorted');
    document.querySelector('.pointer')?.remove();
    alert(`Sorting completed in ${passCount} passes`);
}

async function mergeSort(start, end) {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
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
        
        movePointer(blocks[k]);
        blocks[k].classList.add('comparing');
        await sleep(animationSpeed);
        
        if (left[i] <= right[j]) {
            tempArray[tempIndex] = left[i];
            i++;
        } else {
            tempArray[tempIndex] = right[j];
            j++;
        }
        
        blocks[k].classList.add('moving');
        await sleep(500);
        blocks[k].classList.remove('moving');
        blocks[k].classList.remove('comparing');
        k++;
        tempIndex++;
    }
    
    // Copy remaining elements of left array
    while (i < left.length) {
        movePointer(blocks[k]);
        tempArray[tempIndex] = left[i];
        blocks[k].classList.add('moving');
        await sleep(500);
        blocks[k].classList.remove('moving');
        i++;
        k++;
        tempIndex++;
    }
    
    // Copy remaining elements of right array
    while (j < right.length) {
        movePointer(blocks[k]);
        tempArray[tempIndex] = right[j];
        blocks[k].classList.add('moving');
        await sleep(500);
        blocks[k].classList.remove('moving');
        j++;
        k++;
        tempIndex++;
    }
    
    // Copy back to original array
    for (let i = 0; i < tempArray.length; i++) {
        array[start + i] = tempArray[i];
    }
    
    // Update the display
    updateArrayDisplay();
}

async function quickSort(start, end) {
    if (start >= end) return;
    
    let passCount = parseInt(passCounter.textContent.split(': ')[1]) || 0;
    passCount++;
    passCounter.textContent = `Pass: ${passCount}`;
    
    const pivot = await partition(start, end);
    await quickSort(start, pivot - 1);
    await quickSort(pivot + 1, end);
}

async function partition(start, end) {
    const blocks = document.querySelectorAll('.array-block');
    const pivot = array[end];
    let i = start - 1;
    
    for (let j = start; j < end; j++) {
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
        
        movePointer(blocks[j]);
        blocks[j].classList.add('comparing');
        blocks[end].classList.add('comparing');
        await sleep(animationSpeed);
        
        if (array[j] < pivot) {
            i++;
            if (i !== j) {
                await swapElements(i, j);
            }
        }
        
        blocks[j].classList.remove('comparing');
        blocks[end].classList.remove('comparing');
    }
    
    if (i + 1 !== end) {
        await swapElements(i + 1, end);
    }
    
    return i + 1;
}

async function binarySearch() {
    // First, ensure the array is sorted
    array.sort((a, b) => a - b);
    updateArrayDisplay();
    
    const target = parseInt(prompt('Enter the number to search for:'));
    if (isNaN(target)) return;
    
    const blocks = document.querySelectorAll('.array-block');
    let left = 0;
    let right = array.length - 1;
    let passCount = 0;
    
    // Highlight the initial search range
    for (let i = 0; i < array.length; i++) {
        blocks[i].classList.add('search-range');
    }
    
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
            block.classList.remove('comparing');
        });
        
        // Highlight current search range
        for (let i = 0; i < array.length; i++) {
            if (i < left || i > right) {
                blocks[i].classList.remove('search-range');
            } else {
                blocks[i].classList.add('search-range');
            }
        }
        
        // Highlight and move pointer to middle element
        blocks[mid].classList.add('comparing');
        movePointer(blocks[mid]);
        await sleep(animationSpeed);
        
        if (array[mid] === target) {
            blocks[mid].classList.remove('comparing', 'search-range');
            blocks[mid].classList.add('sorted');
            alert(`Found ${target} at index ${mid} in ${passCount} passes`);
            return;
        }
        
        if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        
        blocks[mid].classList.remove('comparing');
        await sleep(animationSpeed);
    }
    
    // Clear all highlights
    blocks.forEach(block => {
        block.classList.remove('comparing', 'search-range');
    });
    
    alert(`${target} not found in the array after ${passCount} passes`);
}

async function dfs() {
    // Create a simple graph for visualization
    const graph = {
        0: [1, 2],
        1: [3, 4],
        2: [5, 6],
        3: [],
        4: [],
        5: [],
        6: []
    };
    
    arrayContainer.style.display = 'none';
    graphContainer.style.display = 'block';
    graphContainer.innerHTML = '';
    
    // Create nodes and edges
    const nodePositions = {
        0: {x: 400, y: 50},
        1: {x: 200, y: 150},
        2: {x: 600, y: 150},
        3: {x: 100, y: 250},
        4: {x: 300, y: 250},
        5: {x: 500, y: 250},
        6: {x: 700, y: 250}
    };
    
    // Create edges
    for (const [node, neighbors] of Object.entries(graph)) {
        for (const neighbor of neighbors) {
            const edge = document.createElement('div');
            edge.className = 'edge';
            const start = nodePositions[node];
            const end = nodePositions[neighbor];
            
            const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            
            edge.style.width = `${length}px`;
            edge.style.left = `${start.x}px`;
            edge.style.top = `${start.y}px`;
            edge.style.transform = `rotate(${angle}rad)`;
            
            graphContainer.appendChild(edge);
        }
    }
    
    // Create nodes
    for (const [node, pos] of Object.entries(nodePositions)) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.textContent = node;
        nodeElement.style.left = `${pos.x - 20}px`;
        nodeElement.style.top = `${pos.y - 20}px`;
        graphContainer.appendChild(nodeElement);
    }
    
    // Perform DFS
    const visited = new Set();
    let passCount = 0;
    
    async function dfsVisit(node) {
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
        
        visited.add(node);
        const nodeElement = document.querySelector(`.node:nth-child(${parseInt(node) + 1})`);
        nodeElement.classList.add('visited');
        await sleep(animationSpeed);
        
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                await dfsVisit(neighbor);
            }
        }
    }
    
    await dfsVisit(0);
}

function createPointer() {
    const pointer = document.createElement('div');
    pointer.className = 'pointer';
    return pointer;
}

function movePointer(element) {
    const pointer = document.querySelector('.pointer') || createPointer();
    if (!document.querySelector('.pointer')) {
        arrayContainer.appendChild(pointer);
    }
    
    const rect = element.getBoundingClientRect();
    const containerRect = arrayContainer.getBoundingClientRect();
    
    pointer.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
}

async function swapElements(index1, index2) {
    const blocks = document.querySelectorAll('.array-block');
    const block1 = blocks[index1];
    const block2 = blocks[index2];
    
    // Get positions
    const pos1 = block1.getBoundingClientRect();
    const pos2 = block2.getBoundingClientRect();
    const containerRect = arrayContainer.getBoundingClientRect();
    
    // Calculate relative positions
    const x1 = pos1.left - containerRect.left;
    const x2 = pos2.left - containerRect.left;
    
    // Add moving class and set initial positions
    block1.classList.add('moving');
    block2.classList.add('moving');
    
    // Animate the movement
    block1.style.transform = `translateX(${x2 - x1}px)`;
    block2.style.transform = `translateX(${x1 - x2}px)`;
    
    // Wait for animation
    await sleep(500);
    
    // Swap the values
    [array[index1], array[index2]] = [array[index2], array[index1]];
    
    // Reset transforms and update display
    block1.style.transform = '';
    block2.style.transform = '';
    block1.classList.remove('moving');
    block2.classList.remove('moving');
    updateArrayDisplay();
} 