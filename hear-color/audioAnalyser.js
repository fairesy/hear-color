
self.onmessage = function(event){
    var data = JSON.parse(event.data);
    var command = data.message;
    
    //처리 시작
    if(command === "start"){
        self.postMessage(data.helper);
    }
}
