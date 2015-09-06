//레퍼런스
//http://apprentice.craic.com/tutorials/30

//[TODO] 각 함수 안에 중복되는 부분들 분리하기 ex) 캔버스 그리는 코드 / requestFrameAnimation / etc
//[TODO] tempo를 구하는 방법........?
//[TODO] 실시간으로 플레이되고 있는 데이터를 가져오는게 아니라 재생되지 않아도 파일 자체에서 정보를 추출할 수 있게?

var audio = new Audio();
//audio.src = "../library/assets/audio/buret.mp3";
//audio.src = "../library/assets/audio/river.mp3";
//audio.src = "../library/assets/audio/electric.mp3";
//audio.src = "../library/assets/audio/iu.mp3";
//audio.src = "../library/assets/audio/sen.mp3";

//audio.src = "../library/assets/audio/jaurim.mp3";
//audio.src = "../library/assets/audio/10cm_4.mp3";
//audio.src = "../library/assets/audio/10cm_stalker.mp3";
//audio.src = "../library/assets/audio/nell_fourTimes.mp3";

//audio.src = "../library/assets/audio/depapepe_starrynight.mp3"; //todo
audio.src = "../library/assets/audio/depapepe_tearsoflove.mp3";
//audio.src = "../library/assets/audio/glee_defyinggravity.mp3";
//audio.src = "../library/assets/audio/10cm_tonight.mp3";
//audio.src = "../library/assets/audio/oksang_sugo.mp3";
//audio.src = "../library/assets/audio/oksang_hihan.mp3";
//audio.src = "../library/assets/audio/cran_papillon.mp3";
//audio.src = "../library/assets/audio/coldplay_everytear.mp3";
//audio.src = "../library/assets/audio/lucid.mp3";

var helper = new AudioHelper(audio);
helper.init(document.getElementById("player"));

helper.createPlayButton().createPauseButton().createStopButton().showNowPlayingOn();

//bar visualizer based on frequency data(realtime)
helper.createBarVisualizer(0,100);
helper.createBarVisualizer(101,200);
helper.createBarVisualizer(201,300);
helper.createBarVisualizer(301,400);
helper.createBarVisualizer(401,500);
helper.createBarVisualizer(501,600);

//bar visualizer based on time domain data(realtime)
helper.createTimeDomainVisualizer();

//collect data to define matching rule
helper.collectFrequencyData();
helper.collectTimeDomainData();