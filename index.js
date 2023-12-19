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

function checkJoyStick() {
    if (!primeiroClick) {
        checks[2].click();//check do som
        primeiroClick = true;
    }

    let x = joystick.GetX();
    let y = joystick.GetY();
    let cardinalDirection = joystick.GetDir();

    // if (x == 0 && y == 0) {
    //     movimentos.cima = false;
    //     movimentos.esquerda = false;
    //     movimentos.baixo = false;
    //     movimentos.direita = false;
    //     return;
    // }

    /* FORMA 2 DE CONTROLE */
    let velocidadeProporcionalX = (velocidade * Math.abs(x)) / 100;
    let velocidadeProporcionalY = (velocidade * Math.abs(y)) / 100;

    switch (cardinalDirection) {
        case 'C':
            movimentos.cima = false;
            movimentos.esquerda = false;
            movimentos.baixo = false;
            movimentos.direita = false;
            break;
        case 'N':
            backgroundY += velocidadeProporcionalY;
            movimentos.cima = true;
            break;
        case 'S':
            backgroundY -= velocidadeProporcionalY;
            movimentos.baixo = true;
            break;
        case 'E':
            backgroundX += velocidadeProporcionalX;
            movimentos.direita = true;
            break;
        case 'W':
            backgroundX -= velocidadeProporcionalX;
            movimentos.esquerda = true;
            break;

        case 'NW':
            backgroundY += velocidadeProporcionalY;
            backgroundX -= velocidadeProporcionalX;
            movimentos.cima = true;
            break;
        case 'NE':
            backgroundY += velocidadeProporcionalY;
            backgroundX += velocidadeProporcionalX;
            movimentos.cima = true;
            break;
        case 'SW':
            backgroundY -= velocidadeProporcionalY;
            backgroundX -= velocidadeProporcionalX;
            movimentos.baixo = true;
            break;
        case 'SE':
            backgroundY -= velocidadeProporcionalY;
            backgroundX += velocidadeProporcionalX;
            movimentos.baixo = true;
            break;
    }

    /* FORMA 1 DE CONTROLE */
    // if (y > 0) { //subindo
    //     backgroundY += velocidade;
    //     movimentos.cima = true;
    // }
    // else if (y < 0) { //descendo
    //     backgroundY -= velocidade;
    //     movimentos.baixo = true;
    // }
    // else {
    //     movimentos.cima = false;
    //     movimentos.baixo = false;
    // }

    // if (x > 0) { //direita
    //     backgroundX += velocidade;
    //     movimentos.direita = true;
    // }
    // else if (x < 0) { //esquerda
    //     backgroundX -= velocidade;
    //     movimentos.esquerda = true;
    // }
    // else {
    //     movimentos.direita = false;
    //     movimentos.esquerda = false;
    // }
}

function mobileAndTabletCheck() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

if (mobileAndTabletCheck()) {
    // const joystick = new JoyStick('joyDiv', {}, (stickData) => checkJoyStick());

    const joystick = new JoyStick('joyDiv');
    setInterval(() => checkJoyStick(), 100);
}

animate();

