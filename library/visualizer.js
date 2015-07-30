//우오오오 꼬인다아아아

function Visualizer(audioInput){
    this.audio = audioInput;
    this.option = {
        type : bar,
        color_bg : "rgb(240,240,240)",
        color_visualizer : "rgb()",
        //canvas size값 위치 - 옵션? 프로토타입함수의 매개변수?
        width : 600,
        height : 400
    };
}

Visualizer.prototype.execute = function(){
    this.createCanvas(this.option.width, this.option.height);
    
    //"type === bar"
    this.audioToData(this.drawBarVisualizer);
};

Visualizer.prototype.audioToData = function(callback){
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    
    //**'load'완료 이후(실행시점 체크)
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    
    this.analyser.fftSize = 256;
	// var bufferLength = analyser.frequencyBinCount;
	this.bufferLength = 128;
	this.dataArray = new Uint8Array(this.bufferLength);
    
    callback();
};

Visualizer.prototype.createCanvas = function(_width, _height){ 
	var canvas = document.createElement("canvas");
	canvas.width = _width;
	canvas.height = _height;
	this.canvasCtx = canvas.getContext("2d");
    
    //canvas append 위치 지정 
	document.body.appendChild(canvas);
};

Visualizer.prototype.drawBarVisualizer = function(){
    
    draw = requestAnimationFrame(this.drawVisualizer);

    this.analyser.getByteFrequencyData(this.dataArray);
    
    this.canvasCtx.fillStyle = this.option.color_bg;
    this.canvasCtx.fillRect(0,0, this.option.width, this.option.height);

    var barWidth = (this.option.width / this.bufferLength) * 2.5; //매직넘버어어
    var barHeight;
    var x = 0;

    for (var i = 0; i < this.bufferLength; i++) {	
        barHeight = this.dataArray[i] * 1.8;
        this.canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',170,170)';
        this.canvasCtx.fillRect(x, this.option.height - barHeight/2, barWidth, barHeight);

        x += barWidth + 1;
    }
};