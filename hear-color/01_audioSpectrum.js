//레퍼런스
//http://apprentice.craic.com/tutorials/30

//[TODO] 각 함수 안에 중복되는 부분들 분리하기 ex) 캔버스 그리는 코드 / requestFrameAnimation / etc 

var audio = new Audio();
//audio.src = "../library/assets/audio/buret.mp3";
//audio.src = "../library/assets/audio/river.mp3";
//audio.src = "../library/assets/audio/electric.mp3";
audio.src = "../library/assets/audio/iu.mp3";
//audio.src = "../library/assets/audio/sen.mp3";

var helper = new AudioHelper(audio);
helper.init(document.getElementById("player"));

helper.createPlayButton().createPauseButton().createStopButton().showNowPlayingOn();

helper.createBarVisualizer(0,100);
helper.createBarVisualizer(150,250);
helper.createBarVisualizer(300,400);
helper.createBarVisualizer(450,550);
helper.createBarVisualizer(600,700);
helper.createBarVisualizer(750,850);

helper.createTimeDomainVisualizer();

helper.collectFrequencyData();