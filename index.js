const canvas = document.querySelector('canvas');
const context2D = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context2D.fillStyle = 'white';
context2D.fillRect(0, 0, canvas.width, canvas.height);

const mapaImage = new Image();
mapaImage.src = "./Map/Mapa-zoom-550.png";

const mapaForegroundItensImage = new Image();
mapaForegroundItensImage.src = "./Map/Mapa-Foreground-itens.png";

const playerImageUp = new Image();
playerImageUp.src = "./Tilesets/ACharUp.png";
const playerImageDown = new Image();
playerImageDown.src = "./Tilesets/ACharDown.png";
const playerImageLeft = new Image();
playerImageLeft.src = "./Tilesets/ACharLeft.png";
const playerImageRight = new Image();
playerImageRight.src = "./Tilesets/ACharRight.png";

let backgroundX = -1575;
let backgroundY = -1000;
let velocidade = 10;


const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
}


function desenhaPontosDeColisao(x, y, w, h) {
    if (checks[1].value) {
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
}


class Borda {
    size = 66; //é 66px pq o tile é 12x12 e o mapa está com zoom de 550px (5,5x maior que o original)
    constructor(xMatriz, yMatriz) {
        this.x = xMatriz * this.size + backgroundX;
        this.y = yMatriz * this.size + backgroundY;
    }

    draw() {
        context2D.fillStyle = 'rgba(255, 0, 0, 0.3)';
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

class Som {
    constructor(src, loop = false) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.setAttribute("loop", loop);
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        this.sound.play();
    }
    stop() {
        this.sound.pause();
    }
}

class Checkbox {

    tamanhoImage = 16;

    constructor(x, y, text, value = false, clickFuncion = () => { }) {
        this.image = new Image();
        this.image.src = "./assets/icons.png";

        this.text = text;
        this.x = x;
        this.y = y;
        this.value = value;
        this.height = 20;
        this.clickFuncion = clickFuncion;
    }

    click() {
        this.value = !this.value;
        this.clickFuncion(this.value);
    }

    draw() {
        let sx = this.value ? 16 : 0;
        context2D.drawImage(
            this.image,
            sx, 0,
            this.tamanhoImage, this.tamanhoImage,
            this.x, this.y,
            this.tamanhoImage, this.tamanhoImage
        );
        context2D.fillStyle = "#623436";
        context2D.font = "20px Common Pixel";
        let larguraTexto = context2D.measureText(this.text).width;
        context2D.fillText(this.text, this.x + 20, this.y + 15);
        this.width = larguraTexto + this.tamanhoImage;
    }
}

class Sprite {
    constructor(image, x, y, velocidade) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.velocidade = velocidade;
    }

    draw() {
        context2D.drawImage(this.image, this.x, this.y);
    }
}

class Jogador {

    image = playerImageDown;

    constructor() {
        this.frame = 1;
        this.counterAnimation = 0;
        this.moving = false;
    }

    /* PLOT SIMPLES */
    // context2D.drawImage(
    //     this.image,
    //     0, //x crop (dx)
    //     0, //y crop (dy)
    //     canvas.width / 2 - this.image.width / 2, // (dw)
    //     canvas.height / 2 - this.image.height / 2, // (dh)
    // );

    /* PLOT COM CUT */
    // context2D.drawImage(
    //     this.image,
    //     //cropping
    //     0, // sx (x superior esquerdo)
    //     0, // sy (y superior esquerdo)
    //     this.image.width / 2, // sw (largura corte) 
    //     this.image.height / 2, // sh (altura corte)
    //     0,  // dx (x para plot)
    //     0,  // dy (y para plot)
    //     100, // dw (largura para plot)
    //     100  // dh (altura para plot)
    // );

    draw() {

        this.size = this.image.width * 2;

        let sx = 0, sy = 0, sw = this.image.width / 2, sh = this.image.height / 2;

        if (this.moving) {
            if (this.frame == 2) {
                sx = this.image.width / 2;
                sy = 0;
            }
            else if (this.frame == 3) {
                sx = 0;
                sy = this.image.height / 2;
            }
            else if (this.frame == 4) {
                sx = this.image.width / 2;
                sy = this.image.height / 2;
            }

            if (this.counterAnimation >= 5) {
                this.frame++;
                if (this.frame > 4) this.frame = 1;
                this.counterAnimation = 0
            }
            else
                this.counterAnimation++;
        }

        let x = canvas.width / 2 - this.image.width / 2;
        let y = canvas.height / 2 - this.image.height / 2;

        context2D.drawImage(
            this.image,
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
const foregroundItens = new Sprite(mapaForegroundItensImage, backgroundX, backgroundY, velocidade);
const player = new Jogador();
const checks = [
    new Checkbox(5, 5, "BORDAS", true),
    new Checkbox(5, 25, "PONTOS DE COLISAO", true),
    new Checkbox(5, 45, "SOM", false, (value) => {
        if (value)
            somDeFundo.play();
        else
            somDeFundo.stop();
    })
];
const somDeFundo = new Som('assets/map.wav');

const movimentos = {
    cima: false,
    baixo: false,
    esquerda: false,
    direita: false
}

let frame = 1;

const atoresQueAndam = [background, ...bordas, foregroundItens];

function animate() {
    window.requestAnimationFrame(animate);

    background.draw();

    if (checks[0].value)
        bordas.forEach(item => item.draw());

    player.draw();

    foregroundItens.draw();

    checks.forEach(item => item.draw());

    let moving = true;
    player.moving = false;
    if (movimentos.cima) {
        player.moving = true;
        player.image = playerImageUp;
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
        player.moving = true;
        player.image = playerImageLeft;
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
        player.moving = true;
        player.image = playerImageDown;
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
        player.moving = true;
        player.image = playerImageRight;
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

let primeiroClick = false;
const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
const canvasTop = canvas.offsetTop + canvas.clientTop;
canvas.addEventListener('click', function (event) {
    var x = event.pageX - canvasLeft,
        y = event.pageY - canvasTop;

    checks.forEach(item => {
        if (y > item.y && y < item.y + item.height
            && x > item.x && x < item.x + item.width) {
            item.click();
        }
    });

    if (!primeiroClick) {
        checks[2].click();//check do som
        primeiroClick = true;
    }

}, false);

animate();


