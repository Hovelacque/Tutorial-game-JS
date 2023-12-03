const canvas = document.querySelector('canvas');
const context2D = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context2D.fillStyle = 'white';
context2D.fillRect(0, 0, canvas.width, canvas.height);

const mapaImage = new Image();
mapaImage.src = "./Map/Mapa-zoom-550.png";

let backgroundX = -1800;
let backgroundY = -1000;
let velocidade = 5;

function animate() {
    window.requestAnimationFrame(animate);
    context2D.drawImage(mapaImage, backgroundX, backgroundY);
}

window.addEventListener('keydown', (e) => {
    // console.log(e.key)
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            backgroundY += velocidade;
            break;
        case 'a':
        case 'ArrowLeft':
            backgroundX += velocidade;
            break;
        case 's':
        case 'ArrowDown':
            backgroundY -= velocidade;
            break;
        case 'd':
        case 'ArrowRight':
            backgroundX -= velocidade;
            break;
    }
})

animate();