var Telegram = require('node-telegram-bot-api');
var token = "702738997:AAHyBNRXNfzbPvEGheYQ2rLeUz4o48OE7NQ"
var telegramApi = new Telegram(token, { polling: true });

var userAnswer = [];

var questions = [
    {
        title: 'Primera pregunta de mi primera consulta',
        buttons: [
            [{ text: "Hola", callback_data: 'hola' }],
            [{ text: "Adios", callback_data: 'adios' }],
        ]
    }
]

function startPoll(msg) {
    var arr = questions[0];
    var text = arr.title;
    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: arr.buttons,
            parse_mode: 'Markdown'
        })
    }
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    telegramApi.sendMessage(chat, text, options);
};

telegramApi.on("text", (msg) => {
    startPoll(msg);
    startPoll.bind(this, msg);
});

telegramApi.on("callback_query", (msg) => {
    console.log(msg.from.id);
    var answer = msg.data;
    switch(answer) {
        case "":
            telegramApi.sendMessage(msg.from.id, "Hola, como estamos");
            break;
        case "":
            telegramApi.sendMessage(msg.from.id, "Venga hasta luego");
            break;
    }
})