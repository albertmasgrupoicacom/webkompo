import * as lena from 'lena.js/dist/index.js';
import 'dragscroll';

class MyCustomElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.imageUrl = this.getAttribute('image-url');
        // Crea l'element canvas
        const canvas = document.createElement('canvas');
        canvas.classList.add('dragscroll');
        this.shadowRoot.appendChild(canvas);
        
        // Obté les dades de la imatge
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
        };
        img.src = this.imageUrl;
    
        // Crea el botó
        const button = document.createElement('button');
        button.textContent = 'Invertir';
        button.addEventListener('click', () => {
            // Obté les dades de píxels de la imatge
            const imageData = lena.getImage(canvas);
            // Inverteix les dades de píxels
            const invertedImageData = lena.invert(imageData);
            // Actualitza l'element canvas amb les dades invertides
            lena.printCanvas(canvas, invertedImageData);
        });
        this.shadowRoot.appendChild(button);

        // const zoomInButton = document.createElement('button');
        // zoomInButton.textContent = 'Zoom In';
        // zoomInButton.addEventListener('click', () => {
        //     const currentTransform = getComputedStyle(canvas).transform;
        //     const currentScale = currentTransform === 'none' ? 1 : parseFloat(currentTransform.split('(')[1]);
        //     const scale = currentScale + 0.1;
        //     canvas.style.transform = `scale(${scale})`;
        // });
        // this.shadowRoot.appendChild(zoomInButton);
        const zoomInButton = document.createElement('button');
        zoomInButton.textContent = 'Zoom In';
        zoomInButton.addEventListener('click', () => {
            const currentTransform = getComputedStyle(canvas).transform;
            const currentScale = currentTransform === 'none' ? 1 : parseFloat(currentTransform.split('(')[1]);
            const scale = Math.min(currentScale + 0.1, 1.3); // Limita el zoom a 2 vegades la mida original
            canvas.style.transform = `scale(${scale})`;
        });
        this.shadowRoot.appendChild(zoomInButton);

        const zoomOutButton = document.createElement('button');
        zoomOutButton.textContent = 'Zoom Out';
        zoomOutButton.addEventListener('click', () => {
            const currentTransform = getComputedStyle(canvas).transform;
            const currentScale = currentTransform === 'none' ? 1 : parseFloat(currentTransform.split('(')[1]);
            const scale = Math.max(currentScale - 0.1, 0.1); // Assegura que la escala no sigui menor que 0.1
            canvas.style.transform = `scale(${scale})`;
        });
        this.shadowRoot.appendChild(zoomOutButton);

    }
    
    

    connectedCallback() {
        // Codi per a quan el component està connectat al DOM
    }

    disconnectedCallback() {
        // Codi per a quan el component està desconnectat del DOM
    }
}

customElements.define('my-custom-element', MyCustomElement);

