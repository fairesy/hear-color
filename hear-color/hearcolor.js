$("input").on("change",function(){
    var files = event.target.files;
    
    var audio = new Audio();
    audio.src = URL.createObjectURL(files[0]);
    console.log(audio);
    
    var helper = new AudioHelper(audio);
    helper.init($("#visualizer"));
    helper.createPlayButton().createPauseButton().createStopButton().showNowPlayingOn();
    //[TODO] showNowPlayingOn filename 수정 필요(createObjectURL이라 임의의 blob데이터 주소로 나와서) @0906
   
//    helper.createBarVisualizer(0,1023);
//    helper.collectFrequencyData();
    
    //[TODO] collectFrequencyData 를 worker를 사용해 bg작업으로. 
    var audioAnyaliserWorker = new Worker("audioAnalyser.js");
    var message = {"message":"start", "helper":helper};
    audioAnyaliserWorker.postMessage(JSON.stringify(message));
    
    audioAnyaliserWorker.onmessage = function(event){
        console.log(event.data);
//        audioAnyaliserWorker.terminate();
    };
    
});

    