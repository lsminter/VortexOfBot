// display channel message every 10 minutes
setInterval(function() {
    client.action(channelName, intervalMessages[interMessagesCounter]);
    if (interMessagesCounter < (intervalMessages.length - 1))
    {
        interMessagesCounter++;
    } else {
        interMessagesCounter = 0;
    }
}, 1200000);