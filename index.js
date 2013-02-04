var mc = require('minecraft-protocol');
var settings = require('./settings');

var myServer = mc.createServer({
  port: settings.proxyPort,
  host: settings.proxyHost,
  'online-mode': settings['online-mode'],
  encryption: settings.encryption,
  kickTimeout: settings.kickTimeout,
  motd: settings.motd,
  'max-players': settings['max-players'],
});
myServer.onlineModeExceptions = settings.onlineModeExceptions;
myServer.on('error', function(err) {
  console.error(err.stack);
});
myServer.on("login", function(realClient) {
  var myClient = mc.createClient({
    host: settings.minecraftHost,
    port: settings.minecraftPort,
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
