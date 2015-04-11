var express = require('express');
var app = express();
var exec = require('child_process').exec;
var cors = require('cors');
// the running processes
var processes = [];
var temperature = '';
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connectedUsers = 0;

app.use(express.static(__dirname + '/public'));
app.use(cors());

// at the start of the app init the processes
loadProcesses();
loadTemperature();

function loadProcesses() {
  exec('ps aux', function (err, stdout, stderr) {
    processes.length = 0;
    processes = parsePsStdout(stdout);
  }); 
}

function loadTemperature() {
  exec('/opt/vc/bin/vcgencmd measure_temp', function (err, stdout, stderr){
    if (err) return;

    temperature = stdout.toString().split('=')[1];
  });
}
 
setInterval(function() { 
    loadProcesses();
    if (connectedUsers > 0) {
      console.log('emitting processes to ' + connectedUsers + ' connected users');
      io.sockets.emit('processes', processes);
    }
  }, 2000);

app.get('/api/ps', function (req, res) {
  res.json(processes);    
});

app.get('/api/temp', function (req, res) {
  res.json(temperature);    
});

io.on('connection', function (socket) {
  console.log('client connected');
  connectedUsers++;
  socket.on('disconnect', function() {
    console.log('client disconnected');
    connectedUsers--;
  });
});



var server = http.listen(3000, function () {
  console.log('pi monitor listening on port 3000');
  var host = server.address().address;
  var port = server.address().port;
});

function parsePsStdout(stdout) {
  var cur_processes = [];
  var regex = /([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\n]+)/;
  
  var outLines = stdout.toString().split('\n');
  for (i = 1; i < outLines.length; i++) {
    var match = outLines[i].match(regex);
    if (match) {
      var process = new Process(match[11], match[1], match[2], match[9], match[3], match[4]);
      cur_processes.push(process);
    }
  }

  return cur_processes;
}

function Process(name, user, pid, startTime, pCPU, pMemory) {
  this.name = name;
  this.user = user;
  this.pid = pid;
  this.startTime = startTime;
  this.pCPU = parseFloat(pCPU.replace(',', '.'));
  this.pMemory = parseFloat(pMemory.replace(',', '.'));
}

