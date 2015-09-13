$("input").on("change",function(){
    var files = event.target.files;
    
    var audio = new Audio();
    audio.src = URL.createObjectURL(files[0]);
    console.log(audio);

    var helper = new AudioHelper(audio);
    helper.init($("#hearcolor"));
    
    audio.addEventListener("canplaythrough", function(){
        $("#basecamp").hide();
        $("#hearcolor").show();
        $("#hearcolor button").on("click", function(){
            audio.play();
        });
        
        helper.createBarVisualizer(0,300);
        helper.collectFrequencyData();
    });
    
    //[문제] audio.on("event", ) 형식이 유효하지 않다. js-jquery짬뽕
    audio.addEventListener("play", function(){
        $("#hearcolor button").hide();
        hearcolorVisualizer();
    });
});

//visualizer : 전체 수정 필요
//[문제] 캔버스는 나타나는데, 아무것도 그려지지 않는다! 시험삼아 helper.createBarVisualizer()도 해봤지만 그것도 안그려짐...
function hearcolorVisualizer(){
    //[문제] 캔버스를 왜 $("#visualizer") 로 가지고 오면 getContext가 불가능한가???
    var canvas = document.getElementById("visualizer");
    var context = canvas.getContext("2d");
    var canvasWidth = canvas.width = window.innerWidth;
    var canvasHeight = canvas.height = window.innerHeight;

    var cx = canvasWidth/2;
    var cy = canvasHeight/2;

    var toRadian = Math.PI / 180;
    //radian = (Math.PI/180) * angle

    var howMany = 10;

    var particles = [];
    var colors = ["242,41,41", "222,80,80", "247,111,111", "255,145,145", "252,199,199"];
    context.strokeStyle = "white";
    context.globalAlpha = 0.7;

    var radius = 40;
    //x,y Speed : frequency graph height 맵핑 
    // var xSpeed = Math.random();
    // var ySpeed = Math.random();
    var xSpeed = 1; 
    var ySpeed = 1;
    function particle() {
        this.r = radius;

        var innerR = Math.round(Math.random()*130) + 1; //1~130까지 랜덤 정수
        var innerA = Math.round(Math.random()*360) + 1;
        //innerA는 angle인듯. innerR은 뭐지?? radius인가 

        this.x = cx + innerR * Math.cos(innerA*toRadian);
        // this.y = cy + 20 + innerR * Math.sin(innerA*toRadian);
        //20은 그냥 매직넘버인가?

        this.ix = xSpeed * (Math.random() < 0.5 ? -1 : 1); //positive or negative
        // this.iy = ySpeed * (Math.random() < 0.5 ? -1 : 1); //positive or negative

        this.alpha = 1;
        this.color = "rgba(" + colors[Math.round(Math.random() * colors.length) + 1] + "," + this.alpha + ")";
//        this.color = "rgba(255,255,255,0.9)";
    }

    for(var i=0; i<howMany; i++){
        particles[i] = new particle();
        particles[i].y = 50*(i+1);
    }

    var sharp = false;
    function Draw() {
        context.fillStyle = "rgba(0,0,0,0.05)";
        context.fillRect(0,0,canvasWidth, canvasHeight);
        for(var i=0; i<particles.length ; i++){
            context.fillStyle = particles[i].color;

            if(particles[i].x>350 ||particles[i].x<150){
                particles[i].ix = -1 * particles[i].ix;
                // particles[i].iy = -1 * particles[i].iy;
                particles[i].x += particles[i].ix;
                // particles[i].y += particles[i].iy;
            }
            else{
                particles[i].x += particles[i].ix;
                // particles[i].y += particles[i].iy;
                if(sharp){
                    context.beginPath();
                    context.moveTo(particles[i].x, particles[i].y);
                    context.lineTo(particles[i].x + 100, particles[i].y);
                    context.lineTo(particles[i].y, particles[i].x + 100);
                    context.fill();
                }else{
                    context.beginPath();
                    context.arc(particles[i].x, particles[i].y, particles[i].r, 0, 2*Math.PI);
                    context.fill();
                }
            }
        }

        window.requestAnimationFrame(Draw);
    }
    window.requestAnimationFrame(Draw);
}
    
//    나중에 워커로 문제 해결해보기 
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