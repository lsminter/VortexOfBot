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
        "Greetings earthling!",
        "Hi there!",
        "Wazzup bro",
        "Eyyyyyyyyy",
        "Welcome to da club!",
        "Welcome, Did you bring any beer?",
        "Welcome to the dark side..."
    ],
    interMessagesCounter = 0,
    intervalMessages = [
        "Welcome to my channel. If you like whatcha see, follow! You can access my youtube here: https://www.youtube.com/channel/UC4XryR0fHLOlwCO4KLvn-ow"
    ],
    emotes = [
        "Kappa",
        "KappaPride",
        "BrokeBack",
        "DansGame",
        "Keygasm",
        "SwiftRage",
        "BabyRage",
        "SMOrc",
        "FrankerZ",
        "4Head",
        "Wutface",
        "VoHiYo"
    ],
    welcometext =
        "Welcome! chat messages should not be longer than 500 characters, and don't spam commands please. " +
        "Here's a list of the available commands: ",
    channelName = "b1tspls",
    commandCounter = 0,
    chatMaxLength = 500;

// COMMAND SPAM COUNTER
setInterval(function ()
{
    commandCounter = 0;
}, 10000);

// CREATE CLIENT OBJECT
var client = new tmi.client({
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
});

// COMMANDS OBJECT
var Commands = {
    '!about': function (channel, user, message, self)
    {
        client.action(channel, welcometext + commandList);
    },

    '!hello': function (channel, user, message, self)
    {
        client.action(channel, getRandomListItem(greetings));
    },

    '!saymyname': function (channel, user, message, self)
    {
        client.action(channel, user['display-name'] + "! " + getRandomListItem(emotes));
    },

    '!dicerules': function (channel, user, message, self)
    {
        client.action(channel, "The dice has 20 sides, if you roll a 1 you are timed out. " +
            "Your scores are saved by the bot.")
    },

    '!rollthedice': function (channel, user, message, self)
    {
        var diceResult = String(Math.floor(Math.random() * 20) + 1);
        client.action(channel, user['display-name'] + ", you rolled " + diceResult + "!");
        if (diceResult === 1)
        {
            client.timeout(channel, user['display-name'], 300, "Oh no, you rolled a 1! BibleThump");
        }
        fs.appendFile('rollthediceStats.txt', user['display-name'] + " rolled " + diceResult + "\n");
    },

    '!dicestats': function (channel, user, message, self)
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
        if (user['display-name'] === "minterhero")
        {
            client.action(channel, "Bot is working!")
        }
        else
        {
            client.action(channel, "This command is for the admin only");
        }
    }
};

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
            if (commandCounter === 2)
            {
                client.whisper(user['display-name'], "Last warning: you are sending commands too fast!");
            }
            else (commandCounter >= 4)
            {
                client.timeout(channel, user['display-name'], 60, "spamming commands")
            }

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
}, 360000);

// CONNECT BOT
client.connect();
