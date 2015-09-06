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
        //testing time domain data @150820 
        this.timeArray = new Uint8Array(this.bufferLength);
        
        //collecting data to figure whole shape of music @150520
        this.collectionArray = new Array(this.bufferLength);
        for(var i=0;i<this.collectionArray.length;i++){
            this.collectionArray[i] = 0;
        }
        
        this.timeCollectionArray = new Array(this.bufferLength);
        for(var i=0;i<this.timeCollectionArray.length;i++){
            this.timeCollectionArray[i] = 0;
        }
    };
    
    /*-----------------------------------------------------------------------------------
    > Custom Player helper (with audio tag)
    -----------------------------------------------------------------------------------*/
    AudioHelper.prototype.createPlayButton = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "playButton");
        button.textContent = "play";
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                
                //배속 기능 테스트 @150906
                this.audio.playbackRate = 3.0;
                
                this.audio.play();
            }.bind(this));
        }.bind(this));
        
        return this;
    };

    AudioHelper.prototype.createPauseButton = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "pauseButton");
        button.textContent = "pause";
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.pause();
            }.bind(this));
        }.bind(this));

        return this;
    };
    
    AudioHelper.prototype.createStopButton = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "stopButton");
        button.textContent = "stop";
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.pause();
                this.audio.currentTime = 0;
            }.bind(this));
        }.bind(this));
        
        return this;
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
        
        return this;
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
        
        return this;
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
        
        return this;
    };

    AudioHelper.prototype.createVolumeUpButton = function(){
        var button = document.createElement("button");
        button.setAttribute("id", "volumeUp");
        button.textContent = "volume UP"
        
        this.audio.addEventListener("canplaythrough", function(){
            this.helperBase.appendChild(button);
            button.addEventListener("click", function(){
                this.audio.volume = (this.audio.volume >= 1) ? 1 : (this.audio.volume+0.1).toFixed(1);
            }.bind(this));
        }.bind(this));
        
        return this;
    };
    
    AudioHelper.prototype.createVolumeSlider = function(element){
        
    };
    
    AudioHelper.prototype.createProgressBar = function(element){
    
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
        
        return this;
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
    AudioHelper.prototype.getFrequencyDataBetween = function(from, to){
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray.subarray(from, to);
    };
    
    AudioHelper.prototype.getTimeDomainData = function(){
        this.analyser.getByteTimeDomainData(this.timeArray);
        return this.timeArray;
    };
    AudioHelper.prototype.getTimeDomainDataBetween = function(from, to){
        this.analyser.getByteTimeDomainData(this.timeArray);
        return this.timeArray.subarray(from, to);
    };
    
    var compNumberReverse = function (a, b) {
        return b - a;
    }
    var HSVtoRGB = function (h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;

        // Make sure our arguments stay in-range
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));

        // We accept saturation and value arguments from 0 to 100 because that's
        // how Photoshop represents those values. Internally, however, the
        // saturation and value are calculated from a range of 0 to 1. We make
        // That conversion here.
        s /= 100;
        v /= 100;

        if(s == 0) {
            // Achromatic (grey)
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch(i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;

            case 1:
                r = q;
                g = v;
                b = p;
                break;

            case 2:
                r = p;
                g = v;
                b = t;
                break;

            case 3:
                r = p;
                g = q;
                b = v;
                break;

            case 4:
                r = t;
                g = p;
                b = v;
                break;

            default: // case 5:
                r = v;
                g = p;
                b = q;
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    
    var getRGB = function(index, saturation){
        var frequencyMin = 180;
        var frequencyMax = 500;
        var hueRange = 280;

        var ratio = (index-frequencyMin) / (frequencyMax-frequencyMin);
        var hueConstant = hueRange*ratio;
        var actualHue = hueRange-hueConstant;
        console.log("actual hue : " + actualHue);
        var rgb = HSVtoRGB(actualHue,Math.round(saturation),100);
        
        return "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
    }

    AudioHelper.prototype.collectFrequencyData = function(){
        
        var collectingFrequency;
        var collectCount = 0;
        
        this.audio.addEventListener("ended",function(){
            console.log("collected frequency data for " + collectCount +"times");
            console.log(this.collectionArray);
            
            clearInterval(collectingFrequency);
            
            var canvas = this.createCanvasInSize(1000,500);
            var visualizerCtx = canvas.getContext("2d");
            document.body.appendChild(canvas);
            
            var barWidth = (canvas.width / this.collectionArray.length) * 0.2;
            var barHeight;
            var x=0;
            for(var i=0; i<this.collectionArray.length ;i++){
                barHeight = this.collectionArray[i]/collectCount *2;
                
//                if(i===162 || i===163 || i===194 || i===161 || i===173){
//                    visualizerCtx.fillStyle = "rgb(255,64,64)";
//                }else if(i>=150 && i<=500){
                    visualizerCtx.fillStyle = "rgb(72,175,180)";
//                }else{
//                    visualizerCtx.fillStyle = "rgb(255,255,255)";
//                }
//                
                visualizerCtx.font = "5px Arial";
                visualizerCtx.fillText(this.collectionArray[i]/200, x, canvas.height - barHeight/2 - 15);

                visualizerCtx.fillRect(x, canvas.height - barHeight/2, barWidth, barHeight);
                x += barWidth + 1;
            }
            
            //frequency 150부터 가장 큰 값 5개 구하기 - 평균 - HSV모델의 H값으로 맵핑 @150906
            //frequency range : 150~500
            //Hue range : 0~280
            var sorted = this.collectionArray.slice(150, this.collectionArray.length).sort(compNumberReverse);
            var top1 = sorted[0];
            var top1Id = this.collectionArray.indexOf(top1);
            var top2 = sorted[1];
            var top2Id = this.collectionArray.indexOf(top2);
            var top3 = sorted[20];
            var top3Id = this.collectionArray.indexOf(top3);
            var top4 = sorted[40];
            var top4Id = this.collectionArray.indexOf(top4);
            var top5 = sorted[50];
            var top5Id = this.collectionArray.indexOf(top5);
            
            var test1 = sorted[51];
            var test1Id = this.collectionArray.indexOf(test1);
            var test1Value = this.collectionArray[test1Id]/collectCount;
            var test1S = (test1Value/255)*100;
            
            var test2 = sorted[52];
            var test2Id = this.collectionArray.indexOf(test2);
            var test2Value = this.collectionArray[test2Id]/collectCount;
            var test2S = (test2Value/255)*100;
            
            var test3 = sorted[53];
            var test3Id = this.collectionArray.indexOf(test3);
            var test3Value = this.collectionArray[test3Id]/collectCount;
            var test3S = (test3Value/255)*100;
            
            var test4 = sorted[54];
            var test4Id = this.collectionArray.indexOf(test4);
            var test4Value = this.collectionArray[test4Id]/collectCount;
            var test4S = (test4Value/255)*100;
            
            var test5 = sorted[55];
            var test5Id = this.collectionArray.indexOf(test5);
            var test5Value = this.collectionArray[test5Id]/collectCount;
            var test5S = (test5Value/255)*100;
    
            
            var top1Value = this.collectionArray[top1Id]/collectCount;
            var top2Value = this.collectionArray[top2Id]/collectCount;
            var top3Value = this.collectionArray[top3Id]/collectCount;
            var top4Value = this.collectionArray[top4Id]/collectCount;
            var top5Value = this.collectionArray[top5Id]/collectCount;
            
            var top1S = (top1Value/255)*100;
            var top2S = (top2Value/255)*100;
            var top3S = (top3Value/255)*100;
            var top4S = (top4Value/255)*100;
            var top5S = (top5Value/255)*100;
            
            var averageId = (top1Id+top2Id+top3Id+top4Id+top5Id)/5;
            //[TODO]값 맵핑하는 부분 이후에 다 라이브러리 코드 밖으로 빼기 
            //[TODO]top1Id~top5Id 중에 150 이하 값이 있을 경우 제외하는 로직 추가 
            
            visualizerCtx.fillStyle = "rgb(255,64,64)";
            visualizerCtx.fillText(top1 + " : " + top1Id, 10, 10);
            visualizerCtx.fillText(top2 + " : " + top2Id, 10, 20);
            visualizerCtx.fillText(top3 + " : " + top3Id, 10, 30);
            visualizerCtx.fillText(top4 + " : " + top4Id, 10, 40);
            visualizerCtx.fillText(top5 + " : " + top5Id, 10, 50);
            visualizerCtx.font = "25px Arial";
            visualizerCtx.fillText("average" + " : " + averageId, 10, 80);
            
            //로직이 아직 부족하지만 일단 맵핑
            visualizerCtx.fillStyle = getRGB(top1Id, top1S);
            visualizerCtx.fillRect(10,100,30,30);
            visualizerCtx.fillStyle = getRGB(top2Id, top2S);
            visualizerCtx.fillRect(50,100,30,30);
            visualizerCtx.fillStyle = getRGB(top3Id, top3S);
            visualizerCtx.fillRect(90,100,30,30);
            visualizerCtx.fillStyle = getRGB(top4Id, top4S);
            visualizerCtx.fillRect(130,100,30,30);
            visualizerCtx.fillStyle = getRGB(top5Id, top5S);
            visualizerCtx.fillRect(170,100,30,30);
            
            visualizerCtx.fillStyle = getRGB(test1Id, test1S);
            visualizerCtx.fillRect(210,100,30,30);
            visualizerCtx.fillStyle = getRGB(test2Id, test2S);
            visualizerCtx.fillRect(250,100,30,30);
            visualizerCtx.fillStyle = getRGB(test5Id, test3S);
            visualizerCtx.fillRect(290,100,30,30);
            visualizerCtx.fillStyle = getRGB(test5Id, test4S);
            visualizerCtx.fillRect(330,100,30,30);
            visualizerCtx.fillStyle = getRGB(test5Id, test5S);
            visualizerCtx.fillRect(370,100,30,30);
            
            
        }.bind(this),false);
        
        this.audio.addEventListener("play",function(){
            console.log("collecting...Frequency");
            collectingFrequency = setInterval(function(){
                
                //to colllect Frequency data
                var tempArray = this.getFrequencyDataBetween(0,1023);
                
                for(var i=0; i< tempArray.length ; i++) {
                    this.collectionArray[i] = parseInt(this.collectionArray[i]) + parseInt(tempArray[i]);
                }
                
                collectCount++;

            }.bind(this),2000);
        }.bind(this),false);
        
    };
    
    //convert to time domain data
    AudioHelper.prototype.collectTimeDomainData = function(){
        
        var collectingTime;
        var collectCount = 0;
        
        this.audio.addEventListener("ended",function(){
            console.log("collected time domain data for " + collectCount +"times");
            console.log(this.timeCollectionArray);
            
            clearInterval(collectingTime);
            
            var canvas = this.createCanvasInSize(1000,500);
            var visualizerCtx = canvas.getContext("2d");
            document.body.appendChild(canvas);
            
            var barWidth = (canvas.width / this.timeCollectionArray.length) * 0.2;
            var barHeight;
            var x=0;
            for(var i=0; i<this.timeCollectionArray.length ;i++){
                barHeight = (this.timeCollectionArray[i]/collectCount) *3;
                
                visualizerCtx.fillStyle = "#660099";
            
//                visualizerCtx.font = "5px Arial";
//                visualizerCtx.fillText(this.timeCollectionArray[i]/200, x, canvas.height - barHeight/2 - 15);

                visualizerCtx.fillRect(x, canvas.height - barHeight, barWidth*2, 5);
                x += barWidth + 1;
            }
            
        }.bind(this),false);
        
        this.audio.addEventListener("play",function(){
            console.log("collecting...Time");
            collectingTime = setInterval(function(){

                //to collect Time Domain data
                var tempArray = this.getTimeDomainData();
                
                for(var i=0; i< tempArray.length ; i++) {
                    this.timeCollectionArray[i] = parseInt(this.timeCollectionArray[i]) + parseInt(tempArray[i]);
                }
                
                collectCount++;

            }.bind(this),2000);
        }.bind(this),false);
        
    };
    
    /*-----------------------------------------------------------------------------------
    > Visualizer helper
    -----------------------------------------------------------------------------------*/
    AudioHelper.prototype.createCanvas = function(){
        var canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 300;
        return canvas;
    };
    AudioHelper.prototype.createCanvasInSize = function(_width, _height){
        var canvas = document.createElement("canvas");
        canvas.width = _width;
        canvas.height = _height;
        return canvas;
    };
    
    /* visualizer with Frequency data
     * can specify frequency range by (from, to)
     */
    AudioHelper.prototype.createBarVisualizer = function(from, to){
        var canvas = this.createCanvas();
        var visualizerCtx = canvas.getContext("2d");
        document.body.appendChild(canvas);
        
        this.audio.addEventListener("canplaythrough", function(){
            this.drawBarVisualizer(from, to, canvas, visualizerCtx);
        }.bind(this));
        
        return this;
    };
    
    AudioHelper.prototype.drawBarVisualizer = function(from, to, canvas, visualizerCtx){
        requestAnimationFrame(this.drawBarVisualizer.bind(this, from, to, canvas, visualizerCtx));

        var targetArray = this.getFrequencyDataBetween(from,to);
        
        visualizerCtx.fillStyle = "rgb(250,250,250)";
        visualizerCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        visualizerCtx.fillStyle = "#303030";
        visualizerCtx.font = "15px Arial";
        visualizerCtx.fillText("frequency from "+from + " to "+ to, 10, 20);

        var barWidth = (canvas.width / targetArray.length)*0.6; //매직넘버어어
        var barHeight;
        var x = 0;

        for (var i = 0; i < targetArray.length; i++) {	
            barHeight = targetArray[i] * 1.8;
            visualizerCtx.fillStyle = "rgb(72,175,180)";
            
            visualizerCtx.font = "5px Arial";
            visualizerCtx.fillText(targetArray[i], x, canvas.height - barHeight/2 - 15);
            
            visualizerCtx.fillRect(x, canvas.height - barHeight/2, barWidth, barHeight);
            x += barWidth + 1;
        }
        
    };

    /* visualizer with Time domain data
     * 
     */
    AudioHelper.prototype.createTimeDomainVisualizer = function(){
        var canvas = this.createCanvasInSize(1200,300);
        var visualizerCtx = canvas.getContext("2d");
        document.body.appendChild(canvas);
        
        this.audio.addEventListener("canplaythrough", function(){
            this.drawTimeVisualizer(canvas, visualizerCtx);
        }.bind(this));
        
        return this;
    };
    
    AudioHelper.prototype.drawTimeVisualizer = function(canvas, visualizerCtx){
        requestAnimationFrame(this.drawTimeVisualizer.bind(this, canvas, visualizerCtx));
        
        var timeArray = this.getTimeDomainData();
        visualizerCtx.fillStyle = "rgb(250,250,250)";
        visualizerCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        visualizerCtx.fillStyle = "#303030";
        visualizerCtx.font = "15px Arial";

        var barWidth = (canvas.width / timeArray.length)*0.1; //매직넘버어어
        var barHeight;
        var x = 0;

        for (var i = 0; i < timeArray.length; i++) {	
            barHeight = timeArray[i] * 1.8;
            visualizerCtx.fillStyle = "rgb(148,0,70)";
            
            visualizerCtx.font = "5px Arial";
            visualizerCtx.fillText("-", x, canvas.height - barHeight/2 - 15);
            
            visualizerCtx.fillRect(x, canvas.height - barHeight/2, barWidth, barHeight);
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