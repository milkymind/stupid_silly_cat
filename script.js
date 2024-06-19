// script.js

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const uploadInput = document.getElementById('uploadInput');
    const templateCarousel = document.getElementById('templateCarousel');
    const downloadButton = document.getElementById('downloadButton');
    const deleteButton = document.getElementById('deleteButton');
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
                const centerX = overlay.x + overlay.width / 2;
                const centerY = overlay.y + overlay.height / 2;
                const dx = mouseX - centerX;
                const dy = mouseY - centerY;
                overlay.rotation = Math.atan2(dy, dx);
                mouseStartX = mouseX;
                mouseStartY = mouseY;
                break;
            }
        }
    });

    // Function to handle mouse move event for resizing and rotating overlays
    canvas.addEventListener('mousemove', function(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        if (isDragging && selectedOverlay) {
            const dx = mouseX - mouseStartX;
            const dy = mouseY - mouseStartY;
            const newRotation = Math.atan2(dy, dx);
            selectedOverlay.rotation += newRotation - selectedOverlay.rotation;

            // Resize overlay based on mouse movement
            const dxScale = (mouseX - selectedOverlay.x - offsetX) / selectedOverlay.width;
            const dyScale = (mouseY - selectedOverlay.y - offsetY) / selectedOverlay.height;
            selectedOverlay.width *= dxScale;
            selectedOverlay.height *= dyScale;
            redrawCanvas();
        }
    });

    // Function to handle mouse up event to stop resizing and rotating
    canvas.addEventListener('mouseup', function() {
        isDragging = false;
        selectedOverlay = null;
    });

    // Function to check if a point is inside the boundaries of an overlay
    function isPointInsideOverlay(x, y, overlay) {
        return x >= overlay.x && x <= overlay.x + overlay.width &&
            y >= overlay.y && y <= overlay.y + overlay.height;
    }

    // Function to delete selected overlay
    function deleteSelectedOverlay() {
        if (selectedOverlay) {
            const index = overlays.indexOf(selectedOverlay);
            overlays.splice(index, 1);
            selectedOverlay = null;
            redrawCanvas();
        }
    }

    // Example: Implement a delete button for overlays
    deleteButton.addEventListener('click', function() {
        deleteSelectedOverlay();
    });

    // Function to redraw the canvas with current background and overlays
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (backgroundImage) {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        }

        overlays.forEach(function(overlay) {
            ctx.save();
            ctx.translate(overlay.x + overlay.width / 2, overlay.y + overlay.height / 2);
            ctx.rotate(overlay.rotation);
            ctx.drawImage(overlay.image, -overlay.width / 2, -overlay.height / 2, overlay.width, overlay.height);
            ctx.restore();
        });
    }

    // Function to download the modified image
    downloadButton.addEventListener('click', function() {
        if (!backgroundImage) {
            alert("Please upload an image first.");
            return;
        }

        redrawCanvas();

        // Trigger download of the final image
        const downloadLink = document.createElement('a');
        downloadLink.download = 'edited_image.png';
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.click();
    });

    // Initialize the template carousel with overlay options
    const templateImages = ['template1.png', 'template2.png', 'template3.png'];

    templateImages.forEach(function(template) {
        const img = new Image();
        img.src = template;
        img.onload = function() {
            templateCarousel.appendChild(img);
        };

        img.addEventListener('click', function() {
            addOverlayToCanvas(img.src);
        });
    });
});
