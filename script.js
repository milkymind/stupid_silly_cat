body {
    font-family: Arial, sans-serif;
    background-color: #2e2e2e;
    color: #f1f1f1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
}

h1 {
    margin-bottom: 20px;
}

#guide {
    margin-bottom: 20px;
    text-align: center;
}

#canvas-container {
    position: relative;
    width: 400px;
    height: 400px;
    background-color: #ffffff;
    border: 1px solid #ccc;
}

#canvas-wrapper {
    width: 100%;
    height: 100%;
}

canvas {
    cursor: pointer;
}

#template-carousel {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.template-item {
    margin: 0 10px;
    cursor: pointer;
}

.template-item img {
    width: 50px;
    height: 50px;
    cursor: pointer;
}

#download-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    display: none;
}

#download-btn:hover {
    background-color: #45a049;
}

.hidden {
    display: none;
}
