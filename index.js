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
    console.log("initiating proxy");
    realClient.on('packet', fromRealClient);
    myClient.on('packet', fromMyClient);
    console.log("my->real", packet.id, packet);
    realClient.write(packet.id, packet);
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
    console.log("remove listeners");
    realClient.removeListener('packet', fromRealClient);
    myClient.removeListener('packet', fromMyClient);
  }

  function fromRealClient(packet) {
    console.log("real->my", packet.id, packet);
    myClient.write(packet.id, packet);
  }

  function fromMyClient(packet) {
    console.log("my->real", packet.id, packet);
    realClient.write(packet.id, packet);
  }
});
