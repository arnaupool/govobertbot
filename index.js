var Telegram = require('node-telegram-bot-api');
var token = "702738997:AAHyBNRXNfzbPvEGheYQ2rLeUz4o48OE7NQ";
var bot = new Telegram(token, { polling: true });
var wrapper = require('node-telegram-keyboard-wrapper');

var userAnswer = [];
var isKeyboardOpen = false;
const keyboard = new wrapper.ReplyKeyboard();
keyboard
    .addRow("Test1",  "Test2")
    .addRow("Cerrar");

var questions = [
    {
        title: 'Primera pregunta de mi primera consulta',
        buttons: [
            [{ text: "Hola", callback_data: '1' }],
            [{ text: "Adios", callback_data: '2' }],
        ]
    }
];

bot.onText(/\/start/, (msg) => {
    startPoll(msg);
    startPoll.bind(this, msg);
    if (isKeyboardOpen) keyboard.close();
});

bot.onText(/\/restart/, (msg) => {
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, "Funcion no implementada");
});

bot.onText(/\/return/, (msg) => {
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, "Funcion no implementada");
});

bot.onText(/\/help/, (msg) => {
    showHelp(msg);
});

bot.onText(/\/test/, (msg) => {
    isKeyboardOpen = true;
    bot.sendMessage(msg.from.id, text = "Test", keyboard.open({ resize_keyboard: true }));
});

bot.on("polling_error", (err) => console.log(err));

bot.on("message", (msg) => {
    if (msg.text == "Cerrar" && isKeyboardOpen) {
        bot.sendMessage(msg.from.id, "Cerrando botones", keyboard.close());
        isKeyboardOpen != isKeyboardOpen;
    }
});

bot.on("callback_query", (msg) => {
    console.log(msg.from.id);
    var answer = msg.data;
    switch(answer) {
        case "1":
            bot.sendMessage(msg.from.id, "Hola, como estamos");
            break;
        case "2":
            bot.sendMessage(msg.from.id, "Venga hasta luego");
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
    bot.sendMessage(chat, text, options);
};

function showHelp(msg) {
    var text = "Puedes usar los siguientes comandos\n" +
                "/start - Empieza la encuesta\n" +
                "/restart - Reinicia la encuesta\n" +
                "/return - Vuelve a la pregunta anterior\n";
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, text);
}