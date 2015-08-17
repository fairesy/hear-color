/*-----------------------------------------------------------------------------------
> Overall
    [Input] HTMLAudioElement
    [Output] AudioHelper : HTML5 audio api helper. 
-----------------------------------------------------------------------------------*/
(function(){
    function AudioHelper(audio){
        this.audio = audio;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.duration = {
            original : 0,
            min : 0,
            sec : 0
        };
        this.currentTime = {
            original : 0,
            min : 0,
            sec : 0
        };
        /*
        옵션?
        */
    }
    
    AudioHelper.prototype.init = function(placeToPutAudio){
        this.helperBase = placeToPutAudio;
        placeToPutAudio.appendChild(this.audio);
        this.audio.addEventListener("canplaythrough", this.loaded.bind(this), false);
    };
    
    AudioHelper.prototype.loaded = function(){
        this.source = this.audioContext.createMediaElementSource(this.audio);
        this.analyser = this.audioContext.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

//        setInterval(function(){
//            console.log(this.getFrequencyDataBetween(0,100));
//        }.bind(this), 1000);
    };
    
    /*-----------------------------------------------------------------------------------
    > Custom Player helper (with audio tag)
    -----------------------------------------------------------------------------------*/
    AudioHelper.prototype.createPlayButton = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "playButton");
        var img = document.createElement("img");
        img.setAttribute("src", "assets/image/playButton.png");
        button.appendChild(img);
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.play();
            }.bind(this));
        }.bind(this));
    };

    AudioHelper.prototype.createPauseButton = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "pauseButton");
        var img = document.createElement("img");
        img.setAttribute("src", "assets/image/pauseButton.png");
        button.appendChild(img);
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.pause();
            }.bind(this));
        }.bind(this));
    };
    
    AudioHelper.prototype.createStopButton = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "stopButton");
        var img = document.createElement("img");
        img.setAttribute("src", "assets/image/stopButton.png");
        button.appendChild(img);
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.pause();
                this.audio.currentTime = 0;
            }.bind(this));
        }.bind(this));
    };

    AudioHelper.prototype.createLoopToggle = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "loopButton");
        button.textContent = "loop";
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.loop = this.audio.loop ? false : true;
            }.bind(this));
        }.bind(this));
    };
    
    AudioHelper.prototype.createMuteToggle = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "muteButton");
        button.textContent = "mute";
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.muted = this.audio.muted ? false : true;
            }.bind(this));
        }.bind(this));
    };
    
    AudioHelper.prototype.createVolumeDownButton = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "volumeDown");
        button.textContent = "volume DOWN";
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.volume = (this.audio.volume <= 0) ? 0 : (this.audio.volume-0.1).toFixed(1);
            }.bind(this));
        }.bind(this));
    };

    AudioHelper.prototype.createVolumeUpButton = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "volumeUp");
        button.textContent = "voume UP"
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.volume = (this.audio.volume >= 1) ? 1 : (this.audio.volume+0.1).toFixed(1);
            }.bind(this));
        }.bind(this));
    };
    
    AudioHelper.prototype.makesVolumeSliderWith = function(element){
        
    };
    
    AudioHelper.prototype.makesProgressBarWith = function(element){
    
    };
    
    AudioHelper.prototype.showNowPlayingOn = function(element){
        var nowPlaying = document.createElement("span");
        nowPlaying.setAttribute("id", "nowPlaying");
        this.helperBase.appendChild(nowPlaying);
        
        this.audio.addEventListener("canplaythrough", function(){
            
            //재생중인 파일 이름 가지고 오기 
            var fullSrc = this.audio.currentSrc;
            var tempArr = fullSrc.split("/");
            var nowPlayingName = tempArr[tempArr.length-1];
            
            //총 재생시간 가지고 오기
            this.getDuration();
            
            //현재 재생 시간 가지고 오기 
            setInterval(function(){
                this.getCurrentTime();
                //output 형식은 이후 수정.
                nowPlaying.textContent = nowPlayingName + ">>>" + this.currentTime.min+":"+this.currentTime.sec+"  "+ this.duration.min + ":" + this.duration.sec;
            }.bind(this),1000);
            
            
        }.bind(this));
        
    };
    
    AudioHelper.prototype.getDuration = function(){
        this.duration.original = Math.round(this.audio.duration);
        this.duration.min = parseInt(this.duration.original/60);
        this.duration.sec = this.duration.original - this.duration.min*60;
        this.duration.sec = (this.duration.sec < 10) ? "0"+this.duration.sec : this.duration.sec;
    };

    AudioHelper.prototype.getCurrentTime = function(){
        this.currentTime.original = Math.round(this.audio.currentTime);
        this.currentTime.min = parseInt(this.currentTime.original/60);
        this.currentTime.sec = this.currentTime.original - this.currentTime.min*60;
        this.currentTime.sec = (this.currentTime.sec<10) ? "0"+this.currentTime.sec : this.currentTime.sec;
    };
    
    /*—————————————————————————————————————————
    > Audio Data helper (with Audio API)
    —————————————————————————————————————————*/
    //getFrequencyDataBetweenBetween(0,100);
    AudioHelper.prototype.getFrequencyDataBetween = function(from, to){
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray.subarray(from,to);
    };
    
    /*-----------------------------------------------------------------------------------
    > Visualizer helper
    -----------------------------------------------------------------------------------*/
    AudioHelper.prototype.createBarVisualizer = function(){
        this.canvas = this.createCanvas();
        this.visualizerCtx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        
        this.audio.addEventListener("canplaythrough", function(){
            this.drawBarVisualizer();
        }.bind(this));
    };
    
    AudioHelper.prototype.createCanvas = function(){
        var canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 500;
        return canvas;
    };
    
    AudioHelper.prototype.drawBarVisualizer = function(){
        requestAnimationFrame(this.drawBarVisualizer.bind(this));
        //[TODO] drawVisualizer를 주파수 영역 지정해서 여러개 돌아갈 수 있게 수정.

        var targetArray = this.getFrequencyDataBetween(0,100);
//        console.log(targetArray);

        this.visualizerCtx.fillStyle = "#303030";
        this.visualizerCtx.fillRect = (0, 0, this.canvas.width, this.canvas.height);
        //150817 ???왜 오류가 없는데 안보이지 캔버스???

        var barWidth = (this.canvas.width / targetArray.length) * 2.5; //매직넘버어어
        var barHeight;
        var x = 0;

        for (var i = 0; i < targetArray.length; i++) {	
            barHeight = targetArray[i] * 1.8;
            this.visualizerCtx.fillStyle = "#909090";
            this.visualizerCtx.fillRect= (x, this.canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
        
    };

    /*-----------------------------------------------------------------------------------
    > Debug helper
    -----------------------------------------------------------------------------------*/
//    AudioHelper.prototype.drawDefaultDebug = function(ms){
//        setInterval(function(){
//            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//            console.log("duration : " + this.audio.duration);
//            console.log("current time : " + this.audio.currentTime);
//            console.log("loop : " + this.audio.loop);
//            console.log("autoplay : " + this.audio.autoplay);
//            console.log("controls : " + this.audio.controls);
//            console.log("volume : " + this.audio.volume);
//            console.log("muted : " + this.audio.muted);
//            console.log("paused : " + this.audio.paused);
//            console.log("ended : " + this.audio.ended);
//            console.log("source : " + this.audio.currentSrc);
//        }, ms);  
//    };
//    
//    AudioHelper.prototype.drawDataDebug = function(ms){
//        setInterval(function(){
//        
//        }, ms)
//    };
    
    window.AudioHelper = AudioHelper;
}());