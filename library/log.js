
주절주절 로그
150805.
가장 중요한 문제는 Sync를 맞추는 이슈인 것 같다.

audioLoaded 라는 flag변수를 만들어서 해결하려고 했는데, 이벤트를 바인딩하는 시점에 이게 false이면 그냥 리턴되고 끝나버리기 때문에 다른 방법이 필요하다.
- if(!this.audioLoaded) return; 으로 로드 상태를 체크하는 방식.

오디오 파일을 다 불러왔을 때 이벤트들이 일어나도록 하는 것. 자세히 보자고 하니 media element의 많은 속성값들로 제어하는 것 같은데, 좀 공부를 하고 이해를 해야 제대로 쓸 수 있을 것 같다. 

플레이어 자체는 기존의 audio tag가 가지고 있는 속성만으로도 OK.
Audio API에서 소스를 만들고 connect(destination) / start() 등으로 audio.play()와 같은 기능이 구현될 수 있다. 
단순히 재생을 하기 위해서 Audio API를 사용할 필요는 없는듯. 
기본기능과 동일한 결과를 낸다고 하더라도, 사실 Audio API를 통해 start()하는 것은 시작시점을 정할 수 있는 등의 상세한 조작이 가능하지만..
그런 상세한 조작이 필요한 일은 뭐가 있을까? 어찌됐든 api의 메소드들을 통해 custom player를 만드는 것도 추가해두기는 해야되려나??

.....아....왜또......
Uncaught DOMException: Failed to execute 'createMediaStreamSource' on 'AudioContext': invalid MediaStream source

현재 audio data api부분 상황.
    AudioHelper.prototype.getAudioData = function(){
        audioContext = new AudioContext(); 
        var source = this.audioContext.createMediaStreamSource(this.audio);
        
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

150806.
라이브러리 스터디 찬진오빠 코멘트 : 
    각각의 함수에 모두 "canplaythrough"이벤트를 걸어서 오디오 로드가 되었을 때 이벤트를 바인딩하는 방식으로 고치기 
    각 함수에 걸 때는 여러번 중복해서 걸리지 않도록 jquery의 once, 혹은 바닐라로는 addEvnetListener("canplaythrough", function(){removeEvent-});
    처럼 한번만 걸어주는 안전장치 추가해두기. 
    
createMediaStreamSource(this.audio); 문제는 여전히 미해결. 자꾸 발생해서, 근본적인 문제가 뭐가 있는건지 알아봐야겠다.

150812.
getAudioData() 함수 안에서 계속 문제가 나던 createMediaStream(this.audio)가,
그냥 콘솔에서 var source = helper.audioContext.createMediaElementSource(helper.audio); 라고 치니까 아무 문제 없이 동작한다. 
..............대체 뭐야

엇 게다가 플레이 중인 상태에서 콘솔창에서 source = ... 을 실행하면 더이상 소리가 안난다......!
그리고 정상적으로 실행되도 dataArray에 전부 0이 들어가는데.....맞는건가 이거................

......와...... 
createMediaStream() 이랑 createMediaElementSource()가 어떻게 똑같이 보였을까. 오타는 나의 원수ㅠㅠㅠㅠㅠ
거기에 더해서 

**source는 한군데에만 connect될 수 있다.
따라서 loaded되었을 때 한번에 analyser 노드까지 포함해서 연결을 다 시켜켜놓고, 그에 딸린 메소드들만 필요할 때마다 호출해서 쓰도록 한다.