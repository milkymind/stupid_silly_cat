document.addEventListener('DOMContentLoaded', function() {
    const stage = new Konva.Stage({
        container: 'canvas',
        width: 400,
        height: 400
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    let uploadedImage;
    let templates = [];

    // Handle image upload
    document.getElementById('image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    if (uploadedImage) {
                        uploadedImage.destroy(); // Remove any previous image
                    }
                    uploadedImage = new Konva.Image({
                        image: img,
                        x: 0,
                        y: 0,
                        width: stage.width(),
                        height: stage.height()
                    });
                    layer.add(uploadedImage);
                    layer.batchDraw();
                    showDownloadButton();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Add template images from carousel
    const templateUrls = ['template1.png', 'template2.png', 'template3.png'];
    const templateCarousel = document.getElementById('template-carousel');

    templateUrls.forEach(url => {
        const templateItem = document.createElement('div');
        templateItem.classList.add('template-item');
        templateItem.setAttribute('data-src', url);
        const img = document.createElement('img');
        img.src = url;
        img.alt = url; // Set alt text as needed
        templateItem.appendChild(img);
        templateCarousel.appendChild(templateItem);
    });

    // Event listener for template items
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', function() {
            const templateSrc = item.getAttribute('data-src');
            const mousePos = stage.getPointerPosition();
            addTemplate(templateSrc, mousePos.x, mousePos.y);
        });
    });

    // Function to add template image
    function addTemplate(src, x, y) {
        const templateImg = new Image();
        templateImg.onload = function() {
            const template = new Konva.Image({
                x: x,
                y: y,
                image: templateImg,
                draggable: true,
                width: 100,
                height: 100
            });

            // Resize template from corners
            template.on('transform', function() {
                const node = template;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                node.width(node.width() * scaleX);
                node.height(node.height() * scaleY);
                node.scaleX(1);
                node.scaleY(1);
            });

            layer.add(template);
            templates.push(template);
            layer.draw();
        };
        templateImg.src = src;
    }

    // Show download button when image is uploaded and templates are added
    function showDownloadButton() {
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.style.display = 'block';
    }

    // Handle download button click
    document.getElementById('download-btn').addEventListener('click', function() {
        const dataURL = stage.toDataURL({ pixelRatio: 1, mimeType: 'image/jpeg', quality: 1 });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'silly-image.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
