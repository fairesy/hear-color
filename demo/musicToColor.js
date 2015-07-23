
//
//window.addEventListener('load', init, false);
//
//function init() {
//    var musicBuffer = null;
//    
//    //audio context를 만든다. 
//    window.AudioContext = window.AudioContext || window.webkitAudioContext;
//    var context = new AudioContext();
//
//    function loadMusic(url) {
//        
//        //XHR리퀘스트를 사용해서 사운드를 불러온다. 
//      var request = new XMLHttpRequest();
//      request.open('GET', "http://soundcloud.com/forss/sets/soulhack", true);
//      request.responseType = 'arraybuffer'; //오디오파일은 데이터가 아니기 때문에 responseType을 arrayBuffer로 지정한다. 
//
//      // Decode asynchronously
//      request.onload = function() {
//        context.decodeAudioData(request.response, function(buffer) {
//          musicBuffer = buffer;
//        }, onError);
//      }
//      request.send();
//    }
//}

$(document).ready(function(){
    
    var fileInput = $("input");
    fileInput.on("change", function(){
        var music = this.files[0];
        document.querySelector("section").insertAdjacentHTML("beforeend", "<audio controls src="+ "./" + music.name +"></audio>");
        this.style.display = "none";
        
        getColorFromMusic();
    });
});

function getColorFromMusic(){
    var player = document.querySelector("audio");
    player.addEventListener("ended", function(){
        document.querySelector("section#insertMusic div").style.backgroundColor = "rgba(186,104,200,0.85)";
    });
};
    