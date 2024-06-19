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
            overlays.push({ image: img, x: 50, y: 50, width: 100, height: 100 }); // Initial position and size
            redrawCanvas();
        };
        img.src = overlayImageSrc;
    }

    // Function to handle mouse down event on overlays for moving
    canvas.addEventListener('mousedown', function(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // Check if clicked inside any overlay
        for (let i = overlays.length - 1; i >= 0; i--) {
            const overlay = overlays[i];
            if (mouseX >= overlay.x && mouseX <= overlay.x + overlay.width &&
                mouseY >= overlay.y && mouseY <= overlay.y + overlay.height) {
                selectedOverlay = overlay;
                isDragging = true;
                offsetX = mouseX - overlay.x;
                offsetY = mouseY - overlay.y;
                break;
            }
        }
    });

    // Function to handle mouse move event for moving overlays
    canvas.addEventListener('mousemove', function(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        if (isDragging && selectedOverlay) {
            selectedOverlay.x = mouseX - offsetX;
            selectedOverlay.y = mouseY - offsetY;
            redrawCanvas();
        }
    });

    // Function to handle mouse up event to stop moving overlays
    canvas.addEventListener('mouseup', function() {
        isDragging = false;
        selectedOverlay = null;
    });

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
            ctx.drawImage(overlay.image, overlay.x, overlay.y, overlay.width, overlay.height);
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
