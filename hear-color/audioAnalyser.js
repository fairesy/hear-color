//워커가 일을 한다 워킹워킹
self.onmessage = function(event){
    var data = JSON.parse(event.data);
    var command = data.message;
    var helper = data.helper;
    
    //처리 시작
    if(command === "start"){
        //volume=0인 상태로 오디오를 재생하고,
        
        var source = helper.audioContext.createBufferSource();
        
        //playbackRate를 이용해서 배속을 하고,
        source.playbackRate.value = 4.0;
        
        source.start();
        var collectCount = 0;
        
        //frequency 데이터를 모은다. 
        helper.audio.on("play", function(){
        
            collectingFrequency = setInterval(function(){
                var tempArray = this.getFrequencyDataBetween(0,1023);
            
                for(var i=0; i< tempArray.length ; i++) {
                    this.collectionArray[i] = parseInt(this.collectionArray[i]) + parseInt(tempArray[i]);
                }
                collectCount++;
                
            }, 1000);
        }.bind(this));
        
        helper.audio.on("ended", function(){
            clearInterval(collectingFrequency);
            
            for(var i=0; i<helper.collectionArray.length; i++){
                helper.collectionArray[i] = helper.collectionArray[i]/collectCount;
            }
            
            self.postMessage(helper.collectionArray);
        });
        
        
    }
}
