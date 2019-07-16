//#region Imports
var Telegram = require('node-telegram-bot-api');
var token = "887425942:AAFwUATg6BB-hkuMOL_koo0im77hm83wqXw";
var bot = new Telegram(token, { polling: true });
var wrapper = require('node-telegram-keyboard-wrapper');
var generatecsv = require('./exportCSV.js');
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
var tiempoCsv = 12;                             //Tiempo entre backups de csv
var interval = tiempoCsv * 60 * 60 * 1000;       //En ms

var func = setInterval(function(){
    generatecsv.export2csv(function () {
        console.log("Documento de registros generado. " + new Date());});
    }, interval);

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
            [{ text: "Bon Govern"                , callback_data: '4.2'  }],
            [{ text: "Consell de transparència"  , callback_data: '4.3'  }],
            [{ text: "Polítiques públiques"      , callback_data: '4.4'  }]
        ]
    },
    {
        title: 'Objectius de Desenvolupament Sostenible (ODS)',
        buttons: [
            [{ text: "Fi de la pobresa"                         , callback_data: '5.1'   }],
            [{ text: "Fam zero"                                 , callback_data: '5.2'   }],
            [{ text: "Salut i benestar"                         , callback_data: '5.3'   }],
            [{ text: "Educació de qualitat"                     , callback_data: '5.4'   }],
            [{ text: "Igualtat de gènere"                       , callback_data: '5.5'   }],
            [{ text: "Aigua neta i sanejament"                  , callback_data: '5.6'   }],
            [{ text: "Energia assequible i no contaminant"      , callback_data: '5.7'   }],
            [{ text: "Treball decent i creixement econòmic"     , callback_data: '5.8'   }],
            [{ text: "Indústria, innovació i infraestructura"   , callback_data: '5.9'   }],
            [{ text: "Reducció de les desigualtats"             , callback_data: '5.10'  }],
            [{ text: "Ciutats i comunitats sostenibles"         , callback_data: '5.11'  }],
            [{ text: "Producció i consum responsables"          , callback_data: '5.12'  }],
            [{ text: " Acció pel clima"                         , callback_data: '5.13'  }],
            [{ text: "Vida submarina"                           , callback_data: '5.14'  }],
            [{ text: "Vida d'ecosistemes terrestres"            , callback_data: '5.15'  }],
            [{ text: "Pau, justícia i institucions sòlides"     , callback_data: '5.16'  }],
            [{ text: "Aliances per a aconseguir els objectius"  , callback_data: '5.17'  }]
        ]
    }
];
//#endregion

//#region Commands
bot.onText(/\/csv/, (msg) => {
    bot.sendMessage(msg.from.id, "Generant document... Estarà llest en uns segons.");
    generatecsv.export2csv(function(date) {
        console.log("Documento generado.");
        var minutes = parseInt(date.getMinutes());
        var hours = parseInt(date.getHours());
        var days = parseInt(date.getDate());
        if (minutes < 10) {minutes = 0 + "" + date.getMinutes();}
        if (hours < 10)   {hours   = 0 + "" + date.getHours();}
        if (days < 10)    {days    = 0 + "" + date.getDate();}
        
        bot.sendDocument(msg.from.id, "Registro.csv", {caption: "Document generat. " 
        + hours + ":" + minutes + " - " + days + "/" + parseInt(date.getMonth() + 1)
        + "/" + date.getFullYear()});
    });
});

bot.onText(/\/start/, (msg) => {
    isKeyboardOpen = true;
    bot.sendMessage(msg.from.id, 
    text = "Benvingut al bot del projecte 'T'ho conte?' per a la divulgació i educació en termes de govern obert. \n"
     + "\nAquest bot ha sigut creat per a donar la definició d'alguns termes relacionats amb el govern obert.\n"
     + "\nQuè vols que et conte? ;)",
    keyboard.open({ resize_keyboard: true }),
    {parse_mode: "HTML"}
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
        case niveles.ODS:
            nivelActual = niveles.ODS
            startPoll(msg, 5);
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
        today = new Date();
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
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
            bot.sendMessage(msg.from.id, 'Integritat:');
            term = 'Integritat'
            bot.sendMessage(msg.from.id, 'Actuar en tot moment amb rectitud, lleialtat, honradesa, imparcialitat i bona fe.');
            break;
        case '1.7':
            bot.sendMessage(msg.from.id, 'Parets de cristall:');
            term = 'Parets de cristall';
            bot.sendMessage(msg.from.id, 'Metàfora que explica el repte d\'implantar una administració pública totalment transparent en la qual la ciutadania puga conéixer què fan els governs, així com els actes i les decisions que es prenen des dels poders públics.');
            break;
        case '1.8':
            bot.sendMessage(msg.from.id, 'Inclusivitat:');
            term = 'Inclusivitat';
            bot.sendMessage(msg.from.id, 'Habilitar mecanismes que permeten assegurar que la ciutadania puga participar de totes les accions, rebutjant les accions que excloguen a persones o col·lectius per discapacitat, política, sexe, religió, etc.');
            break;
        case '1.9':
            bot.sendMessage(msg.from.id, 'Confiança mútua:');
            term = 'Confiança mútua'
            bot.sendMessage(msg.from.id, 'Creure en els governs i administracions públiques, de la mateixa manera que ells també han de creure en els ciutadans i les ciutadanes.');
            break;
    }
   
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + "ha consultat:" + term);
          db.close();
        });
      }); 
}

function handleTecnologia(msg) {
    var answer = msg.data;
    var term;
    switch(answer) {
        case '2.1':
            bot.sendMessage(msg.from.id, 'Dades obertes:');
            term = 'Dades obertes';
            bot.sendMessage(msg.from.id, 'Dades que es generen en les AAPP en l\'exercici de les seues funcions i que posen a la disposició de les persones perquè les coneguen, els permeten prendre decisions informades i puguen reutilitzar-les individualment o en grups.');
            break;
        case '2.2':
            bot.sendMessage(msg.from.id, 'Governança intel·ligent:');
            term = 'Governança intel·ligent';
            bot.sendMessage(msg.from.id, 'Ús de noves tecnologies com a eina per a millorar la manera de governar.');
            break;
        case '2.3':
            bot.sendMessage(msg.from.id, 'Bretxa digital:');
            term = 'Bretxa digital';
            bot.sendMessage(msg.from.id, 'Separació entre les persones que utilitzen les TIC habitualment en la seua vida i les que no tenen accés o si ho tenen, no saben com utilitzar-les.');
            break;
        case '2.4':
            bot.sendMessage(msg.from.id, 'Smart City:');
            term = 'Smart City';
            bot.sendMessage(msg.from.id, 'És una "ciutat intel·ligent" capaç d\'utilitzar les tecnologies de la informació i comunicació (TIC) amb l\'objectiu de crear millors infraestructures i serveis per a la ciutadania.');
            break;
        case '2.5':
            bot.sendMessage(msg.from.id, 'Portals de transparència:');
            term = 'Portals de transparència';
            bot.sendMessage(msg.from.id, 'Plataforma digital informativa de lliure accés a través d\'Internet que permet a qualsevol usuari disposar d\'informació en forma de publicitat activa sobre les administracions públiques.');
            break;
        case '2.6':
            bot.sendMessage(msg.from.id, 'Portals de dades obertes:');
            term = 'Portals de dades obertes';
            bot.sendMessage(msg.from.id, 'Són plataformes digitals que serveixen per a emmagatzemar, compartir, connectar i visualitzar conjunts de dades. Són un punt de trobada entre la pròpia organització que els comparteix i altres organitzacions, les empreses, la ciutadania, les i els desenvolupadors informàtics i les i els periodistes, les associacions, les ONGD, etc.');
            break;
        case '2.7':
            bot.sendMessage(msg.from.id, 'Laboratoris d\'innovació:');
            bot.sendMessage(msg.from.id, 'Són espais per a experimentar amb noves maneres de generar valor públic, modernitzar la relació amb la ciutadania i aportar nous canals de participació i col·laboració.');
            break;
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + "ha consultat:" + term);
          db.close();
        });
      }); 
}

function handleComunicacion(msg) {
    var answer = msg.data;
    var term;
    switch(answer) {
        case '3.1':
            bot.sendMessage(msg.from.id, 'Fake news:');
            term = 'Fake news'
            bot.sendMessage(msg.from.id, 'Informació fabricada i publicada a propòsit per a enganyar i induir a les persones a creure mentides o posar en dubte fets verificables.');
            break;
        case '3.2':
            bot.sendMessage(msg.from.id, 'Periodisme de dades:');
            term = 'Periodisme de dades'
            bot.sendMessage(msg.from.id, 'És una manera d\'elaborar notícies d\'una forma clara i comprensible basant-se en les dades que poden aportar informació sobre la notícia.');
            break;
        case '3.3':
            bot.sendMessage(msg.from.id, 'Publicitat activa:');
            term = 'Publicitat activa';
            bot.sendMessage(msg.from.id, 'Obligació de publicar certes informacions i dades per endavant, en la seu electrònica, web o portals de transparència de les administracions públiques.');
            break;
        case '3.4':
            bot.sendMessage(msg.from.id, 'Transparència:');
            term = 'Transparència'
            bot.sendMessage(msg.from.id, 'Capacitat de les administracions públiques de no limitar la informació a través de la publicitat activa, dret d\'accés a la informació i les dades obertes.');
            break;
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + "ha consultat:" + term);
          db.close();
        });
      }); 
}

function handleGobierno(msg) {
    var answer = msg.data;
    var term;
    switch(answer) {
        case '4.1':
            bot.sendMessage(msg.from.id, 'Govern obert:');
            term = 'Govern obert';
            bot.sendMessage(msg.from.id, 'Té com a objectiu que la ciutadania i les organitzacions de qualsevol tipus col·laboren en la creació i millora de serveis públics i les polítiques públiques consolidant la transparència i la rendició de comptes.');
            break;
        case '4.2':
            bot.sendMessage(msg.from.id, 'Bon Govern:');
            term = 'Bon govern'
            bot.sendMessage(msg.from.id, 'Forma d\'exercici del poder caracteritzada per l\'eficiència, la transparència, la rendició de comptes, la participació ciutadana i l\'estat de dret, que manifesta la decisió del govern d\'utilitzar els recursos disponibles a favor del desenvolupament social, mediambiental i econòmic per a tots.');
            break;
        case '4.3':
            bot.sendMessage(msg.from.id, 'Consell de transparència:');
            term = 'Consell de transparència';
            bot.sendMessage(msg.from.id, 'Organisme encarregat de vetlar per la transparència de l\'activitat pública i garantir el dret d\'accés a la informació que tenen els ciutadans o ciutadanes i organitzacions.');
            break;
        case '4.4':
            bot.sendMessage(msg.from.id, 'Polítiques públiques:');
            term = 'Polítiques públiques'
            bot.sendMessage(msg.from.id, 'Mesures dutes a terme pels governs en matèria de les seues competències amb la finalitat de complir les expectatives de la ciutadania.');
            break;
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + "ha consultat:" + term);
          db.close();
        });
      }); 
}

function handleOds(msg) {
    var answer = msg.data;
    var term;
    switch(answer) {
        case '5.1':
            bot.sendMessage(msg.from.id, 'Fi de la pobresa:');
            term = 'Fi de la pobresa';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "El nombre de persones que busquen en els contenidors aliments i objectes per a la seua pròpia llar, és un símptoma de l'augment de la pobresa");
            bot.sendMessage(msg.from.id, "Sketch 2: Recorda't de la reunió\n" +
                                         "La mare és soltera i no té treball i prompte podria trobar-se en una situació pròxima a la pobresa");
            break;
        case '5.2':
            bot.sendMessage(msg.from.id, 'Fam zero:');
            term = 'Fam zero';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "Ser responsables amb els aliments i el seu consum redueix els residus i a més consciència als i les joves al fet que siguen respectuosos amb els aliments");
            bot.sendMessage(msg.from.id, "Sketch 2: Recorda't de la reunió\n" +
                                         "La nevera de la família ràpid es quedarà quasi buida si no aconsegueix prompte treball");
            break;
        case '5.3':
            bot.sendMessage(msg.from.id, 'Salut i benestar:');
            term = 'Salut i benestar';
            bot.sendMessage(msg.from.id, "Sketch 6: Reenviar\n" +
                                         "Els centres educatius han de donar més importància a les classes d'educació sexual perquè l'alumnat estiga conscienciat amb les malalties de transmissió sexual que han augmentat en els últims anys");
            break;
        case '5.4':
            bot.sendMessage(msg.from.id, 'Educació de qualitat');
            term = 'Educació de qualitat';
            bot.sendMessage(msg.from.id, "Sketch 3: El professor no ha vingut\n" +
                                         "L'absència injustificada d'un professor o professora impedeix continuar la formació adequada de l'alumnat");
            bot.sendMessage(msg.from.id, "Sketch 4: Eleccions a delegats i delegades\n" +
                                         "Una de les candidates a delegada porta en les seues propostes millores per a una educació de qualitat. Donada la importància de l'Agenda 2030, s'hauria de trobar en el currículum coincidències que permeten l'educació en desenvolupament sostenible");
            bot.sendMessage(msg.from.id, "Sketch 5: Suspens generalizat\n" +
                                         "L'alumnat acudeix a secretaria per a demanar les notes de cursos anteriors ja que ha suspés tota la classe. Entre l'alumnat i el professorat implicat haurien de trobar un solució al problema del suspens generalitzat que passarà per utilitzar una altra metodologia d'aprenentatge-ensenyament de l'assignatura de matemàtiques");
            break;
        case '5.5':
            bot.sendMessage(msg.from.id, 'Igualtat de gènere:');
            term = 'Igualtat de gènere';
            bot.sendMessage(msg.from.id, "Sketch 2: Recorda't de la reunió\n" +
                                         "La diferència entre els sous d'homes i dones pel mateix treball és una realitat que necessita visibilitzar-se a tots els nivells per a poder canviar-se");
            bot.sendMessage(msg.from.id, "Sketch 6: Reenviar\n" +
                                         "El més probable és que, en difondre's el vídeo, els comentaris sobre ell i sobre ella siguen molt diferents");
            break;
        case '5.6':
            bot.sendMessage(msg.from.id, 'Aigua neta i sanejament:');
            term = 'Aigua neta i sanejament';
            bot.sendMessage(msg.from.id, "Sketch 4: Eleccions a delegats i delegades\n" +
                                         "Una de les propostes dels candidats i les candidates podria ser la reutilització de l'aigua de pluja per al reg de les plantes i zones verdes del centre i també per a l'aigua de la cisterna. Es podria ampliar aqueixa iniciativa a altres centres de la mateixa ciutat i d'altres ciutats i també a altres entitats públiques.");
            break;
        case '5.7': 
            bot.sendMessage(msg.from.id, 'Energia assequible i no contaminant:');
            term = 'Energia assequible i no contaminant';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "La diferència entre els sous d'homes i dones pel mateix treball és una realitat que necessita visibilitzar-se a tots els nivells per a poder canviar-se");
            bot.sendMessage(msg.from.id, "Sketch 4: Eleccions a delegats i delegades\n" +
                                         "El més probable és que, en difondre's el vídeo, els comentaris sobre ell i sobre ella siguen molt diferents");
            break;
        case '5.8':
            bot.sendMessage(msg.from.id, 'Treball decent i creixement econòmic:');
            term = 'Treball decent i creixement econòmic';
            bot.sendMessage(msg.from.id, "Sketch 2: Recorda't de la reunió\n" +
                                         "La mare està buscant un treball per a poder traure a la seua família endavant");
            break;
        case '5.9':
            bot.sendMessage(msg.from.id, 'Indústria, innovació i infraestructura:');
            term = 'Indústria, innovació i infraestructura';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "El camí, excessivament llarg no està adaptat a persones amb mobilitat reduïda. Si es continua innovant en el disseny de materials perquè els carrers siguen capaços de produir energia a través del moviment de persones i vehicles, disminuiria el consum d'energia.");
            break;
        case '5.10':
            bot.sendMessage(msg.from.id, 'Reducció de les desigualtats:');
            term = 'Reducció de les desigualtats';
            bot.sendMessage(msg.from.id, "Sketch 2: Recorda't de la reunió\n" +
                                         "La falta de treball és una desigualtat en si mateixa i pot contribuir a altres desigualtats a tots els nivells");
            break; 
        case '5.11':
            bot.sendMessage(msg.from.id, 'Ciutats i comunitats sostenibles:');
            term = 'Ciutats i comunitats sostenibles';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "El camí, excessivament llarg no està adaptat a persones amb mobilitat reduïda. Si es continua innovant en el disseny de materials perquè els carrers siguen capaços de produir energia a través del moviment de persones i vehicles, disminuiria el consum d'energia.");
            break;
        case '5.12':
            bot.sendMessage(msg.from.id, 'Producció i consum responsables:');
            term = 'Producció i consum responsables';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "El consum responsable i l'elecció dels productes pels consumidors tenint en compte l'origen i l'embolcall, fomentaria que les empreses utilitzaran més matèries primeres de proximitat i que els seus productes generaren menys residus");
            bot.sendMessage(msg.from.id, "Sketch 6: Reenviar\n" +
                                         "L'ús d'aplicacions i xarxes socials és el consum d'un servei, i aquest pot ser responsable o no. L'enregistrament i la difusió de contingut privat no és un ús responsable. També és responsabilitat dels alumnes realitzar activitats poc adequades en el bany");
            break;
        case '5.13':
            bot.sendMessage(msg.from.id, 'Acció pel clima:');
            term = 'Acció pel clima';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "El consum responsable i l'elecció dels productes pels consumidors tenint en compte l'origen i l'embolcall, fomentaria que les empreses utilitzaran més matèries primeres de proximitat i que els seus productes generaren menys residus.");
            break;
        case '5.14':
            bot.sendMessage(msg.from.id, 'Vida submarina:');
            term = 'Vida submarina';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "Els residus que no es reciclen correctament acaben en el mar o altres ecosistemes afectant l'alimentació i vida dels animals marins i també a l'alimentació dels humans com a resultat de la cadena alimentària.");
            break;
        case '5.15':
            bot.sendMessage(msg.from.id, 'Vida d\'ecosistemes terrestres:');
            term = 'Vida d\'ecosistemes terrestres';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "Els residus que no es reciclen correctament acaben en els abocadors legals o il·legals i també augmenten els gasos contaminants per la combustió dels residus.");
            break;
        case '5.16':
            bot.sendMessage(msg.from.id, 'Pau, justícia i institucions sòlides:');
            term = 'Pau, justícia i institucions sòlides';
            bot.sendMessage(msg.from.id, "Sketch 3: El professor no ha vingut\n" +
                                         "La falta de professorat substitut o que vigile els corredors i que totes les classes tenen al seu professor o professora deixa a l'alumnat desatés i produeix falta de confiança en el centre educatiu");
            bot.sendMessage(msg.from.id, "Sketch 5: Suspens generalizat\n" +
                                         "L'alumnat vol saber si les seues notes han sigut justes i si el centre protegeix injustificadament al professorat");
            break;
        case '5.17':
            bot.sendMessage(msg.from.id, 'Aliances per a aconseguir els objectius:');
            term = 'Aliances per a aconseguir els objectius';
            bot.sendMessage(msg.from.id, "Sketch 1: El contenidor llunyà\n" +
                                         "Els residus que no es reciclen correctament acaben en els abocadors legals o il·legals i també augmenten els gasos contaminants per la combustió dels residus.");
            bot.sendMessage(msg.from.id, "Sketch 2: Recorda't de la reunió\n" +
                                         "El bon funcionament de les oficines d'ocupació i la sinceritat de les persones quan busquen ocupació, afavorirà que les persones que veritablement estan interessades a trobar ocupació, ho troben");
            bot.sendMessage(msg.from.id, "Sketch 3: El professor no ha vingut\n" +
                                         "Si l'alumnat informa de la falta del professor a l'aula al centre en el moment, serà probable que el centre educatiu puga trobar una solució ràpida a la situació de falta de professorat");

            break;
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concept: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
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
        case niveles.ODS:
            handleOds(msg);
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

function newPoll() {
    userAnswer.push(id);
    userAnswer.push(todayTime());
};

function todayTime() {
    today = new Date();
    return current = today.getHours() + ":" + today.getMinutes();
};