// script.js

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const uploadInput = document.getElementById('uploadInput');
    const templateCarousel = document.getElementById('templateCarousel');
    const downloadButton = document.getElementById('downloadButton');
    let backgroundImage = null;
    let overlays = [];
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let selectedOverlay = null;
    let offsetX = 0;
    let offsetY = 0;
    let mouseStartX = 0;
    let mouseStartY = 0;

    // Function to handle image upload
    uploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(readerEvent) {
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                backgroundImage = img;
            };
            img.src = readerEvent.target.result;
        };

        reader.readAsDataURL(file);
    });

    // Function to add overlay from carousel to canvas
    function addOverlayToCanvas(overlayImageSrc) {
        const img = new Image();
        img.onload = function() {
            const overlay = {
                image: img,
                x: canvas.width / 2 - img.width / 2, // Center overlay initially
                y: canvas.height / 2 - img.height / 2,
                width: img.width,
                height: img.height,
                rotation: 0
            };
            overlays.push(overlay);
            selectedOverlay = overlay;
            redrawCanvas();
        };
        img.src = overlayImageSrc;
    }

    // Function to handle mouse down event on overlays for resizing and rotating
    canvas.addEventListener('mousedown', function(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // Check if clicked inside any overlay
        for (let i = overlays.length - 1; i >= 0; i--) {
            const overlay = overlays[i];
            if (isPointInsideOverlay(mouseX, mouseY, overlay)) {
                selectedOverlay = overlay;
                isDragging = true;
                offsetX = mouseX - overlay.x;
                offsetY = mouseY - overlay.y;

                // Calculate rotation center point
                const centerX = overlay.x + overlay.width
