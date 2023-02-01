var socket =  new WebSocket(wsUrl);
socket.onopen = (e) => {
    subscription.state = true ;
    console.log(`sokect link was connecting`);
};
socket.onmessage = (e) => {
    subscription.receiveData =JSON.parse(e.data);
};

socket.onerror = (e)=>{
    console.log('ws连接错误')
    // message.open({
    //     type: 'error',
    //     content: 'ws连接错误',
    //   });
}
socket.onclose =(e) => {
    console.log('ws连接关闭')
    // message.open({
    //     type: 'warning',
    //     content: 'ws连接关闭',
    //   });
};
var subscription ={
    sendData:{"pointIds":null, "moduleIds":null,type:'getModuleAndPoint'},
    state:false,
    socketList:[],
    receiveData:[],
    save:function(list){
        this.socketList = list;
        this.emit();
    },
    push:function(id){
        this.socketList= this.socketList.concat(id);
        this.socketList= Array.from(new Set(this.socketList));
    },
    remove:function(){
        this.socketList = [];
        this.emit();
    },
    emit:function(){
        let ids = [];
        this.socketList.map((item)=>{
            ids.push(item)
        })
        this.sendData['pointIds'] = ids;
        setTimeout(()=>{
            try{
                socket.send(JSON.stringify(this.sendData));
            }catch(err){

            }
        },300)
    },
}


// var socket2 =  new WebSocket('ws://localhost:3002');
// socket2.onopen = (e) => {
//     socket2.send(JSON.stringify({event:'open_tcp',data:{ip:'192.168.1.238',port:'502'}}))
// };
// socket2.onmessage = (e) => {
//     console.log(e.data)
// };
// // setInterval(function(){
// //     console.log('发码')
// //     socket2.send(JSON.stringify({event:'send_tcp',data:'00 00 00 00 00 09 04 10 00 12 00 01 02 00 00'}))
// // },3000)
// socket2.onerror = (e)=>{
   
// }
// socket2.onclose =(e) => {

// };
