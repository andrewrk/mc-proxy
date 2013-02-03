var mc = require('minecraft-protocol');

var myServer = mc.createServer({
  port: 25566,
  'online-mode': false,
});
myServer.on("login", function(realClient) {
  var myClient = mc.createClient({
    username: realClient.username,
    keepAlive: false,
  });
  myClient.once(0x01, function(packet) {
    realClient.on('packet', fromRealClient);
    myClient.on('packet', fromMyClient);
  });

  myClient.on('error', function(err) {
    removeListeners();
    console.error(err.stack);
  });
  realClient.on('error', function(err) {
    removeListeners();
    console.error(err.stack);
  });
  myClient.on('end', removeListeners);
  realClient.on('end', removeListeners);

  function removeListeners() {
    realClient.removeListener('packet', fromRealClient);
    myClient.removeListener('packet', fromMyClient);
  }

  function fromRealClient(packet) {
    myClient.write(packet.id, packet);
  }

  function fromMyClient(packet) {
    realClient.write(packet.id, packet);
  }
});
