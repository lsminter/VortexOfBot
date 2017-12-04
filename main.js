/**
 * This twitch bot is based on the tmi.js package.
 * Below is a list of all the things this code does:
 * - create array.clean function to strip certain elements from arrays
 * - load the neccesary modules and start the bot with a configuration object
 * - define variables for later use
 * - create client
 * - define commands
 * - open client connection
 */

Array.prototype.clean = function (deleteValue)
{
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] == deleteValue)
        {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function getRandomListItem(list)
{
    var rand = Math.floor(Math.random() * (list.length - 1));
    console.log(rand);
    return list[rand];
}

// LOAD MODULES
var tmi = require('tmi.js');
var fs = require('fs');
var http = require('http');


// VARIABLES FOR LATER USE
var greetings = [
        "Did you bring me my doughnut xMustang?",
        "Greetings earthling!",
        "Hi there!",
        "Wazzup bro",
        "Eyyyyyyyyy",
        "Welcome! Did you bring any beer?",
        "Welcome to the dark side...",
    ],
    interMessagesCounter = 0,
    intervalMessages = [
        "If you like whatcha see, follow! You can access my youtube here: https://www.youtube.com/channel/UC4XryR0fHLOlwCO4KLvn-ow",
        "Stalk me here! https://twitter.com/MyKatEvolved"
    ],
    emotes = [
        "Kappa",
        "KappaPride",
        "BrokeBack",
        "DansGame",
        "Kreygasm",
        "SwiftRage",
        "BabyRage",
        "SMOrc",
        "FrankerZ",
        "4Head",
        "WutFace",
        "VoHiYo"
    ],
    welcometext =
        "Welcome! chat messages should not be longer than 500 characters. " +
        "Here's a list of the available commands: !about, !hello, !saymyname, !dicefules, !roll, !points, !testsafe.",
    channelName = "katevolved",
    commandCounter = 0,
    chatMaxLength = 500;

// COMMAND SPAM COUNTER
setInterval(function ()
{
    commandCounter = 0;
}, 10000);

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
        password: "oauth:vwohov7is1pou2rw9sylme9bra0z64"
    },
    channels: [
    "katevolved",
    "minterhero"
    ]
}

// CREATE CLIENT OBJECT
var client = new tmi.client(options);

// COMMANDS OBJECT
var Commands = {
    '!about': function (channel, user, message, self)
    {
        client.action(channel, welcometext);
    },

    '!bye': function (channel, user, message, self)
    {
        client.action(channel, "Until next time " + user['display-name'] + "! " + getRandomListItem(emotes) );
    },

    '!rolltheminter': function (channel, user, message, self)
    {
        client.action(channel, user['display-name'] + " is the coolest person ever!");
    },

    '!hi': function (channel, user, message, self)
    {
        client.action(channel, getRandomListItem(greetings) + " " + getRandomListItem(emotes));
    },

    '!saymyname': function (channel, user, message, self)
    {
        client.action(channel, user['display-name'] + "! " + getRandomListItem(emotes));
    },

    '!dicerules': function (channel, user, message, self)
    {
        client.action(channel, "The dice has 100 sides, if you roll a 1 you are timed out. Your scores are saved by the bot.")
    },

    '!roll': function (channel, user, message, self)
    {
        var diceResult = String(Math.floor(Math.random() * 100) + 1);
        client.action(channel, user['display-name'] + ", you rolled " + diceResult + "!");
        if (diceResult === 1)
        {
            client.timeout(channel, user['display-name'], 300, "Oh no, you rolled a 1! BibleThump")
        }
        fs.appendFile('rollthediceStats.txt', user['display-name'] + " rolled " + diceResult + "\n");
    },
    '!points': function (channel, user, message, self)
    {
        var userStats, score = 0;
        fs.readFile('rollthediceStats.txt', 'utf-8', function (err, data)
        {
            if (err) console.log(err);
            userStats = data.split('\n');
            userStats.clean("");
            userStats.forEach(function (stat)
            {
                if (stat.indexOf(user['display-name']) >= 0)
                {
                    score += parseInt(stat.split(" ")[2]);
                }
            });
            client.action(channel, user['display-name'] + " has scored " + score + " points so far!");
        });
    },

    '!testsafe': function (channel, user, message, self)
    {
        if (user['display-name'] === "minterhero" || "KatEvolved")
        {
            client.action(channel, "Bot is working!")
        }
        else
        {
            client.action(channel, "This command is for the admin only.");
        }
    }
};

client.on("resub", function (channel, username, months, message) {
    client.action('Thank you ' + username + ' for subscribing!')
});
client.on("subscribers", function (channel, enabled) {
    client.action('Thank you ' + username + ' for subscribing!')
});

// LIST COMMAND KEYS
var commandList = Object.keys(Commands);

// CHAT MESSAGE LISTENER
client.on("chat", function (channel, user, message, self)
{
    // timeout big messages
    if (message.length > chatMaxLength)
    {
        client.timeout(channel, user['display-name'], 180, "please limit your chat messages to " + chatMaxLength + " characters");
        client.whisper(user['display-name'], "please limit your chat messages to " + chatMaxLength + " characters");
        return;
    }

    // check if message contains "!"
    if (message.indexOf('!') === 0 && message.length > 1)
    {
        // count commands, when more than 3 = timeout
        commandCounter++;

        var parsedCommand = message.split(" ")[0];

        // check if command exists
        if (Commands.hasOwnProperty(parsedCommand))
        {
            // check if commands are sent too fast (counter starts at 0)

            // execute command
            Commands[parsedCommand](channel, user, message, self);
        }
    }
});

// display channel message every 10 minutes
setInterval(function() {
    client.action(channelName, intervalMessages[interMessagesCounter]);
    if (interMessagesCounter < (intervalMessages.length - 1))
    {
        interMessagesCounter++;
    } else {
        interMessagesCounter = 0;
    }
}, 600000);

// CONNECT BOT
client.connect();

client.on("connected", function(address, port) {
    client.action("KatEvolved", "Bot connected!")
})