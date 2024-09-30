const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const eraserBtn = document.getElementById('eraser');
const undoBtn = document.getElementById('undo');
const clearBtn = document.getElementById('clear');

// Set initial canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Drawing state and settings
let drawing = false;
let brushColor = colorPicker.value;
let lineWidth = 5;
let currentTool = 'brush'; // Options: 'brush' or 'eraser'

// Store each path for undo functionality
let paths = [];
let currentPath = [];

// Start drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('touchstart', (e) => startDrawing(e.touches[0]));

// Stop drawing
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('touchend', stopDrawing);

// Draw with mouse or touch
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', (e) => {
    if (drawing) {
        e.preventDefault();
        draw(e.touches[0]);
    }
});

function startDrawing(e) {
    drawing = true;
    currentPath = []; // Start a new path
    draw(e);
}

function stopDrawing() {
    drawing = false;
    paths.push([...currentPath]); // Save the current path for undo
    ctx.beginPath(); // Reset path
}

function draw(e) {
    if (!drawing) return;

    const x = e.clientX;
    const y = e.clientY;
    currentPath.push({ x, y, tool: currentTool, color: brushColor, size: lineWidth });

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Color picker change
colorPicker.addEventListener('change', () => {
    brushColor = colorPicker.value;
    currentTool = 'brush'; // Switch back to brush when color changes
});

// Eraser tool
eraserBtn.addEventListener('click', () => {
    currentTool = 'eraser';
    ctx.strokeStyle = '#ffffff'; // Set stroke to white for erasing
});

// Undo button
undoBtn.addEventListener('click', () => {
    paths.pop(); // Remove the last path
    redraw();    // Redraw the canvas
});

// Clear button
clearBtn.addEventListener('click', () => {
    paths = []; // Clear all paths
    redraw();   // Clear the canvas
});

// Redraw all paths (for undo and clear)
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    paths.forEach(path => {
        ctx.lineWidth = path[0].size;
        ctx.lineCap = 'round';
        path.forEach(point => {
            ctx.strokeStyle = point.tool === 'eraser' ? '#ffffff' : point.color;
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
        });
        ctx.beginPath();
    });
}

// Resize canvas when window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw(); // Redraw the canvas after resizing
});
