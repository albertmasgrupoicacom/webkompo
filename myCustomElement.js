import * as lena from 'lena.js/dist/index.js';

function addDragFunctionality(container, canvas) {
    let isDragging = false;
    let startX, startY, startScrollLeft, startScrollTop;

    const startDragging = (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startScrollLeft = container.scrollLeft;
        startScrollTop = container.scrollTop;
        container.style.cursor = 'grabbing';
    };

    const stopDragging = () => {
        isDragging = false;
        container.style.cursor = 'grab';
    };

    const drag = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        container.scrollLeft = startScrollLeft - deltaX;
        container.scrollTop = startScrollTop - deltaY;
    };

    container.addEventListener('mousedown', startDragging);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('mousemove', drag);
}
class MyCustomElement extends HTMLElement {    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.imageUrl = this.getAttribute('image-url');
    
        const container = document.createElement('div');
        container.style.width = '400px'; 
        container.style.height = '400px'; 
        container.style.overflow = 'hidden'; 
        container.style.cursor = 'grab'; 
        this.shadowRoot.appendChild(container);
    
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
    
        let canvasWidth, canvasHeight, imageWidth, imageHeight;
    
        const img = new Image();
        img.onload = () => {
            imageWidth = img.width;
            imageHeight = img.height;
            canvasWidth = img.width;
            canvasHeight = img.height;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
        };
        img.src = this.imageUrl;
    
        // invert
        const invertButton = document.createElement('button');
        invertButton.textContent = 'Invertir';
        invertButton.addEventListener('click', () => {
            const imageData = lena.getImage(canvas);
            const invertedImageData = lena.invert(imageData);
            lena.printCanvas(canvas, invertedImageData);
        });
        this.shadowRoot.appendChild(invertButton);
    
        // zoom in
        const zoomInButton = document.createElement('button');
        zoomInButton.textContent = 'Zoom In';
        zoomInButton.addEventListener('click', () => {
            const currentScale = canvasWidth / imageWidth;
            const newScale = Math.min(currentScale + 0.1, 2); // Limita el zoom a 1 
            canvasWidth = newScale * imageWidth; 
            canvasHeight = newScale * imageHeight; 
            canvas.style.width = `${canvasWidth}px`; 
            canvas.style.height = `${canvasHeight}px`; 
        });
        this.shadowRoot.appendChild(zoomInButton);
    
        // zoom out
        const zoomOutButton = document.createElement('button');
        zoomOutButton.textContent = 'Zoom Out';
        zoomOutButton.addEventListener('click', () => {
            const currentScale = canvasWidth / imageWidth; 
            const newScale = Math.max(currentScale - 0.1, 0.1); 
            canvasWidth = newScale * imageWidth; 
            canvasHeight = newScale * imageHeight; 
            canvas.style.width = `${canvasWidth}px`; 
            canvas.style.height = `${canvasHeight}px`; 
        });
        this.shadowRoot.appendChild(zoomOutButton);
        addDragFunctionality(container, canvas);
    }
    

    connectedCallback() {
        // Codi per a quan el component està connectat al DOM
    }

    disconnectedCallback() {
        // Codi per a quan el component està desconnectat del DOM
    }
}

customElements.define('my-custom-element', MyCustomElement);

