//#region Imports
var Telegram = require('node-telegram-bot-api');
var token = "702738997:AAHyBNRXNfzbPvEGheYQ2rLeUz4o48OE7NQ";
var bot = new Telegram(token, { polling: true });
var wrapper = require('node-telegram-keyboard-wrapper');
//#endregion

//mongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
//crear db
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("botdb");
    dbo.createCollection("consultas", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  }); 

var userAnswer = [];
var isKeyboardOpen = false;

//#region Variables navegar
const niveles = {
    INICIO          : 'INICIO',
    CIUDADANIA      : 'CIUDADANIA',
    RESPONSABILIDAD : 'RESPONSABILIDAD',
    TECNOLOGIA      : 'TECNOLOGIA',
    COMUNICACION    : 'COMUNICACION',
    GOBIERNO        : 'GOBIERNO',
    ODS             : 'ODS',
    ATRAS           : 'Atrás'
}

var nivelActual = niveles.INICIO;

//#region Menus
const keyboard = new wrapper.ReplyKeyboard();
keyboard
    .addRow("CIUDADANÍA", "RESPONSABILIDAD")
    .addRow("TECNOLOGIA" , "COMUNICACIÓN")
    .addRow("GOBIERNO"  , "ODS");

var Opciones = [
    {
        title: 'CIUDADANÍA',
        buttons: [
            [{ text: "Colaboración"               , callback_data: '0.1'  }],
            [{ text: "Cocreación"                 , callback_data: '0.2'  }],
            [{ text: "Empoderamiento ciudadano"   , callback_data: '0.3'  }],
            [{ text: "Presupuestos participativos", callback_data: '0.4'  }],
            [{ text: "Participación ciudadana"    , callback_data: '0.5'  }],
            [{ text: "Codiseño"                   , callback_data: '0.6'  }],
            [{ text: "Derecho de acceso"          , callback_data: '0.7'  }],
            [{ text: "Ciudadano inteligente"      , callback_data: '0.8'  }],
            [{ text: "Conciencia cívica"          , callback_data: '0.9'  }],
            [{ text: "Cultura participativa"      , callback_data: '0.10' }],
        ]
    },
    {
        title: 'RESPONSABILIDAD',
        buttons: [
            [{ text: "Rendición de cuentas"         , callback_data: '1.1'  }],
            [{ text: "Calidad de servicios públicos", callback_data: '1.2'  }],
            [{ text: "Innovación"                   , callback_data: '1.3'  }],
            [{ text: "Responsabilidad social"       , callback_data: '1.4'  }],
            [{ text: "Corresponsabilidad"           , callback_data: '1.5'  }],
            [{ text: "Integridad"                   , callback_data: '1.6'  }],
            [{ text: "Paredes de cristal"           , callback_data: '1.7'  }],
            [{ text: "Inclusividad"                 , callback_data: '1.8'  }],
            [{ text: "Confianza mutua"              , callback_data: '1.9'  }],
        ]
    },
    {
        title: 'TECNOLOGÍA',
        buttons: [
            [{ text: "Datos abiertos"            , callback_data: '2.1'  }],
            [{ text: "Gobernanza inteligente"    , callback_data: '2.2'  }],
            [{ text: "Smart city"                , callback_data: '2.3'  }],
            [{ text: "Sociedad red"              , callback_data: '2.4'  }],
            [{ text: "Portales de transparencia" , callback_data: '2.5'  }],
            [{ text: "Portales de datos abiertos", callback_data: '2.6'  }],
            [{ text: "Laboratorios de innovación", callback_data: '2.7'  }]
        ]
    },
    {
        title: 'COMUNICACIÓN',
        buttons: [
            [{ text: "Fake news"          , callback_data: '3.1'  }],
            [{ text: "Periodismo de datos", callback_data: '3.2'  }],
            [{ text: "Publicidad activa"  , callback_data: '3.3'  }],
            [{ text: "Transparencia"      , callback_data: '3.4'  }]
        ]
    },
    {
        title: 'GOBIERNO',
        buttons: [
            [{ text: "Gobierno abierto"          , callback_data: '4.1'  }],
            [{ text: "Buen gobierno"             , callback_data: '4.2'  }],
            [{ text: "Buena gobernanza"          , callback_data: '4.3'  }],
            [{ text: "Consejo de transparencia"  , callback_data: '4.4'  }],
            [{ text: "Políticas públicas"        , callback_data: '4.5'  }]
        ]
    }
];
//#endregion

//#region Commands
bot.onText(/\/test/, (msg) => {
    startPoll(msg);
    startPoll.bind(this, msg);
    if (isKeyboardOpen) keyboard.close();
});

bot.onText(/\/restart/, (msg) => {
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, "Función no implementada");
});

bot.onText(/\/return/, (msg) => {
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, "Función no implementada");
});

bot.onText(/\/help/, (msg) => {
    showHelp(msg);
});

bot.onText(/\/start/, (msg) => {
    isKeyboardOpen = true;
    bot.sendMessage(msg.from.id, 
    text = "Benvingut al bot del projecte \n 'T'ho conte?' per a la divulgació i educació en termes de govern obert. \n Qué vols que et conte? ;)",
    keyboard.open({ resize_keyboard: true })
    );
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
        default: break; //Aquí podría ir un mensaje de "No te he entendido", porque el default es para cuando el usuario envíe cualquier otro mensaje
    }
});

function handleCiudadania(msg) {
    var answer = msg.data;
    var term;
    switch(answer) {
        case '0.1':
            bot.sendMessage(msg.from.id, 'Colaboración:');
            term = 'Colaboración';
            bot.sendMessage(msg.from.id, 'Es la creación de nuevos espacios de encuentro, diálogo y trabajo donde participan todas los gobiernos y administraciones públicas, incluyendo a la ciudadanía.');
            break;
        case '0.2':
            bot.sendMessage(msg.from.id, 'Cocreación:');
            term = 'Cocreación';
            bot.sendMessage(msg.from.id, 'Se trata de poner en práctica la colaboración mediante metodologías que permiten caminar hacia soluciones basadas en la innovación para problemas sociales reales.');
            break;
        case '0.3':
            bot.sendMessage(msg.from.id, 'Empoderamiento ciudadano:');
            term = 'Empoderamiento ciudadano';
            bot.sendMessage(msg.from.id, 'Fomenta la participación activa de los ciudadanos en los procesos de gobierno y la toma de decisiones para impulsar cambios positivos en sus comunidades.');
            break;
        case '0.4':
            bot.sendMessage(msg.from.id, 'Presupuestos participativos:');
            term = 'Presupuestos participativos';
            bot.sendMessage(msg.from.id, 'Participación de la ciudadanía mediante la colaboración en la elaboración, administración y ejecución de los recursos de su ciudad decidiendo sobre el destino de parte de dichos recursos municipales.');
            break;
        case '0.5':
            bot.sendMessage(msg.from.id, 'Participación ciudadana:');
            term = 'Participación ciudadana';
            bot.sendMessage(msg.from.id, 'Conjunto de maneras que tiene la población para acceder a las decisiones que tome el gobierno, de manera independiente, sin necesidad de formar parte de la administración pública o del partido político.');
            break;
        case '0.6':
            bot.sendMessage(msg.from.id, 'Codiseño:');
            term = 'Codiseño';
            bot.sendMessage(msg.from.id, 'Incorporar en el proceso de diseño a las personas implicadas o que utilizarán el producto o servicio para que éste responda a sus necesidades y sea más útil.');
            break;
        case '0.7':
            bot.sendMessage(msg.from.id, 'Derecho de acceso:');
            term = 'Derecho de acceso';
            bot.sendMessage(msg.from.id, 'Derecho que tiene toda persona a obtener información sobre el tratamiento de sus datos personales.');
            break;
        case '0.8':
            bot.sendMessage(msg.from.id, 'Ciudadano Inteligente:');
            term = 'Ciudadano Inteligente';
            bot.sendMessage(msg.from.id, 'Herramienta que tiene el ciudadano para fortalecer la democracia.');
            break;
        case '0.9':
            bot.sendMessage(msg.from.id, 'Conciencia cívica:');
            term = 'Conciencia cívica';
            bot.sendMessage(msg.from.id, 'Es la que nos indica cómo debemos comportarnos los ciudadanos para la consolidación de una democracia real y participativa donde se reconozca la pluralidad la tolerancia y el reconocimiento de la dignidad individual.');
            break;
        case '0.10':
            bot.sendMessage(msg.from.id, 'Cultura participativa:');
            term = 'Cultura participativa';
            bot.sendMessage(msg.from.id, 'Cultura destinada al desarrollo de las habilidades de expresión y comunicación de opiniones e ideas propias y el compromiso cívico del ciudadano, asumiendo responsabilidades.');
            break; 
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        var myobj = { userid: msg.from.id , concept: "ciudadania", termino: term };
        dbo.collection("consultas").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      }); 
}

function handleResponsabilidad(msg) {
    var answer = msg.data;
    switch(answer) {
        case '1.1':
            bot.sendMessage(msg.from.id, 'Rendición de cuentas:');
            bot.sendMessage(msg.from.id, 'Obligación de los gobiernos y administraciones públicas a dar explicaciones sobre sus acciones y asumir la responsabilidad de las decisiones que se adoptan.');
            break;
        case '1.2':
            bot.sendMessage(msg.from.id, 'Calidad de servicios públicos:');
            bot.sendMessage(msg.from.id, 'Recurso del Estado para compensar las desigualdades de la población para que el conjunto de ciudadanos reciba los mismos servicios.');
            break;
        case '1.3':
            bot.sendMessage(msg.from.id, 'Innovación:');
            bot.sendMessage(msg.from.id, 'Ser capaz de desarrollar nuevas maneras de hacer las cosas, al margen de cómo se han hecho en el pasado, y explorar formas alternativas de pensar.');
            break;
        case '1.4':
            bot.sendMessage(msg.from.id, 'Responsabilidad social:');
            bot.sendMessage(msg.from.id, 'Compromiso de la ciudadanía y administraciones para tomar decisiones positivas para la sociedad.');
            break;
        case '1.5':
            bot.sendMessage(msg.from.id, 'Corresponsabilidad:');
            bot.sendMessage(msg.from.id, 'Responsabilidad compartida entre dos o más personas u organizaciones, para buscar soluciones a los problemas.');
            break;
        case '1.6':
            bot.sendMessage(msg.from.id, 'Integridad:');
            bot.sendMessage(msg.from.id, 'Actuar en todo momento con rectitud, lealtad, honradez, imparcialidad y buena fe.');
            break;
        case '1.7':
            bot.sendMessage(msg.from.id, 'Paredes de cristal:');
            bot.sendMessage(msg.from.id, 'Metáfora que explica el reto de implantar una administración pública totalmente transparente en la que la ciudadanía pueda conocer qué hacen los gobierno, así como los actos y las decisiones que se toman desde los poderes públicos.');
            break;
        case '1.8':
            bot.sendMessage(msg.from.id, 'Inclusividad:');
            bot.sendMessage(msg.from.id, 'Rechazar aquellas acciones que suponen excluir a grupos de personas por razones socio-económicas, de sexo, etnia, religión, ideas políticas o por tener algún tipo de discapacidad física o intelectual.');
            break;
        case '1.9':
            bot.sendMessage(msg.from.id, 'Confianza mutua:');
            bot.sendMessage(msg.from.id, 'Creer en los gobiernos y administraciones públicas, de la misma manera que ellos también tienen que creer en los ciudadanos y ciudadanas.');
            break;
    }
}

function handleTecnologia(msg) {
    var answer = msg.data;
    switch(answer) {
        case '2.1':
            bot.sendMessage(msg.from.id, 'Datos abiertos:');
            bot.sendMessage(msg.from.id, 'Los datos abiertos son aquellos datos de los que dispone la Administración, en formatos digitales, estandarizados y abiertos, que pueden ser utilizados, reutilizados y redistribuidos libremente por cualquier persona.');
            break;
        case '2.2':
            bot.sendMessage(msg.from.id, 'Gobernanza inteligente:');
            bot.sendMessage(msg.from.id, 'Nueva forma de gobernar con un conjunto de gobiernos y administraciones públicas que utilizan de forma sofisticada las tecnologías de información y comunicación para interconectar e integrar información, procesos, instituciones e infraestructuras físicas para servir mejor a sus comunidades.');
            break;
        case '2.3':
            bot.sendMessage(msg.from.id, 'Smart City:');
            bot.sendMessage(msg.from.id, 'Es una "ciudad inteligente" capaz de utilizar la tecnología de la información y comunicación (TIC) con el objetivo de crear mejores infraestructuras para la ciudadanía.');
            break;
        case '2.4':
            bot.sendMessage(msg.from.id, 'Sociedad red:');
            bot.sendMessage(msg.from.id, 'Es una sociedad basada en redes de comunicación y digitalizada en todos los aspectos de la vida, la política, la economía y las relaciones personales.');
            break;
        case '2.5':
            bot.sendMessage(msg.from.id, 'Portales de transparencia:');
            bot.sendMessage(msg.from.id, 'Son plataformas digitales que son el instrumento básico y general para facilitar a la ciudadanía la información de forma integrada del sector público.');
            break;
        case '2.6':
            bot.sendMessage(msg.from.id, 'Portales de datos abiertos:');
            bot.sendMessage(msg.from.id, 'Son plataformas digitales que sirven para almacenar, compartir, conectar y visualizar bases de datos. Son el punto de acceso a la estrategia de una organización por abrir sus datos y un punto de encuentro entre la organización, las empresas, los ciudadanos, los desarrolladores informáticos y los periodistas.');
            break;
        case '2.7':
            bot.sendMessage(msg.from.id, 'Laboratorios de innovación:');
            bot.sendMessage(msg.from.id, 'Son espacios para experimentar con nuevas formas de generar valor público, modernizar la relación con la ciudadanía, aportar nuevos canales de participación y colaboración.');
            break;
    }
}

function handleComunicacion(msg) {
    var answer = msg.data;
    switch(answer) {
        case '3.1':
            bot.sendMessage(msg.from.id, 'Fake news:');
            bot.sendMessage(msg.from.id, 'Toda aquella información fabricada y publicada a propósito para engañar e inducir a las personas a creer mentiras o poner en duda hechos verificables.');
            break;
        case '3.2':
            bot.sendMessage(msg.from.id, 'Periodismo de datos:');
            bot.sendMessage(msg.from.id, 'Es una manera de elaborar noticias de una forma clara y comprensible basándose en datos abiertos.');
            break;
        case '3.3':
            bot.sendMessage(msg.from.id, 'Publicidad activa:');
            bot.sendMessage(msg.from.id, 'La publicidad activa es la obligación de publicar ciertas informaciones y datos en los portales de transparencia de las administraciones públicas.');
            break;
        case '3.4':
            bot.sendMessage(msg.from.id, 'Transparencia:');
            bot.sendMessage(msg.from.id, 'La transparencia compromete a las AAPP a informar a la ciudadanía los resultados de la evaluación de los servicios que prestan.');
            break;
    }
}

function handleGobierno(msg) {
    var answer = msg.data;
    switch(answer) {
        case '4.1':
            bot.sendMessage(msg.from.id, 'Gobierno abierto:');
            bot.sendMessage(msg.from.id, 'Tiene como objetivo que la ciudadanía colabore en la creación y mejora de servicios públicos, la consolidación de la transparencia y la rendición de cuentas.');
            break;
        case '4.2':
            bot.sendMessage(msg.from.id, 'Buen Gobierno:');
            bot.sendMessage(msg.from.id, 'Forma de ejercicio del poder caracterizada por la eficiencia, la transparencia, la rendición de cuentas, la participación ciudadana y el estado de derecho, que manifiesta la decisión del gobierno de utilizar los recursos disponibles a favor del desarrollo económico y social.');
            break;
        case '4.3':
            bot.sendMessage(msg.from.id, 'Buena Gobernanza:');
            bot.sendMessage(msg.from.id, 'Promueve la equidad, la participación, el pluralismo, la transparencia, la responsabilidad y el estado de derecho, de modo que sea efectivo, eficiente y duradero. Los principios son los que persiguen mejorar los procesos de toma de decisiones para fortalecer la democracia y contribuir el desarrollo económico y social.');
            break;
        case '4.4':
            bot.sendMessage(msg.from.id, 'Consejo de transparencia:');
            bot.sendMessage(msg.from.id, 'Organismo encargado de velar por la transparencia de la actividad pública y garantizar el derecho de acceso a la información que tienen los ciudadanos.');
            break;
        case '4.5':
            bot.sendMessage(msg.from.id, 'Políticas públicas:');
            bot.sendMessage(msg.from.id, 'Proyectos o actividades que un estado diseña y gestiona a través de un Gobierno y una Administración Pública para satisfacer las necesidades de los ciudadanos.');
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
            handleResponsabilidad(msg);
            break;
        case niveles.TECNOLOGIA:
            handleTecnologia(msg);
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
    var text = "Pots utilitzar els seguents comandos\n" +
                "/start - Inicio del bot\n" +
                "/restart - Reinicia la encuesta\n" +
                "/return - Vuelve a la pregunta anterior\n";
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, text);
};

function newPoll() {
    userAnswer.push(id);
    userAnswer.push(todayTime());

    
};

function todayTime() {
    today = new Date();
    return current = today.getHours() + ":" + today.getMinutes();
};