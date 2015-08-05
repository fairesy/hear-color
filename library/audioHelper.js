/*-----------------------------------------------------------------------------------
> Overall
    [Input] HTMLAudioElement
    [Output] AudioHelper : HTML5 audio api helper. 
-----------------------------------------------------------------------------------*/
(function(){
    function AudioHelper(audio){
        this.audio = audio;
        this.audioLoaded = false;
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
        this.audioLoaded = true;
//        this.drawDefaultDebug(1500);
    };
    
    /*-----------------------------------------------------------------------------------
    > Custom Player helper (with audio tag)
    -----------------------------------------------------------------------------------*/
    AudioHelper.prototype.makesPlayButtonWith = function(element){
//        if(!this.audioLoaded) return; //리턴 말고, 로딩이 끝나는 걸 기다렸다가 이벤트리스너 걸기 
        
        element.addEventListener("click",function(){
            this.audio.play();
        }.bind(this),false);
    };
    
    AudioHelper.prototype.makesPauseButtonWith = function(element){
//        if(!this.audioLoaded) return;
        
        element.addEventListener("click",function(){
            this.audio.pause();
        }.bind(this),false);
    };
    
    AudioHelper.prototype.makesStopButtonWith = function(element){
//        if(!this.audioLoaded) return;
        
        element.addEventListener("click",function(){
            this.audio.pause();
            this.audio.currentTime = 0;
        }.bind(this),false);
    };
    
    AudioHelper.prototype.makesLoopToggleWith = function(element){
//        if(!this.audioLoaded) return;
        
        element.addEventListener("click",function(){
            this.audio.loop = this.audio.loop ? false : true;
        }.bind(this),false);
    };
    AudioHelper.prototype.makesMuteToggleWith = function(element){
        element.addEventListener("click",function(){
            this.audio.muted = this.audio.muted ? false : true;
        }.bind(this),false);
    };
    
    AudioHelper.prototype.makesVolumeDownWith = function(element){
        element.addEventListener("click",function(){
            this.audio.volume = (this.audio.volume <= 0) ? 0 : (this.audio.volume-0.1).toFixed(1);
        }.bind(this),false);
    };
    AudioHelper.prototype.makesVolumeUpWith = function(element){
        element.addEventListener("click", function(){
            this.audio.volume = (this.audio.volume >= 1) ? 1 : (this.audio.volume+0.1).toFixed(1);
        }.bind(this), false);
    };
    AudioHelper.prototype.makesVoluemSliderWith = function(element){
        
    };
    
    AudioHelper.prototype.makesProgressBarWith = function(element){
    
    };
    
    AudioHelper.prototype.showNowPlayingOn = function(element){
//        if(!this.audioLoaded) return; 
        
        //체크 안해주니까 가지고 올 소스가 없어서 부른 시점에 동작 안함........
        var fullSrc = this.audio.currentSrc;
        var tempArr = fullSrc.split("/");
        var nowPlayingName = tempArr[tempArr.length-1];
    
        var duration = Math.round(this.audio.duration);
        var durationMin = Math.round(duration/60);
        var durationSec = duration - durationMin*60;
        durationSec = (durationSec < 10) ? "0"+durationSec : durationSec;
        
        var currentTime = Math.round(this.audio.currentTime);
        var currentTimeMin = Math.round(currentTime/60);
        var currentTimeSec = currentTime - currentTimeMin*60;
        currentTimeSec = (currentTimeSec < 10) ? "0"+currentTimeSec : currentTimeSec;
        
        //output 형식은 이후 수정.
        element.textContent = nowPlayingName + ">>>" + currentTimeMin+":"+currentTimeSec+"  "+ durationMin + ":" + durationSec;
    };
    
    /*-----------------------------------------------------------------------------------
    > Audio Data helper (with Audio API)
    -----------------------------------------------------------------------------------*/
    AudioHelper.prototype.getAudioData = function(){
        var audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var source = audioContext.createMediaStreamSource(this.audio);
        //왜 또 안돼............ㅇ-<-<
        
        var analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        //analyser노드는 특정 fft domain 범위 안의 오디오 데이터를 가지고 오는 역할을 합니다. 
        //fft domain은 analyser.fftSize로 지정해줍니다. 따로 정하지 않을 경우 기본값은 2048입니다. 
        
        //데이터를 가져오기 위해서,
        //analyser.getFloatFrequencyData(), analyser.getByteFrequencyData()를 사용합니다.
        //waveform데이터를 가져오기 위해서,
        //analyser.getByteTimeDomainData(), analyser.getFloatTimeDomainData()를 사용합니다. 
        
        //이 메소드들은 특정 배열에 데이터를 복사해줍니다. 그러니까 이것들을 실행하기 전에 메소드들이 돌려주는 데이터를 받아줄 배열을 새로 만들어야해요. 
        //첫번째는 32비트 부동소수점 수들을 리턴하고, 두번째/세번째는 8비트 unsigned int 를 리턴합니다.
        //따라서 보통의 js array는 형식이 맞지 않습니다. 
        //Float32Array, 혹은 Uint8Array 를 사용합니다. 
        
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        
        //배열을 다 만들었으면, 실제로 데이터를 가져오기 위한 메소드를 부릅니다.
        analyser.getByteFrequencyData(dataArray);
        
        //이제 우리는 특정 시점의 오디오 데이터를 배열로 가지고 있습니다. 
        //이 데이터들을 보통 canvas에 올려서 web audio visualization이 이루어집니다. 
        //(매 시점마다 데이터array를 새로 받아와서 실시간으로 데이터를 업데이트하는 방식)
        console.log(dataArray);
    };
    
    /*-----------------------------------------------------------------------------------
    > Debug helper
    -----------------------------------------------------------------------------------*/
    AudioHelper.prototype.drawDefaultDebug = function(ms){
        setInterval(function(){
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log("duration : " + this.audio.duration);
            console.log("current time : " + this.audio.currentTime);
            console.log("loop : " + this.audio.loop);
            console.log("autoplay : " + this.audio.autoplay);
            console.log("controls : " + this.audio.controls);
            console.log("volume : " + this.audio.volume);
            console.log("muted : " + this.audio.muted);
            console.log("paused : " + this.audio.paused);
            console.log("ended : " + this.audio.ended);
            console.log("source : " + this.audio.currentSrc);
        }, ms);  
    };
    
    AudioHelper.prototype.drawDataDebug = function(ms){
        setInterval(function(){
        
        }, ms)
    };
    
    
    window.AudioHelper = AudioHelper;

}());

/*
주절주절 로그
150805.
가장 중요한 문제는 Sync를 맞추는 이슈인 것 같다.
오디오 파일을 다 불러왔을 때 이벤트들이 일어나도록 하는 것. 자세히 보자고 하니 media element의 많은 속성값들로 제어하는 것 같은데, 좀 공부를 하고 이해를 해야 제대로 쓸 수 있을 것 같다. 

플레이어 자체는 기존의 audio tag가 가지고 있는 속성만으로도 OK.
Audio API에서 소스를 만들고 connect(destination) / start() 등으로 audio.play()와 같은 기능이 구현될 수 있다. 
단순히 재생을 하기 위해서 Audio API를 사용할 필요는 없는듯. 
기본기능과 동일한 결과를 낸다고 하더라도, 사실 Audio API를 통해 start()하는 것은 시작시점을 정할 수 있는 등의 상세한 조작이 가능하지만..
그런 상세한 조작이 필요한 일은 뭐가 있을까? 어찌됐든 api의 메소드들을 통해 custom player를 만드는 것도 추가해두기는 해야되려나??

.....아....왜또......
Uncaught DOMException: Failed to execute 'createMediaStreamSource' on 'AudioContext': invalid MediaStream source

*/