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
            if (commandCounter === 6)
            {
                client.whisper(user['display-name'], "Last warning: you are sending commands too fast!");
            }
            else (commandCounter >= 7)
            {
                client.timeout(channel, user['display-name'], 60, "spamming commands")
            }

            // execute command
            Commands[parsedCommand](channel, user, message, self);
        }
    }
});

KatEvoBot: password: "oauth:vwohov7is1pou2rw9sylme9bra0z64"
VortexOfBot: password: "oauth:t7bfl2y4t5olizbo0usaywf9xfwn9n"