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

class Sprite {
    constructor(image, x, y, velocidade) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.velocidade = velocidade;
    }

    draw() {
        // context2D.drawImage(this.image, backgroundX, backgroundY);
        context2D.drawImage(this.image, this.x, this.y);
    }
}

const background = new Sprite(mapaImage, backgroundX, backgroundY, velocidade);

const movimentos = {
    cima: false,
    baixo: false,
    esquerda: false,
    direita: false
    // cima: {
    //     press: false
    // },
    // baixo: {
    //     press: false
    // },
    // esquerda: {
    //     press: false
    // },
    // direita: {
    //     press: false
    // }
}

let frame = 1;

function animate() {
    window.requestAnimationFrame(animate);

    background.draw();

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

    let sx = 0, sy = 0, sw = playerImage.width / 2, sh = playerImage.height / 2;
    // if (frame == 2) {
        // sx = playerImage.width / 2;
        // sy = 0;
        // sw = playerImage.width;
        // sh = playerImage.height / 2;
        // frame++;
    // }
    // else if (frame == 3) {
        // sx = 0;
        // sy = playerImage.height / 2;
        // sw = playerImage.width / 2;
        // sh = playerImage.height;
    //     frame++;
    // }
    // else if (frame == 4) {
        sx = playerImage.width / 2;
        sy = playerImage.height / 2;
        sw = playerImage.width;
        sh = playerImage.height;
    //     frame = 1;
    // }
    // else
    //     frame++

    context2D.drawImage(
        playerImage,
        // 0, 0, playerImage.width / 2, playerImage.height / 2, //cuting
        sx, sy, sw, sh,
        canvas.width / 2 - playerImage.width / 2, //x
        canvas.height / 2 - playerImage.height / 2, //y
        100, 100 //tamanho player
    );

    if (movimentos.cima) {
        background.y += velocidade;
    }
    if (movimentos.esquerda) {
        background.x += velocidade;
    }
    if (movimentos.baixo) {
        background.y -= velocidade;
    }
    if (movimentos.direita) {
        background.x -= velocidade;
    }
    // if (movimentos.cima.press) {
    //     background.y += velocidade;
    // }
    // if (movimentos.esquerda.press) {
    //     background.x += velocidade;
    // }
    // if (movimentos.baixo.press) {
    //     background.y -= velocidade;
    // }
    // if (movimentos.direita.press) {
    //     background.x -= velocidade;
    // }

    // background.draw();

}

window.addEventListener('keydown', (e) => {
    // console.log(e.key)
    console.log(movimentos);
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            backgroundY += velocidade;
            movimentos.cima = true;
            break;
        case 'a':
        case 'ArrowLeft':
            backgroundX += velocidade;
            movimentos.esquerda = true;
            break;
        case 's':
        case 'ArrowDown':
            backgroundY -= velocidade;
            movimentos.baixo = true;
            break;
        case 'd':
        case 'ArrowRight':
            backgroundX -= velocidade;
            movimentos.direita = true;
            break;
    }
})

window.addEventListener('keyup', (e) => {
    console.log(movimentos);
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            movimentos.cima = false;
            break;
        case 'a':
        case 'ArrowLeft':
            movimentos.esquerda = false;
            break;
        case 's':
        case 'ArrowDown':
            movimentos.baixo = false;
            break;
        case 'd':
        case 'ArrowRight':
            movimentos.direita = false;
            break;
    }
})

animate();