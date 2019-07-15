//#region Imports
var Telegram = require('node-telegram-bot-api');
var token = "702738997:AAHyBNRXNfzbPvEGheYQ2rLeUz4o48OE7NQ";
var bot = new Telegram(token, { polling: true });
var wrapper = require('node-telegram-keyboard-wrapper');
var generatecsv = require('./exportCSV');
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
    INICIO          : 'INICI',
    CIUDADANIA      : 'CIUTADANIA',
    RESPONSABILIDAD : 'RESPONSABILITAT',
    TECNOLOGIA      : 'TECNOLOGIA',
    COMUNICACION    : 'COMUNICACIÓ',
    GOBIERNO        : 'GOVERN',
    ODS             : 'ODS',
    ATRAS           : 'Anterior'
}

var nivelActual = niveles.INICIO;

//#region Menus
const keyboard = new wrapper.ReplyKeyboard();
keyboard
    .addRow("CIUTADANIA", "RESPONSABILITAT")
    .addRow("TECNOLOGIA" , "COMUNICACIÓ")
    .addRow("GOVERN"  , "ODS");

var Opciones = [
    {
        title: 'CIUTADANIA',
        buttons: [
            [{ text: "Col·laboració"                        , callback_data: '0.1'  }],
            [{ text: "Cocreació"                            , callback_data: '0.2'  }],
            [{ text: "Apoderament ciutadà"                  , callback_data: '0.3'  }],
            [{ text: "Compromís ciutadà"                    , callback_data: '0.4'  }],
            [{ text: "Pressupostos participatius"           , callback_data: '0.5'  }],
            [{ text: "Participació ciutadana"               , callback_data: '0.6'  }],
            [{ text: "Dret d'accés a la informació pública" , callback_data: '0.7'  }],
            [{ text: "Ciutadania Intel·ligent"              , callback_data: '0.8'  }],
            [{ text: "Consciència cívica"                   , callback_data: '0.9'  }],
            [{ text: "Cultura participativa"                , callback_data: '0.10' }],
        ]
    },
    {
        title: 'RESPONSABILITAT',
        buttons: [
            [{ text: "Rendició de comptes"          , callback_data: '1.1'  }],
            [{ text: "Qualitat de serveis públics"  , callback_data: '1.2'  }],
            [{ text: "Innovació"                    , callback_data: '1.3'  }],
            [{ text: "Responsabilitat social"       , callback_data: '1.4'  }],
            [{ text: "Corresponsabilitat"           , callback_data: '1.5'  }],
            [{ text: "Integritat"                   , callback_data: '1.6'  }],
            [{ text: "Parets de cristall"           , callback_data: '1.7'  }],
            [{ text: "Inclusivitat"                 , callback_data: '1.8'  }],
            [{ text: "Confiança mútua"              , callback_data: '1.9'  }],
        ]
    },
    {
        title: 'TECNOLOGIA',
        buttons: [
            [{ text: "Dades obertes"             , callback_data: '2.1'  }],
            [{ text: "Governança intel·ligent"   , callback_data: '2.2'  }],
            [{ text: "Bretxa digital"            , callback_data: '2.3'  }],
            [{ text: "Smart City"                , callback_data: '2.4'  }],
            [{ text: "Portals de transparència"  , callback_data: '2.5'  }],
            [{ text: "Portals de dades obertes"  , callback_data: '2.6'  }],
            [{ text: "Laboratoris d'innovació"   , callback_data: '2.7'  }]
        ]
    },
    {
        title: 'COMUNICACIÓ',
        buttons: [
            [{ text: "Fake news"          , callback_data: '3.1'  }],
            [{ text: "Periodisme de dades", callback_data: '3.2'  }],
            [{ text: "Publicitat activa"  , callback_data: '3.3'  }],
            [{ text: "Transparència"      , callback_data: '3.4'  }]
        ]
    },
    {
        title: 'GOVERN',
        buttons: [
            [{ text: "Govern obert"              , callback_data: '4.1'  }],
            [{ text: "Consell de transparència"  , callback_data: '4.2'  }],
            [{ text: "Polítiques públiques"      , callback_data: '4.3'  }]
        ]
    }
];
//#endregion

//#region Commands
bot.onText(/\/test/, (msg) => {
    generatecsv.export2csv();
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
    text = "Benvingut al bot del projecte \n 'T'ho conte?' \n per a la divulgació i educació en termes de govern obert. \n Que vols que et conte? ;)",
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
            bot.sendMessage(msg.from.id, 'Col·laboració:');
            term = 'Col·laboració';
            bot.sendMessage(msg.from.id, 'Creació de nous espais de trobada, diàleg i treball on participen tots els agents de la societat (administracions, governs, societat civil, empreses, associacions, ONGD, etc.) per a actuar sobre problemes concrets d\'índole general.');
            break;
        case '0.2':
            bot.sendMessage(msg.from.id, 'Cocreació:');
            term = 'Cocreació';
            bot.sendMessage(msg.from.id, 'És la posada en pràctica de la col·laboració. Actua sobre problemes concrets mitjançant diferents formes de participació per a analitzar, intervindre i generar solucions de manera col·lectiva i incorporant a les persones o col·lectius implicats sempre que siga possible. Impulsa la innovació oberta.');
            break;
        case '0.3':
            bot.sendMessage(msg.from.id, 'Apoderament ciutadà:');
            term = 'Apoderament ciutadà';
            bot.sendMessage(msg.from.id, 'Els ciutadans i ciutadanes adquireixen la consciència i el control de que poden influir sobre el que afecta a la seua qualitat de vida a tots els nivells.');
            break;
        case '0.4':
            bot.sendMessage(msg.from.id, 'Compromís ciutadà:');
            term = 'Compromís ciutadà';
            bot.sendMessage(msg.from.id, 'Està promogut pels governs per a què la ciutadania en processos formals, prenga part de les decisions polítiques.');
            break;
        case '0.5':
            bot.sendMessage(msg.from.id, 'Pressupostos participatius:');
            term = 'Pressupostos participatius';
            bot.sendMessage(msg.from.id, 'Participació dels veïns i les veïnes en els pressupostos del seu municipi/barri per a destinar part dels diners als projectes de major interés per a les persones de la ciutat/barri.');
            break;
        case '0.6':
            bot.sendMessage(msg.from.id, 'Participació ciutadana:');
            term = 'Participació ciutadana';
            bot.sendMessage(msg.from.id, 'Manera que tenen els ciutadans i les ciutadanes per a participar en la presa decisions del govern i en el disseny de serveis públics.');
            break;
        case '0.7':
            bot.sendMessage(msg.from.id, 'Dret d\'accés a la informació pública:');
            term = 'Dret d\'accés a la informació pública';
            bot.sendMessage(msg.from.id, 'Totes les persones tenen dret i poden sol·licitar la informació que consideren del seu interés generada per les administracions públiques, llevat que entren en conflicte amb altres lleis tals com la protecció de dades o la seguretat nacional principalment.');
            break;
        case '0.8': 
            bot.sendMessage(msg.from.id, 'Ciutadania Intel·ligent:');
            term = 'Ciutadania Intel·ligent';
            bot.sendMessage(msg.from.id, 'Ciutadania que utilitza la intel·ligència artificial per a prendre les seues pròpies decisions dia a dia i a llarg termini.');
            break;
        case '0.9':
            bot.sendMessage(msg.from.id, 'Consciència cívica:');
            term = 'Consciència cívica';
            bot.sendMessage(msg.from.id, 'Consciència que ens indica com hem de comportar-nos les ciutadanes i els ciutadans per a enfortir una democràcia participativa que reconega la pluralitat, la tolerància i el reconeixement de la dignitat individual.');
            break;
        case '0.10':
            bot.sendMessage(msg.from.id, 'Cultura participativa:');
            term = 'Cultura participativa';
            bot.sendMessage(msg.from.id, 'Cultura destinada al desenvolupament de les habilitats d\'expressió i comunicació d\'opinions i idees pròpies i al compromís cívic de la ciutadania, assumint responsabilitats.');
            break; 
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, d: getUTCDate(), m: getMonth(), a: getFullYear(), hora: getHours(), min: getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + "ha consultat:" + term);
          db.close();
        });
      }); 
}

function handleResponsabilidad(msg) {
    var answer = msg.data;
    var term;
    switch(answer) {
        case '1.1':
            bot.sendMessage(msg.from.id, 'Rendició de comptes:');
            term = 'Rendició de comptes';
            bot.sendMessage(msg.from.id, 'Obligació dels governs i administracions públiques a donar explicacions sobre les seues accions i assumir la responsabilitat de les decisions que adopten.');
            break;
        case '1.2':
            bot.sendMessage(msg.from.id, 'Qualitat de serveis públics:');
            term = 'Qualitat de serveis públics';
            bot.sendMessage(msg.from.id, 'Les administracions públiques han d\'assegurar a la ciutadania una contínua millora dels procediments, serveis i prestacions públiques tenint en compte els recursos disponibles i les polítiques públiques.');
            break;
        case '1.3':
            bot.sendMessage(msg.from.id, 'Innovació:');
            term = 'Innovació';
            bot.sendMessage(msg.from.id, 'Desenvolupament de noves maneres de fer les coses, al marge de com s\'han fet en el passat, i explorar formes alternatives de pensar.');
            break;
        case '1.4':
            bot.sendMessage(msg.from.id, 'Responsabilidad social:');
            term = 'Responsabilidad social';
            bot.sendMessage(msg.from.id, 'Compromís dels membres de la societat individualment o com a part d\'un grup per a prendre decisions positives per a la societat.');
            break;
        case '1.5':
            bot.sendMessage(msg.from.id, 'Corresponsabilitat:');
            term = 'Corresponsabilitat';
            bot.sendMessage(msg.from.id, 'Responsabilitat compartida entre dues o més persones o organitzacions, per a buscar solucions als problemes assumint la responsabilitat individual i compartida de les conseqüències generades per les solucions adoptades.');
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
   
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, d: getUTCDate(), m: getMonth(), a: getFullYear(), hora: getHours(), min: getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + "ha consultat:" + term);
          db.close();
        });
      }); 
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
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, d: getUTCDate(), m: getMonth(), a: getFullYear(), hora: getHours(), min: getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + "ha consultat:" + term);
          db.close();
        });
      }); 
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
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, d: getUTCDate(), m: getMonth(), a: getFullYear(), hora: getHours(), min: getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + "ha consultat:" + term);
          db.close();
        });
      }); 
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
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, d: getUTCDate(), m: getMonth(), a: getFullYear(), hora: getHours(), min: getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + "ha consultat:" + term);
          db.close();
        });
      }); 
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