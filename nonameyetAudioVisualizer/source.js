const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileupload');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;
const selection = document.getElementById('pattern-select');
let pattern = 'standard';
let effect=null;

selection.addEventListener('change', function () {
    pattern = selection.value;
})

file.addEventListener('change', function () {
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    const audioCtx = new AudioContext();
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();

    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256; //NUM of Bars
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        switch (pattern) {
            case 'standard':
                drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
                requestAnimationFrame(animate);
                break;
            case 'circular':
                drawSpiralVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
                requestAnimationFrame(animate);
                break;
            case 'cirlces':
                drawCirclesVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
                requestAnimationFrame(animate);
                break;
            case 'lines':
                drawLinesVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
                requestAnimationFrame(animate);
                break;
            case 'spiral':
                drawCurvesVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
                requestAnimationFrame(animate);
                break;
            case 'angular':
                drawAngularVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
                requestAnimationFrame(animate);
                break;
            case 'trippy':
                drawTrippyVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
                requestAnimationFrame(animate);
                break;
            case 'optical':
                drawOpticalVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
                requestAnimationFrame(animate);
                break;
            case 'guitar':
                guitarVisualiser(bufferLength, dataArray);
                requestAnimationFrame(animate);
                break;
            case 'flowfield':
                drawFlowFieldVisualiser(bufferLength, dataArray);
                animateFlowField();
                break;
        }
    }
    animate();
})

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        const red = i * barHeight / 20;
        const green = i * 4;
        const blue = barHeight / 2;

        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}

function drawSpiralVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.2;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * bufferLength / 1.2);

        const red = i * barHeight / 20;
        const green = i * 4;
        const blue = barHeight / 2;
        ctx.imageSmoothingEnabled = true;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        ctx.restore();
    }
}

function drawCirclesVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.4;

        ctx.beginPath();
        const red = i * barHeight / 20;
        const green = i * 4;
        const blue = barHeight / 2;


        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.arc(x, canvas.height - barHeight, barHeight / 10, 0, 2 * Math.PI);
        ctx.arc(x, canvas.height - barHeight - 90, barHeight / 10, 0, 2 * Math.PI);
        ctx.arc(x, canvas.height - barHeight - 180, barHeight / 10, 0, 2 * Math.PI);
        ctx.arc(x, canvas.height - barHeight - 270, barHeight / 10, 0, 2 * Math.PI);
        ctx.arc(x, canvas.height - barHeight + 90, barHeight / 10, 0, 2 * Math.PI);
        ctx.arc(x, canvas.height - barHeight + 180, barHeight / 10, 0, 2 * Math.PI);
        ctx.arc(x, canvas.height - barHeight + 270, barHeight / 10, 0, 2 * Math.PI);
        ctx.fill();
        x += 70;

    }
}

function drawLinesVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.2;

        ctx.beginPath();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * bufferLength);

        const red = i * barHeight / 14;
        const green = i * 2;
        const blue = barHeight / 2;
        ctx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.shadowColor = "red";
        ctx.shadowBlur = 15;
        ctx.moveTo(x, canvas.height - barHeight);
        ctx.lineTo(x + barWidth, barHeight);
        x += 1;
        ctx.stroke();
        ctx.restore();
    }
}

function drawCurvesVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        ctx.beginPath();

        ctx.save();
        ctx.translate(canvas.width / 2.7, canvas.height / 2.5);
        ctx.rotate(i * bufferLength);

        const red = i * barHeight / 14;
        const green = i * 2;
        const blue = barHeight / 2;
        ctx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.shadowColor = "red";
        ctx.shadowBlur = 15;
        ctx.arc(x / 10, canvas.height - barHeight / 2, x + barWidth, 0, x * Math.PI);
        x += 4;
        ctx.stroke();
        ctx.restore();
    }
}

function drawAngularVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {

        barHeight = dataArray[i];
        var angle = dataArray[i] / 400 * Math.PI * 2;

        ctx.beginPath();

        const red = i * barHeight / 20;
        const green = i * 4;
        const blue = barHeight / 2;

        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.arc(x, canvas.height / 2, 30, 0, angle);
        ctx.fill();
        x += 100;
    }
}

function drawTrippyVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.2;

        ctx.beginPath();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * bufferLength);

        const red = Math.sin(i * barHeight / 10) * 255;
        const green = Math.cos(i * barHeight / 5) * 255;
        const blue = Math.tan(i * barHeight / 7) * 255;
        ctx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.shadowColor = "blue";
        ctx.shadowBlur = 10;
        ctx.moveTo(x, canvas.height - barHeight);
        ctx.lineTo(x + barWidth, barHeight);
        x += 1;
        ctx.stroke();
        ctx.restore();
    }
}

function drawOpticalVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
    const centerY = canvas.height / 2;
    const maxAmplitude = canvas.height / 2;
    const angleIncrement = (Math.PI * 2) / bufferLength;
    const radiusMultiplier = 0.8;

    ctx.lineWidth = barWidth;

    for (let i = 0; i < bufferLength; i++) {
        const amplitude = dataArray[i] * maxAmplitude;
        const angle = i * angleIncrement;
        const radius = radiusMultiplier * amplitude;

        const xPos = x + Math.cos(angle) * radius;
        const yPos = centerY + Math.sin(angle) * radius;

        const hue = (i / bufferLength) * 360;
        const saturation = 100;
        const lightness = 50 - (amplitude * 0.4);

        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        ctx.beginPath();
        ctx.moveTo(x, centerY);
        ctx.lineTo(xPos, yPos);
        ctx.stroke();

        x += barWidth;
    }
}

function guitarVisualiser(bufferLength, dataArray) {
    yTop = canvas.height * 0.6;
    yBot = canvas.height * 0.3;

    let strings = [];
    let bars = [];

    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, yTop);
    ctx.lineTo(canvas.width, yTop);
    ctx.moveTo(0, yBot);
    ctx.lineTo(canvas.width, yBot);

    barWidth = canvas.width / 23;
    let o = 0;
    while (o < canvas.width) {
        ctx.moveTo(o, yTop);
        ctx.lineTo(o, yBot);
        bars.push(o);
        o += barWidth;
    }
    ctx.stroke();

    ctx.beginPath();

    ctx.strokeStyle = 'rgb(153, 153, 153)';
    ctx.lineWidth = 3;
    let guitarHeight = (yTop - yBot);
    let stringDistance = guitarHeight / 7;
    let string = yBot + stringDistance;
    while (string < yTop) {
        if (Math.floor(string) != Math.floor(yTop)) {
            ctx.moveTo(0, string);
            ctx.lineTo(canvas.width, string);
            strings.push(string);
        }
        string += stringDistance;
    }
    ctx.stroke();

    for (let i = 0; i < bufferLength; i++) {
        let alpha = 1;
        const fadeSpeed = 0.005;

        while (alpha > 0) {
            ctx.globalAlpha = alpha;

            const red = Math.floor(dataArray[i] / bufferLength * 255);
            const green = 0;
            const blue = Math.floor((bufferLength - i) / bufferLength * 255);

            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.beginPath();
            x = bars[Math.floor(Math.random() * bars.length)];
            y = strings[Math.floor(Math.random() * strings.length)];
            if (dataArray[i] > 150 && Math.random() < 0.005) {
                ctx.arc(x, y, dataArray[i] / 10, 0, 2 * Math.PI);
            }
            ctx.fill();

            alpha -= fadeSpeed;

            if (alpha <= 0) {
                ctx.globalAlpha = 1;
                break;
            }
        }
    }
}
class Particle {
    constructor(Effect, bufferLength, dataArray) {
        this.Effect = Effect;
        this.bufferLength = bufferLength;
        this.dataArray = dataArray;
        this.x = Math.floor(Math.random() * this.Effect.width);
        this.y = Math.floor(Math.random() * this.Effect.height);
        this.speedX;
        this.speedY;
        //this.speedModifier = Math.random() * this.dataArray[Math.floor(Math.random()*this.dataArray.length)];
        this.speedModifier = 1.2;
        this.history = [{ x: this.x, y: this.y }];
        this.maxLength = Math.floor(Math.random() * 500 + 10);
        this.angle = 0;
        this.timer = this.maxLength*2;
    }
    draw(context) {
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y);
        }
        context.stroke();
    }
    update() {
        this.timer--;
        if(this.timer >= 1){
            let x = Math.floor(this.x / this.Effect.cellSize);
            let y = Math.floor(this.y / this.Effect.cellSize);
            let index = y * this.Effect.cols + x;
            this.angle = this.Effect.flowField[index];

            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);
            this.x += this.speedX*this.speedModifier;
            this.y += this.speedY*this.speedModifier;

            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > this.maxLength) {
                this.history.shift();
            }
        }else if(this.history.length>1){  
            this.history.shift();
        } else {
            this.reset(); 
        }
    }
    reset(){
        this.x = Math.floor(Math.random() * this.Effect.width);
        this.y = Math.floor(Math.random() * this.Effect.height);
        this.history = [{ x: this.x, y: this.y }];
        this.timer = this.maxLength * 2;
    }
}

class Effect {
    constructor(width, height, numberOfParticles, bufferLength, dataArray) {
        this.bufferLength = bufferLength;
        this.dataArray = dataArray;
        this.width = width;
        this.height = height;
        this.particles = [];
        this.numberOfParticles = numberOfParticles;
        this.cellSize = 20;
        this.rows;
        this.cols;
        this.flowField = [];
        this.curve = 2.2;
        this.zoom = 0.11;
        this.bufferLength;
        this.dataArray;
        this.init();
    }
    init() {
        //Create flow field
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
        this.flowField = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
                this.flowField.push(angle);
            }
        }

        //Create particles
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this, this.bufferLength, this.dataArray));
        }
    }
    render(context) {
        this.particles.forEach(Particle => {
            Particle.draw(context);
            Particle.update();
        })
    }
}

 
function drawFlowFieldVisualiser(bufferLength, dataArray) {
    console.log(dataArray);
    console.log(this.bufferLength);
    effect = new Effect(canvas.width, canvas.height, 2000, bufferLength, dataArray);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    const red = Math.floor(dataArray[0] / bufferLength * 255);
    const green = 0;
    const blue = Math.floor((bufferLength ) / bufferLength * 255);

    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    //ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
    effect.bufferLength = bufferLength;
    effect.dataArray = dataArray;
}

function animateFlowField() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animateFlowField);
}