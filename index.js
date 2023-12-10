const canvas = document.querySelector('canvas');
const context2D = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context2D.fillStyle = 'white';
context2D.fillRect(0, 0, canvas.width, canvas.height);

const mapaImage = new Image();
mapaImage.src = "./Map/Mapa-zoom-550.png";

const playerImage = new Image();
playerImage.src = "./Tilesets/ACharDown.png";
// playerImage.src = "./Tilesets/playerDwon.png";

let backgroundX = -1575;
let backgroundY = -1000;
let velocidade = 10;

function animate() {
    window.requestAnimationFrame(animate);
    context2D.drawImage(mapaImage, backgroundX, backgroundY);

    /* PLOT SIMPLES */
    // context2D.drawImage(
    //     playerImage,
    //     0, //x crop (dx)
    //     0, //y crop (dy)
    //     canvas.width / 2 - playerImage.width / 2, // (dw)
    //     canvas.height / 2 - playerImage.height / 2, // (dh)
    // );

    /* PLOT COM CUT */
    // context2D.drawImage(
    //     playerImage,
    //     //cropping
    //     0, // sx (x superior esquerdo)
    //     0, // sy (y superior esquerdo)
    //     playerImage.width / 2, // sw (largura corte) 
    //     playerImage.height / 2, // sh (altura corte)
    //     0,  // dx (x para plot)
    //     0,  // dy (y para plot)
    //     100, // dw (largura para plot)
    //     100  // dh (altura para plot)
    // );

    context2D.drawImage(
        playerImage,
        0, 0, playerImage.width / 2, playerImage.height / 2, //cuting
        canvas.width / 2 - playerImage.width / 2, //x
        canvas.height / 2 - playerImage.height /2, //y
        100, 100 //tamanho player
    );
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