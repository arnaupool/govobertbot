var Telegram = require('node-telegram-bot-api');
var token = "702738997:AAHyBNRXNfzbPvEGheYQ2rLeUz4o48OE7NQ";
var telegramApi = new Telegram(token, { polling: true });
var wrapper = require('node-telegram-keyboard-wrapper');

var userAnswer = [];

var questions = [
    {
        title: 'Primera pregunta de mi primera consulta',
        buttons: [
            [{ text: "Hola", callback_data: '1' }],
            [{ text: "Adios", callback_data: '2' }],
        ]
    }
]

telegramApi.onText(/\/start/, (msg) => {
    startPoll(msg);
    startPoll.bind(this, msg);
});

telegramApi.onText(/\/restart/, (msg) => {
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    telegramApi.sendMessage(chat, "Funcion no implementada");
});

telegramApi.onText(/\/return/, (msg) => {
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    telegramApi.sendMessage(chat, "Funcion no implementada");
});

telegramApi.onText(/\/help/, (msg) => {
    showHelp(msg);
});

telegramApi.onText(/\/test/, (msg) => {
    keyboard = new wrapper.ReplyKeyboard();
    keyboard.addRow("Test1",  "Test2");
    keyboard.addRow("Test3");
    telegramApi.sendMessage(msg.from.id, text = "Test", keyboard.open({ resize_keyboard: true }));
});

telegramApi.on("polling_error", (err) => console.log(err));

telegramApi.on("callback_query", (msg) => {
    console.log(msg.from.id);
    var answer = msg.data;
    switch(answer) {
        case "1":
            telegramApi.sendMessage(msg.from.id, "Hola, como estamos");
            break;
        case "2":
            telegramApi.sendMessage(msg.from.id, "Venga hasta luego");
            break;
    }
})

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

function showHelp(msg) {
    var text = "Puedes usar los siguientes comandos\n" +
                "/start - Empieza la encuesta\n" +
                "/restart - Reinicia la encuesta\n" +
                "/return - Vuelve a la pregunta anterior\n";
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    telegramApi.sendMessage(chat, text);
}