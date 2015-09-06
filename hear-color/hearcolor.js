$("input").on("change",function(){
    var files = event.target.files;
    
    var audio = new Audio();
    audio.src = URL.createObjectURL(files[0]);
    console.log(audio);
    
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
//    var sourceNode = audioContext.createBufferSource();
    var sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(audioContext.destination);
    
    $("#visualizer").append(audio);
    audio.addEventListener("canplaythrough", function(){
        //createBuffer vs createMediaElementSource?
//        audioContext.decodeAudioData(audio, function(decodedData) {
//            sourceNode.buffer = decodedData;
            sourceNode.playbackRate = 4.0;
            audio.play();
//        });
    });
    
    
    
    //[TODO] collectFrequencyData 를 worker를 사용해 bg작업으로. 
//    //태어나라 크롬 대신 일할 워커!!!
//    var audioAnyaliserWorker = new Worker("audioAnalyser.js");
//    
//    //오디오 분석을 시작해주세요 워커!!
//    var message = {"message":"start", "helper":helper};
//    audioAnyaliserWorker.postMessage(JSON.stringify(message));
//    
//    //워커가 일한 결과를 받아온다!!
//    audioAnyaliserWorker.onmessage = function(event){
//        console.log(event.data);
//    };
    
});

    