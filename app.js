var tmi = require('tmi.js');

var options = {
  options: {
    debug: true
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: "KatEvoBot",
    password: "oauth:jvnaulneic4rxrjuxv7t9b67d6e81x"
  },
  channels: ["minterhero"]
};

var client = new tmi.client(options);
client.connect();

client.on('chat', function(channel, user, message, self) {
  if(message === "!opgg") {
    client.action("minterhero", "Here you go! @" + user['display-name'] +  " http://na.op.gg/summoner/userName=TwTv%20KatEvolved")
  };
  if(message === "!guide") {
    client.action("minterhero", "Here you go! @" + user['display-name'] + " http://www.solomid.net/guide/595daf80babc510027be7e76  ")
  };
if(message === "!playlist") {
    client.action("minterhero", "I don't have a playlist, I use YouTube autoplay.")
  };
  if(message === "!prostream") {
    client.action("minterhero", "Professional streamers don't forget to switch scenes Kappa")
  };
  if(message === "!katevobot") {
    client.action("minterhero", "I am a bot that helps to moderate the chat.")
  };
  if(message === "!runes") {
    client.action("minterhero", "Currently standard katarina runes are Domination-electrocute/sudden impact/eyeball collection/ravenous hunter or ingenious hunter Precision- Triumph/Coup De Grace")
  };
  if(message === "!uptime") {
    client.action("minterhero", "Stream uptime: " + [twitch])
  };
  if (message === "!modtest" && user.mod) {
    client.say("minterhero", "Yay! @" + user['display-name'] + " is a mod!")
  }
});












client.on("cheer", function (channel, userstate, message) {
    // Do your stuff.
});

client.on('connected', function(address, port) {
  client.action("minterhero", "Hello I'm KatEvoBot!")
});