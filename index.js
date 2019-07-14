//#region Imports
var Telegram = require('node-telegram-bot-api');
var token = "702738997:AAHyBNRXNfzbPvEGheYQ2rLeUz4o48OE7NQ";
var bot = new Telegram(token, { polling: true });
var wrapper = require('node-telegram-keyboard-wrapper');
var poll = require('./pollCode.js');
//#endregion

var userAnswer = [];
var isKeyboardOpen = false;

//#region Variables navegar
const niveles = {
    INICIO         : 'INICIO',
    CIUDADANIA     : 'CIUDADANIA',
    RESPONSABILIDAD: 'RESPONSABILIDAD',
    TECNOLOGIA      : 'TECNOLOGIA',
    COMUNICACION   : 'COMUNICACION',
    GOBIERNO       : 'GOBIERNO',
    ATRAS          : 'Atrás'
}

var nivelActual = niveles.INICIO;

//#region Menus
const keyboard = new wrapper.ReplyKeyboard();
keyboard
    .addRow("CIUDADANIA", "RESPONSABILIDAD")
    .addRow("TECNOLOGIA" , "COMUNICACION")
    .addRow("GOBIERNO"  , "ENCUESTA");

var Opciones = [
    {
        title: 'CIUDADANIA',
        buttons: [
            [{ text: "Colaboración"               , callback_data: '1'  }],
            [{ text: "Cocreación"                 , callback_data: '2'  }],
            [{ text: "Empoderamiento ciudadano"   , callback_data: '3'  }],
            [{ text: "Presupuestos participativos", callback_data: '4'  }],
            [{ text: "Participación ciudadana"    , callback_data: '5'  }],
            [{ text: "Codiseño"                   , callback_data: '6'  }],
            [{ text: "Derecho de acceso"          , callback_data: '7'  }],
            [{ text: "Ciudadano inteligente"      , callback_data: '8'  }],
            [{ text: "Conciencia cívica"          , callback_data: '9'  }],
            [{ text: "Cultura participativa"      , callback_data: '10' }],
        ]
    },
    {
        title: 'RESPONSABILIDAD',
        buttons: [
            [{ text: "Rendición de cuentas"         , callback_data: '1'  }],
            [{ text: "Calidad de servicios públicos", callback_data: '2'  }],
            [{ text: "Innovación"                   , callback_data: '3'  }],
            [{ text: "Responsabilidad social"       , callback_data: '4'  }],
            [{ text: "Corresponsabilidad"           , callback_data: '5'  }],
            [{ text: "Integridad"                   , callback_data: '6'  }],
            [{ text: "Paredes de cristal"           , callback_data: '7'  }],
            [{ text: "Inclusividad"                 , callback_data: '8'  }],
            [{ text: "Confianza mútua"              , callback_data: '9'  }],
        ]
    },
    {
        title: 'TECNOLOGIA',
        buttons: [
            [{ text: "Datos abiertos"            , callback_data: '1'  }],
            [{ text: "Gobernanza inteligente"    , callback_data: '2'  }],
            [{ text: "Smart city"                , callback_data: '3'  }],
            [{ text: "Sociedad red"              , callback_data: '4'  }],
            [{ text: "Portales de transparencia" , callback_data: '5'  }],
            [{ text: "Portales de datos abiertos", callback_data: '6'  }],
            [{ text: "Laboratorios de innovación", callback_data: '7'  }]
        ]
    },
    {
        title: 'COMUNICACIÓN',
        buttons: [
            [{ text: "Fake news"          , callback_data: '1'  }],
            [{ text: "Periodismo de datos", callback_data: '2'  }],
            [{ text: "Publicidad activa"  , callback_data: '3'  }],
            [{ text: "Transparencia"      , callback_data: '4'  }]
        ]
    },
    {
        title: 'GOBIERNO',
        buttons: [
            [{ text: "Gobierno abierto"          , callback_data: '1'  }],
            [{ text: "Buen gobierno"             , callback_data: '2'  }],
            [{ text: "Buena gobernanza"          , callback_data: '3'  }],
            [{ text: "Consejo de transparencia"  , callback_data: '4'  }],
            [{ text: "Políticas públicas"        , callback_data: '5'  }]
        ]
    }
];
//#endregion

//#region Commands
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
//#endregion

//#region Navegacion
bot.on("message", (msg) => {
    console.log(msg.text);
    switch (msg.text) {
        case niveles.CIUDADANIA:
            nivelActual = niveles.CIUDADANIA
            startPoll(msg, 0);
            startPoll.bind(this, msg);
            break;
        case niveles.RESPONSABILIDAD:
            nivelActual = niveles.RESPONSABILIDAD
            startPoll(msg, 1);
            startPoll.bind(this, msg);
            break;
        case niveles.TECNOLOGIA:
            nivelActual = niveles.TECNOLOGIA
            startPoll(msg, 2);
            startPoll.bind(this, msg);
            break;
        case niveles.COMUNICACION:
            nivelActual = niveles.COMUNICACION
            startPoll(msg, 3);
            startPoll.bind(this, msg);
            break;
        case niveles.GOBIERNO:
            nivelActual = niveles.GOBIERNO
            startPoll(msg, 4);
            startPoll.bind(this, msg);
            break;
    }
});

function handleCiudadania(msg) {
    var answer = msg.data;
    switch(answer) {
        case '1':
            bot.sendMessage(msg.from.id, '1');
            break;
        case '2':
            bot.sendMessage(msg.from.id, '2');
            break;
        case '3':
            bot.sendMessage(msg.from.id, '3');
            break;
        case '4':
            bot.sendMessage(msg.from.id, '4');
            break;
        case '5':
            bot.sendMessage(msg.from.id, '5');
            break;
        case '6':
            bot.sendMessage(msg.from.id, '6');
            break;
        case '7':
            bot.sendMessage(msg.from.id, '7');
            break;
        case '8':
            bot.sendMessage(msg.from.id, '8');
            break;
        case '9':
            bot.sendMessage(msg.from.id, '9');
            break;
        case '10':
            bot.sendMessage(msg.from.id, '10');
            break;
    }
}

function handleResponsabiliadad(msg) {
    var answer = msg.data;
    switch(answer) {
        case '1':
            bot.sendMessage(msg.from.id, '1');
            break;
        case '2':
            bot.sendMessage(msg.from.id, '2');
            break;
        case '3':
            bot.sendMessage(msg.from.id, '3');
            break;
        case '4':
            bot.sendMessage(msg.from.id, '4');
            break;
        case '5':
            bot.sendMessage(msg.from.id, '5');
            break;
        case '6':
            bot.sendMessage(msg.from.id, '6');
            break;
        case '7':
            bot.sendMessage(msg.from.id, '7');
            break;
        case '8':
            bot.sendMessage(msg.from.id, '8');
            break;
        case '9':
            bot.sendMessage(msg.from.id, '9');
            break;
    }
}

function handleTeconologia(msg) {
    var answer = msg.data;
    switch(answer) {
        case '1':
            bot.sendMessage(msg.from.id, '1');
            break;
        case '2':
            bot.sendMessage(msg.from.id, '2');
            break;
        case '3':
            bot.sendMessage(msg.from.id, '3');
            break;
        case '4':
            bot.sendMessage(msg.from.id, '4');
            break;
        case '5':
            bot.sendMessage(msg.from.id, '5');
            break;
        case '6':
            bot.sendMessage(msg.from.id, '6');
            break;
        case '7':
            bot.sendMessage(msg.from.id, '7');
            break;
    }
}

function handleComunicacion(msg) {
    var answer = msg.data;
    switch(answer) {
        case '1':
            bot.sendMessage(msg.from.id, '1');
            break;
        case '2':
            bot.sendMessage(msg.from.id, '2');
            break;
        case '3':
            bot.sendMessage(msg.from.id, '3');
            break;
        case '4':
            bot.sendMessage(msg.from.id, '4');
            break;
    }
}

function handleGobierno(msg) {
    var answer = msg.data;
    switch(answer) {
        case '1':
            bot.sendMessage(msg.from.id, '1');
            break;
        case '2':
            bot.sendMessage(msg.from.id, '2');
            break;
        case '3':
            bot.sendMessage(msg.from.id, '3');
            break;
        case '4':
            bot.sendMessage(msg.from.id, '4');
            break;
        case '5':
            bot.sendMessage(msg.from.id, '5');
            break;
    }
}
//#endregion

bot.on("polling_error", (err) => console.log(err));

bot.on("callback_query", (msg) => {
    console.log(msg.from.id);
    switch(nivelActual) {
        case niveles.CIUDADANIA:
            handleCiudadania(msg);
            break;
        case niveles.RESPONSABILIDAD:
            handleResponsabiliadad(msg);
            break;
        case niveles.TECNOLOGIA:
            handleTeconologia(msg);
            break;
        case niveles.COMUNICACION:
            handleComunicacion(msg);
            break;
        case niveles.GOBIERNO:
            handleGobierno(msg);
            break;
    }
})

function startPoll(msg, index) {
    var arr = Opciones[index];
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
};