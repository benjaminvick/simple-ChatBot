/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am Old Man Winter, a simple chat bot that likes to banter about the weather."); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Why, hello there! A hearty winter welcome to you ' + input + ' !';// output response
  waitTime =2500;
  question = 'So tell me... What is the temperature outside (in degrees Fahrenheit)?';			    	// load next question
  }
  else if (questionNum == 1) {
  answer= 'Really ' + input + ' degrees out in Fahrenheit? So that is like ' + Math.round((parseInt(input) - 32) / 1.8 ) + ' in Celsius';// output response
  waitTime =2000;
  question = 'Where do you live?';			    	// load next question
  }
  else if (questionNum == 2) {
  answer= ' Cool! I have heard that ' + input + ' is a nice place.';
  waitTime =2000;
  question = 'Do you think it\'s cold in ' + input + '?';			    	// load next question
  }
  else if (questionNum == 3) {
    if(input.toLowerCase()==='yes'|| input===1){
      answer = 'People seem to think it\'s cold there right now, but maybe you just need to toughen up!';
      waitTime =2000;
      question = 'Whats your favorite place to escape to for a vacation when it is cold out where you live?';
    }
    else if(input.toLowerCase()==='no'|| input===0){
        answer='That\'s the spirit!'
        waitTime = 2000;
        question = 'Where is your favorite place to go enjoy some fabulous winter weather?';
    }
    else{
      answer = '';
      question = 'I\'m a bit hard of hearing. Can you please answer with yes or no.';
      questionNum--;
      waitTime = 0;
    }
  // load next question
  }
  else{
    answer= 'I have nothing more to say! Bundle up out there and stay warm!';// output response
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
