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
    
    AudioHelper.prototype.init = function(){
        var placeToPutAudio = document.getElementById("player");
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

        setInterval(function(){
            console.log(this.getAudioData());
        }.bind(this), 1000);
    };
    
    /*-----------------------------------------------------------------------------------
    > Custom Player helper (with audio tag)
    -----------------------------------------------------------------------------------*/
    AudioHelper.prototype.makesPlayButtonWith = function(element){
        this.audio.addEventListener("canplaythrough", function(){
            element.addEventListener("click",function(){
                this.audio.play();
            }.bind(this),false);
        }.bind(this));
    };
    
    AudioHelper.prototype.makesPauseButtonWith = function(element){
        this.audio.addEventListener("canplaythrough", function(){
            element.addEventListener("click",function(){
                this.audio.pause();
            }.bind(this),false);
        }.bind(this));
    };
    
    AudioHelper.prototype.makesStopButtonWith = function(element){
        this.audio.addEventListener("canplaythrough", function(){
            element.addEventListener("click",function(){
                this.audio.pause();
                this.audio.currentTime = 0;
            }.bind(this),false);
        }.bind(this));
        
    };
    
    AudioHelper.prototype.makesLoopToggleWith = function(element){
        this.audio.addEventListener("canplaythrough", function(){
            element.addEventListener("click",function(){
                this.audio.loop = this.audio.loop ? false : true;
            }.bind(this),false);
        }.bind(this));
        
    };
    AudioHelper.prototype.makesMuteToggleWith = function(element){
        this.audio.addEventListener("canplaythrough", function(){
            element.addEventListener("click",function(){
                this.audio.muted = this.audio.muted ? false : true;
            }.bind(this),false);
        }.bind(this));
        
    };
    
    AudioHelper.prototype.makesVolumeDownWith = function(element){
        this.audio.addEventListener("canplaythrough", function(){
            element.addEventListener("click",function(){
                this.audio.volume = (this.audio.volume <= 0) ? 0 : (this.audio.volume-0.1).toFixed(1);
            }.bind(this),false);
        }.bind(this));
        
    };
    AudioHelper.prototype.makesVolumeUpWith = function(element){
        this.audio.addEventListener("canplaythrough", function(){
            element.addEventListener("click", function(){
                this.audio.volume = (this.audio.volume >= 1) ? 1 : (this.audio.volume+0.1).toFixed(1);
            }.bind(this), false);
        }.bind(this));
        
    };
    AudioHelper.prototype.makesVolumeSliderWith = function(element){
        
    };
    
    AudioHelper.prototype.makesProgressBarWith = function(element){
    
    };
    
    AudioHelper.prototype.showNowPlayingOn = function(element){
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
//                element.textContent = nowPlayingName + ">>>" + currentTimeMin+":"+currentTimeSec+"  "+ durationMin + ":" + durationSec;
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
    AudioHelper.prototype.getAudioData = function(){
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
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