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


const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
}


function desenhaPontosDeColisao(x, y, w, h) {
    let tamanhoPonto = 5;
    context2D.fillStyle = 'blue';
    context2D.fillRect(x, y, tamanhoPonto, tamanhoPonto);
    context2D.fillStyle = 'yellow';
    context2D.fillRect(x + w - tamanhoPonto, y, tamanhoPonto, tamanhoPonto);
    context2D.fillStyle = 'pink';
    context2D.fillRect(x, y + h - tamanhoPonto, tamanhoPonto, tamanhoPonto);
    context2D.fillStyle = 'purple';
    context2D.fillRect(x + w - tamanhoPonto, y + h - tamanhoPonto, tamanhoPonto, tamanhoPonto);
}


class Borda {
    size = 66; //é 66px pq o tile é 12x12 e o mapa está com zoom de 550px (5,5x maior que o original)
    constructor(xMatriz, yMatriz) {
        this.x = xMatriz * this.size + backgroundX;
        this.y = yMatriz * this.size + backgroundY;
    }

    draw() {
        context2D.fillStyle = 'rgba(255, 0, 0, 0.5)';
        context2D.fillRect(this.x, this.y, this.size, this.size);

        desenhaPontosDeColisao(this.x, this.y, this.size, this.size);
    }
}

const bordas = []
collisionsMap.forEach((row, i) => {
    row.forEach((item, j) => {
        if (item == 1025)
            bordas.push(new Borda(j, i))
    })
});


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

class Jogador {

    size = 100;  //tamanho player

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

    draw() {
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
        // sx = playerImage.width / 2;
        // sy = playerImage.height / 2;
        // sw = playerImage.width;
        // sh = playerImage.height;
        //     frame = 1;
        // }
        // else
        //     frame++

        let x = canvas.width / 2 - playerImage.width / 2;
        let y = canvas.height / 2 - playerImage.height / 2;

        context2D.drawImage(
            playerImage,
            // 0, 0, playerImage.width / 2, playerImage.height / 2, //cuting
            sx, sy, sw, sh,
            x, y,
            this.size, this.size
        );

        this.x = x + 24;
        this.y = y + 18;
        this.width = this.size - sw - 20;
        this.height = this.size - sh - 8;

        desenhaPontosDeColisao(this.x, this.y, this.width, this.height);
    }
}

const background = new Sprite(mapaImage, backgroundX, backgroundY, velocidade);
const player = new Jogador();

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

const atoresQueAndam = [background, ...bordas];

function animate() {
    window.requestAnimationFrame(animate);

    background.draw();

    bordas.forEach(borda => {
        borda.draw();
        // if (
        //     player.x + player.width >= borda.x &&
        //     player.x <= borda.x + borda.size &&
        //     player.y <= borda.y + borda.size &&
        //     player.y + player.height >= borda.y
        // ) {
        //     console.log("bateu!");
        // }
    });

    player.draw();

    let moving = true;
    if (movimentos.cima) {
        for (let i = 0; i < bordas.length; i++) {
            let borda = bordas[i];
            if (
                player.x + player.width >= borda.x &&
                player.x <= borda.x + borda.size &&
                player.y <= borda.y + borda.size + velocidade &&
                player.y + player.height >= borda.y + velocidade
            ) {
                moving = false;
                break;
            }
        }

        if (moving)
            atoresQueAndam.forEach(ator => ator.y += velocidade);
    }
    if (movimentos.esquerda) {
        for (let i = 0; i < bordas.length; i++) {
            let borda = bordas[i];
            if (
                player.x + player.width >= borda.x + velocidade &&
                player.x <= borda.x + borda.size + velocidade &&
                player.y <= borda.y + borda.size &&
                player.y + player.height >= borda.y
            ) {
                moving = false;
                break;
            }
        }

        if (moving)
            atoresQueAndam.forEach(ator => ator.x += velocidade);
    }
    if (movimentos.baixo) {
        for (let i = 0; i < bordas.length; i++) {
            let borda = bordas[i];
            if (
                player.x + player.width >= borda.x &&
                player.x <= borda.x + borda.size &&
                player.y <= borda.y + borda.size - velocidade &&
                player.y + player.height >= borda.y - velocidade
            ) {
                moving = false;
                break;
            }
        }

        if (moving)
            atoresQueAndam.forEach(ator => ator.y -= velocidade);
    }
    if (movimentos.direita) {
        for (let i = 0; i < bordas.length; i++) {
            let borda = bordas[i];
            if (
                player.x + player.width >= borda.x - velocidade &&
                player.x <= borda.x + borda.size - velocidade &&
                player.y <= borda.y + borda.size &&
                player.y + player.height >= borda.y
            ) {
                moving = false;
                break;
            }
        }

        if (moving)
            atoresQueAndam.forEach(ator => ator.x -= velocidade);
    }
}

window.addEventListener('keydown', (e) => {
    // console.log(e.key)
    // console.log(movimentos);
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
    // console.log(movimentos);
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