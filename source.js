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

selection.addEventListener('change', function(){
    pattern = selection.value;
})

/*
container.addEventListener('click', function(){
    const audio1 = document.getElementById('audio1');
    const audioCtx = new AudioContext();
    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 128; //NUM of Bars
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    //Start drawing

    //width of bar = canvas/bars
    const barWidth = canvas.width/bufferLength;
    let barHeight;
    let x;
    
    function animate(){
        x=0;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawCircleVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    animate();
});*/

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
        switch(pattern){
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
        barHeight = dataArray[i] * 1.2;

        ctx.beginPath();
        const red = i * barHeight / 20;
        const green = i * 4;
        const blue = barHeight / 2;


        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.arc(x, canvas.height - barHeight, barHeight / 10, 0, 2 * Math.PI);
        ctx.fill();
        x += 50;

    }
}

function drawLinesVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.2;

        ctx.beginPath();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * bufferLength );

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
        ctx.arc(x/10, canvas.height-barHeight/2, x+barWidth, 0, x * Math.PI);
        x += 4;
        ctx.stroke();
        ctx.restore();
    }
}

