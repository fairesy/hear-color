var audio = new Audio();
audio.src = "../library/assets/audio/sample.mp3";

var helper = new AudioHelper(audio);
helper.init(document.getElementById("player"));
helper.createPlayButton();
helper.createPauseButton();
helper.createStopButton();
helper.createBarVisualizer(0,100);
helper.createBarVisualizer(150,250);
helper.createBarVisualizer(300,400);
helper.createBarVisualizer(450,550);
helper.createBarVisualizer(600,700);
helper.createBarVisualizer(750,850);
