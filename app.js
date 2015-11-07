var net = require('net');
var replyparser = require('./replyparser.js');

var CLIENT_VERSION = 'aIRC 0.0.1 alpha';

var host = 'irc.rizon.net';
var port = 6667;

var nick = "aniquenick";
var username = "anique";
var realname = "realname";

var client = net.connect(port,host,
    function(){
        console.log('Connected to irc server');
        //console.log("Sending credentials");
        client.write("NICK "+nick+"\r\n");
        console.log(">>NICK "+nick+"\r\n");
        client.write("USER "+username+" 0 * :"+realname+"\r\n");
        console.log(">>USER "+username+" 0 * :"+realname+"\r\n");
    }
);
client.on('data', function(data){
    var message  = data.toString();
    console.log("================");
    console.log(data.toString());
    console.log("================");
    //client.end();
    if(message.indexOf("PING ")==0){
        var token = message.split(" :")[1];
        client.write("PONG :"+token);
        console.log(">>PONG :"+token);
    }

    var lines = message.split('\n');

    lines.forEach(function(line){
        var info = replyparser.makeSense(line.trim(), null);
        console.log(info);
        if(typeof(info)!='undefined'){
            if(info.message=='\u0001VERSION\u0001'){
                client.write('NOTICE '+info.from.split('!')[0].slice(1)+' :\u0001'+CLIENT_VERSION+'\u0001\r\n');
                console.log('NOTICE '+info.from.split('!')[0].slice(1)+' :\u0001'+CLIENT_VERSION+'\u0001\r\n');
            }
        }
    });
});
client.on('end', function(){
    console.log('Disconnected from server');
});
client.on('error', function(err){
    console.log(err);
});
