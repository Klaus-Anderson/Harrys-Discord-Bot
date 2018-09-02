var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings.
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`


    if (message.substring(0, 1) == '&') {
        var returnMessage = '';
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        switch(cmd) {
            case 'command':
            case 'commands':
                returnMessage = "<@!" + userID + "> Current known commands:" +
                    "\n&roll: generate a random whole number with and given ceiling" +
                    "\nExample\n&roll 20";
            break;
            case 'roll':
                var sidesString = args[1];
                if(typeof(sidesString) === 'undefined'){
                    returnMessage = "<@!" + userID + 
                    "> You didn't roll anything... what a tease!";
                    break;
                }
                if(sidesString.substring(0,1)=='d' || sidesString.substring(0,1)=='D'){
                    sidesString = sidesString.substring(1, sidesString.length -1);
                }
                if(!isNaN(sidesString)){
                    var sidesInt = parseFloat(sidesString);
                    if(sidesInt > 0 && Number.isInteger(sidesInt)){
                        returnMessage = "<@!" + userID + "> you rolled " + 
                        Math.floor((Math.random() * sidesInt) + 1); 
                    } else {
                        returnMessage = "<@!" + userID + "> you have recieved an F in " +
                            "Real Analysis. Your Math degree is delayed by 1 semester."
                    }
                } else {
                    returnMessage = "<@!" + userID + 
                    "> You rolled the dice so hard they fell of the table." +
                        "\nDon\'t fuck it up next time.";
                }
            break;
            default:
                returnMessage =  "<@!" + userID + "> Command not recognized. "+
                    "Try it harder next time mister."
            break;
        }
        returnMessage = returnMessage + "\n\n*Use &command to learn how to" +
            " make me an obedient little bot.*"
            
            // Just add any case commands if you want to..
        bot.sendMessage({
                to: channelID,
                message: returnMessage
        });
    }
});