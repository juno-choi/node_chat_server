var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var moment = require('moment');

//korea time
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

var today = moment().format('YYYY-MM-DD');

var file = 'chatlog/'+today+'.txt';

//connecting user count
var cnt = 0;
 
io.on('connection', function (socket) {
    cnt++;
    console.log(cnt+'명의 유저가 접속중...');
    socket.on('disconnect', function () {
	cnt--;
        console.log('유저가 접속해제를 했습니다. '+cnt+' 접속중');
	io.emit('sned_msg',cnt+'명의 유저가 접속중입니다.');
    });
 
    socket.on('send_msg', function (json) {
	//file write
	var data = JSON.parse(json);
	var msg = data.msg;
	var user = data.user;

	var now = moment().format('HH:mm:ss');
	msg = user+' : '+msg+' ('+now+')';
	fs.open(file,'a+',function(err,fd){
		if(err) throw err;
		if(fd == '9'){
			console.log(file+' file crete');
		}else{
			var text = msg+'\n';
			fs.appendFile(file,text,function(err){
				if(err) throw err;
				console.log(file+' file append msg : '+msg);
			});
		}
	});
	io.emit('send_msg', msg);
    });
});
 
http.listen(82, function () {
    console.log('listening on *:82');
});
