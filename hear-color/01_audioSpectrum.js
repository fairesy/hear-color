var audio = new Audio();
audio.src = "../library/assets/audio/sample.mp3";

var helper = new AudioHelper(audio);
helper.init(document.getElementById("player"));
helper.createPlayButton();
helper.createPauseButton();
helper.createBarVisualizer();