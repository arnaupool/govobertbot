var Telegram = require('node-telegram-bot-api');
var wrapper = require('node-telegram-keyboard-wrapper');
export var pollAnswers = [];

const keyboard_1 = new wrapper.ReplyKeyboard();
keyboard_1
    .addRow("VARIAS VECES AL DÍA", "SÓLO UNA VEZ AL DÍA")
    .addRow("MENOS DE UNA VEZ AL DÍA", "NO LA UTILIZO");

exports.pollFunction = function(id) {
    pollAnswers.push(id);
    pollAnswers.push(currentTime());
    


}

function currentTime() {
    today = new Date();
    return current = today.getHours() + ":" + today.getMinutes();
}
