// script.js
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const uploadInput = document.getElementById('uploadInput');
    const templateCarousel = document.getElementById('templateCarousel');
    const downloadButton = document.getElementById('downloadButton');
    let backgroundImage = null;
    let overlays = [];

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
    function addOverlayToCanvas(overlayImage) {
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = overlayImage;
    }

    // Function to handle user interactions with overlays (resize, rotate, etc.)
    function handleOverlayManipulation() {
        // Placeholder for overlay manipulation (e.g., resizing, rotating)
        // This will depend on your specific implementation
    }

    // Function to download the modified image
    downloadButton.addEventListener('click', function() {
        if (!backgroundImage) {
            alert("Please upload an image first.");
            return;
        }

        // Combine background image and overlays on canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        overlays.forEach(function(overlay) {
            ctx.drawImage(overlay.image, overlay.x, overlay.y, overlay.width, overlay.height);
        });

        // Trigger download of the final image
        const downloadLink = document.createElement('a');
        downloadLink.download = 'edited_image.png';
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.click();
    });

    // Example: Initialize the template carousel with overlay options
    // This assumes you have predefined template images
    const templateImages = ['template1.jpg', 'template2.jpg', 'template3.jpg'];
    templateImages.forEach(function(template) {
        const img = document.createElement('img');
        img.src = template;
        img.addEventListener('click', function() {
            const overlay = {
                image: img,
                x: 50, // Example initial position (adjust as needed)
                y: 50,
                width: 100, // Example initial size (adjust as needed)
                height: 100
            };
            overlays.push(overlay);
            addOverlayToCanvas(img.src);
        });
        templateCarousel.appendChild(img);
    });
});
