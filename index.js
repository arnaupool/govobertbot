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
    text = "Benvingut al bot del projecte **'T'ho conte?'** per a la divulgació i educació en termes de govern obert. \n"
     + "Aquest bot ha sigut creat per a donar la definició d'alguns termes relacionats amb el govern obert."
     + "\nQuè vols que et conte? ;)",
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
            term = 'Col·laboració';
            bot.sendMessage(msg.from.id, 'Col·laboració: \n Creació de nous espais de trobada, diàleg i treball on participen tots els agents de la societat (administracions, governs, societat civil, empreses, associacions, ONGD, etc.) per a actuar sobre problemes concrets d\'índole general.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Cada candidatura a delegats i delegades podria haver fet una reunió prèvia amb els companys i companyes de classe per a decidir entre tots i totes el programa que pretén dur a terme.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació: \n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=11)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato/#page=10)\n'
            + '· [Link 3](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato/#page=16)\n'
            + '· [Link 4](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=5)\n'
            + '· [Link 5](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=6)\n'
            
            , {parse_mode: "Markdown"});}, 2000);
            break;
        case '0.2': 
            term = 'Cocreació';
            bot.sendMessage(msg.from.id, 'Cocreació: \n És la posada en pràctica de la col·laboració. Actua sobre problemes concrets mitjançant diferents formes de participació per a analitzar, intervindre i generar solucions de manera col·lectiva i incorporant a les persones o col·lectius implicats sempre que siga possible. Impulsa la innovació oberta.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                                                "Cada candidatura a delegats i delegades podria haver fet una reunió prèvia amb els companys i companyes de classe per a decidir entre tots i totes el programa que pretén dur a terme.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO#page=12)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=16)\n'
            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '0.3': 
            term = 'Apoderament ciutadà';
            bot.sendMessage(msg.from.id, 'Apoderament ciutadà: \n Els ciutadans i ciutadanes adquireixen la consciència i el control de que poden influir sobre el que afecta a la seua qualitat de vida a tots els nivells.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Cada candidatura a delegats i delegades podria haver fet una reunió prèvia amb els companys i companyes de classe per a decidir entre tots i totes el programa que pretén dur a terme.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://www.valencia.es/transparencia/publicaciones/Informe_L%C3%ADneas_estratégicas_Cátedra_GO_Iniciativas_DGC.pdf#page=5)\n'
            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '0.4':
            term = 'Compromís ciutadà';
            bot.sendMessage(msg.from.id, 'Compromís ciutadà: \n Està promogut pels governs per a què la ciutadania en processos formals, prenga part de les decisions polítiques.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Proposta de l'AMPA al centre educatiu per a obrir un procés de pressupostos participatius que permeta invertir una part del pressupost del centre en les necessitats de totes les persones del centre. Els pressupostos participatius requereix que es facen proposades i que totes les persones que formen part del centre s'impliquen.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=6)\n'
            
            
            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '0.5':
            term = 'Pressupostos participatius';
            bot.sendMessage(msg.from.id, 'Pressupostos participatius: \n Participació dels veïns i les veïnes en els pressupostos del seu municipi/barri per a destinar part dels diners als projectes de major interés per a les persones de la ciutat/barri.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Proposta de l'AMPA al centre educatiu per a obrir un procés de pressupostos participatius que permeta invertir una part del pressupost del centre en les necessitats de totes les persones del centre. Els pressupostos participatius requereix que es facen proposades i que totes les persones que formen part del centre s'impliquen.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](https://www.diba.cat/documents/116331322/146465019/AAFF_05_Quaderns+PC+_CAST.pdf/66377e67-38f2-4862-80b0-2f12b4211a2a#page=2)\n'
            
            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '0.6':
            term = 'Participació ciutadana';
            bot.sendMessage(msg.from.id, 'Participació ciutadana: \n Manera que tenen els ciutadans i les ciutadanes per a participar en la presa decisions del govern i en el disseny de serveis públics.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Cada candidatura a delegats i delegades podria haver fet una reunió prèvia amb els companys i companyes de classe per a decidir entre tots i totes el programa que pretén dur a terme.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=10)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=13)\n'
            + '· [Link 3](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=5)\n'
            + '· [Link 4](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=6)\n'
            
            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '0.7':
            term = 'Dret d\'accés a la informació pública';
            bot.sendMessage(msg.from.id, 'Dret d\'accés a la informació pública: \n Totes les persones tenen dret i poden sol·licitar la informació que consideren del seu interés generada per les administracions públiques, llevat que entren en conflicte amb altres lleis tals com la protecció de dades o la seguretat nacional principalment.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Els alumnes sol·liciten les notes de cursos anteriors per a comparar-les amb els resultats del curs actual i poder prendre decisions.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=8)\n'
            + '· [Link 2](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=11)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '0.8': 
            term = 'Ciutadania Intel·ligent';
            bot.sendMessage(msg.from.id, 'Ciutadania Intel·ligent: \n Ciutadania que utilitza la intel·ligència artificial per a prendre les seues pròpies decisions dia a dia i a llarg termini.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Un ciutadà o ciutadana amb discapacitat obté dades del portal de dades obertes de la seua ciutat per a conéixer on estan els contenidors accessibles per a la seua discapacitat.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Notícia 1](https://www.eucim.es/noticias/smart-cities-smart-citizens-ciudadanos-inteligentes/)\n'
            + '· [Notícia 2](https://medium.com/urbvan/ciudades-inteligentes-ciudadanos-inteligentes-y-viceversa-693b813f14cc)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '0.9':
            term = 'Consciència cívica';
            bot.sendMessage(msg.from.id, 'Consciència cívica: \n Consciència que ens indica com hem de comportar-nos les ciutadanes i els ciutadans per a enfortir una democràcia participativa que reconega la pluralitat, la tolerància i el reconeixement de la dignitat individual.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                                                "La mare que torna per la seua bossa després que haja finalitzat la reunió de l'AMPA dubta que ha de fer. Fa uns dies va assistir a uns tallers sobre ciutadania activa i recorda diverses coses que van quedar impregnades en la seua consciència.");}, 1000);
            break;
        case '0.10':
            term = 'Cultura participativa';
            bot.sendMessage(msg.from.id, 'Cultura participativa: \n Cultura destinada al desenvolupament de les habilitats d\'expressió i comunicació d\'opinions i idees pròpies i al compromís cívic de la ciutadania, assumint responsabilitats.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Proposta de l'AMPA al centre educatiu per a obrir un procés de pressupostos participatius que permeta invertir una part del pressupost del centre en les necessitats de totes les persones del centre. Els pressupostos participatius requereix que es facen proposades i que totes les persones que formen part del centre s'impliquen.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=6)\n'
            + '· [Link 2](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=7)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break; 
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concepte: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
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
            term = 'Rendició de comptes';
            bot.sendMessage(msg.from.id, 'Rendició de comptes: \n Obligació dels governs i administracions públiques a donar explicacions sobre les seues accions i assumir la responsabilitat de les decisions que adopten.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Els alumnes sol·liciten les notes de cursos anteriors per a comparar-les amb els resultats del curs actual i poder prendre decisions.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=7)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=10)\n'
            + '· [Link 3](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=5)\n'
            + '· [Link 4](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=6)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '1.2':
            term = 'Qualitat de serveis públics';
            bot.sendMessage(msg.from.id, 'Qualitat de serveis públics: \n Les administracions públiques han d\'assegurar a la ciutadania una contínua millora dels procediments, serveis i prestacions públiques tenint en compte els recursos disponibles i les polítiques públiques.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                                                "La disposició dels contenidors per als diferents tipus de reciclatge ha de tindre en compte l'accés als mateixos i la distància que s’ha de recórrer per al seu ús, principalment per a les persones amb problemes de mobilitat.");}, 1000);
            break;
        case '1.3':
            term = 'Innovació';
            bot.sendMessage(msg.from.id, 'Innovació: \n Desenvolupament de noves maneres de fer les coses, al marge de com s\'han fet en el passat, i explorar formes alternatives de pensar.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "El ciutadà o ciutadana utilitza les xifres de reciclatge dels diferents tipus de residus desglossada per barris amb la intenció de proposar contenidors intel·ligents com per exemple: una targeta d'identificació familiar vinculada al pes dels residus que es generen en els diferents tipus de contenidors o la possibilitat d'adaptar-se a les persones amb dificultats especials perquè puguen fer ús d'ells.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=7)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=12)\n'
            + '· [Link 3](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=9)\n'
            + '· [Link 4](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=17)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '1.4':
            term = 'Responsabilidad social';
            bot.sendMessage(msg.from.id, 'Responsabilidad social: \n Compromís dels membres de la societat individualment o com a part d\'un grup per a prendre decisions positives per a la societat.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "El centre educatiu ha de dedicar atenció a l’incident ocasionat pels alumnes i alumnes que utilitzen els banys de manera inapropiada. A més, pot aprofitar-ho per a conscienciar sobre l'ús de preservatius i les malalties o embarassos per no utilitzar-los i controlar totes les falses notícies en aquest àmbit.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](https://blog.oxfamintermon.org/los-diferentes-tipos-de-responsabilidad-social-del-ambito-individual-a-la-acciones-gubernamentales/#Guias )\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '1.5':
            term = 'Corresponsabilitat';
            bot.sendMessage(msg.from.id, 'Corresponsabilitat: \n Responsabilitat compartida entre dues o més persones o organitzacions, per a buscar solucions als problemes assumint la responsabilitat individual i compartida de les conseqüències generades per les solucions adoptades.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "L'alumnat que espera al professor que no ha arribat ha de compartir la responsabilitat de l'acció que decidisquen fer. Les conseqüències de la seua acció, afectaran a tot el grup.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://peleandoconlastic.blogspot.com/2018/03/la-corresponsabilidad-en-gobierno.html)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '1.6':
            term = 'Integritat'
            bot.sendMessage(msg.from.id, 'Integritat: \n Actuar en tot moment amb rectitud, lleialtat, honradesa, imparcialitat i bona fe.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "L'AMPA ha recol·lectat els diners per al banc d'aliments i realment l'utilitza per a això.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=7)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=9)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '1.7':
            term = 'Parets de cristall';
            bot.sendMessage(msg.from.id, 'Parets de cristall: \n Metàfora que explica el repte d\'implantar una administració pública totalment transparent en la qual la ciutadania puga conéixer què fan els governs, així com els actes i les decisions que es prenen des dels poders públics.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Els alumnes sol·liciten les notes de cursos anteriors per a comparar-les amb els resultats del curs actual i poder prendre decisions.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=8)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=10)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '1.8':
            term = 'Inclusivitat';
            bot.sendMessage(msg.from.id, 'Inclusivitat: \n Habilitar mecanismes que permeten assegurar que la ciutadania puga participar de totes les accions, rebutjant les accions que excloguen a persones o col·lectius per discapacitat, política, sexe, religió, etc.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "La disposició dels contenidors per als diferents tipus de reciclatge ha de tindre en compte l'accés als mateixos i la distància que s’ha de recórrer per al seu ús, principalment per a les persones amb problemes de mobilitat.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=7)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=9)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '1.9':
            term = 'Confiança mútua'
            bot.sendMessage(msg.from.id, 'Confiança mútua: \n Creure en els governs i administracions públiques, de la mateixa manera que ells també han de creure en els ciutadans i les ciutadanes.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Proposta de l'AMPA al centre educatiu per a obrir un procés de pressupostos participatius que permeta invertir una part del pressupost del centre en les necessitats de totes les persones del centre.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=7)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=9)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
    }
   
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concepte: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
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
            term = 'Dades obertes';
            bot.sendMessage(msg.from.id, 'Dades obertes: \n Dades que es generen en les AAPP en l\'exercici de les seues funcions i que posen a la disposició de les persones perquè les coneguen, els permeten prendre decisions informades i puguen reutilitzar-les individualment o en grups.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "El ciutadà o ciutadana utilitza les xifres de reciclatge dels diferents tipus de residus desglossada per barris amb la intenció de proposar contenidors intel·ligents com per exemple: una targeta d'identificació familiar vinculada al pes dels residus que es generen en els diferents tipus de contenidors o la possibilitat d'adaptar-se a les persones amb dificultats especials perquè puguen fer ús d'ells.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=6)\n'
            + '· [Link 2](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=8)\n'
            + '· [Link 3](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=17)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '2.2':
            term = 'Governança intel·ligent';
            bot.sendMessage(msg.from.id, 'Governança intel·ligent: \n Ús de noves tecnologies com a eina per a millorar la manera de governar.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                                                "L'ajuntament de la ciutat utilitza les dades del reciclatge per barri i tipus de contenidor per a millorar el servei de recollida de residus. A més, ha creuat aquestes dades amb les dades obtingudes de la geolocalització dels diferents tipus de contenidors i la distància major que hauria de recórrer una persona per a arribar al contenidor des de la seua casa. Amb aquesta informació ha redissenyat la ubicació dels contenidors i ha posat nous contenidors en els llocs necessaris segons l'anàlisi realitzada.");}, 1000);
            break;
        case '2.3':
            term = 'Bretxa digital';
            bot.sendMessage(msg.from.id, 'Bretxa digital: \n Separació entre les persones que utilitzen les TIC habitualment en la seua vida i les que no tenen accés o si ho tenen, no saben com utilitzar-les.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Una persona amb dificultats de mobilitat s'ha mudat de barri. No sap com accedir a les dades de geolocalització dels contenidors que ofereix l'ajuntament i li resulta complicat reciclar els seus residus en els contenidors específics per a això.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Vídeo YouTube](https://www.youtube.com/watch?v=mtTOB4tFRSs)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '2.4':
            term = 'Smart City';
            bot.sendMessage(msg.from.id, 'Smart City: \n És una "ciutat intel·ligent" capaç d\'utilitzar les tecnologies de la informació i comunicació (TIC) amb l\'objectiu de crear millors infraestructures i serveis per a la ciutadania.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "L'ajuntament de la ciutat utilitza les dades del reciclatge per barri i tipus de contenidor per a millorar el servei de recollida de residus. A més, ha creuat aquestes dades amb les dades obtingudes de la geolocalització dels diferents tipus de contenidors i la distància major que hauria de recórrer una persona per a arribar al contenidor des de la seua casa. Amb aquesta informació ha redissenyat la ubicació dels contenidors i ha posat nous contenidors en els llocs necessaris segons l'anàlisi realitzada.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Vídeo YouTube](https://www.youtube.com/watch?v=25BKmHF_9QM)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '2.5':
            term = 'Portals de transparència';
            bot.sendMessage(msg.from.id, 'Portals de transparència: \n Plataforma digital informativa de lliure accés a través d\'Internet que permet a qualsevol usuari disposar d\'informació en forma de publicitat activa sobre les administracions públiques.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Tant l'AMPA com el propi centre educatiu haurien de disposar d'una apartat en la web del centre vinculada a la transparència amb la finalitat que estiguera disponible com a publicitat activa la informació a la qual obliga la normativa però també aquella que es considera d'interés encara que no hi haja obligació de posar-la.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=8)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=11)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '2.6':
            term = 'Portals de dades obertes';
            bot.sendMessage(msg.from.id, 'Portals de dades obertes: \n Són plataformes digitals que serveixen per a emmagatzemar, compartir, connectar i visualitzar conjunts de dades. Són un punt de trobada entre la pròpia organització que els comparteix i altres organitzacions, les empreses, la ciutadania, les i els desenvolupadors informàtics i les i els periodistes, les associacions, les ONGD, etc.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n ');}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=12)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '2.7':
            term = 'Laboratoris d\'innovació';
            bot.sendMessage(msg.from.id, 'Laboratoris d\'innovació: \n Són espais per a experimentar amb noves maneres de generar valor públic, modernitzar la relació amb la ciutadania i aportar nous canals de participació i col·laboració.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
            "L'ajuntament llança un repte en un dels seus laboratoris d'innovació per a facilitar el depòsit dels residus per a les persones amb algun tipus de dificultat i també perquè xiquets i xiquetes s'habituen a ser les i els responsables a la seua casa de portar els residus que es generen al contenidor adequat.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=13)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=17)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concepte: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
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
            term = 'Fake news'
            bot.sendMessage(msg.from.id, 'Fake news: \n Informació fabricada i publicada a propòsit per a enganyar i induir a les persones a creure mentides o posar en dubte fets verificables.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "El centre educatiu ha de dedicar atenció a l’incident ocasionat pels alumnes i alumnes que utilitzen els banys de manera inapropiada. A més, pot aprofitar-ho per a conscienciar sobre l'ús de preservatius i les malalties o embarassos per no utilitzar-los i controlar totes les falses notícies en aquest àmbit.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](https://www.ifj.org/fileadmin/user_upload/Fake_News_-_FIP_AmLat.pdf#page=3)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '3.2':
            term = 'Periodisme de dades'
            bot.sendMessage(msg.from.id, 'Periodisme de dades: \n És una manera d\'elaborar notícies d\'una forma clara i comprensible basant-se en les dades que poden aportar informació sobre la notícia.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Una persona periodista s'ha interessat per la dificultat d'accés als contenidors per a les persones amb dificultats de mobilitat. Amb les dades sobre ubicació dels diferents contenidors i les xifres de reciclatge elabora una notícia per a un periòdic local amb la finalitat de visibilitzar la problemàtica.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](https://catgo.webs.upv.es/informe-datos-generados-por-la-ciudadania-desde-el-contexto-valenciano/#page=26)\n'
            + '· [Link 2](https://catgo.webs.upv.es/informe-datos-generados-por-la-ciudadania-desde-el-contexto-valenciano/#page=27)\n'
            + '· [Link 3](https://catgo.webs.upv.es/informe-datos-abiertos-para-el-desarrollo-od4d-en-la-comunidad-valenciana/#page=44)\n'
            + '· [Link 4](https://catgo.webs.upv.es/informe-datos-abiertos-para-el-desarrollo-od4d-en-la-comunidad-valenciana/#page=52)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '3.3':
            term = 'Publicitat activa';
            bot.sendMessage(msg.from.id, 'Publicitat activa: \n Obligació de publicar certes informacions i dades per endavant, en la seu electrònica, web o portals de transparència de les administracions públiques.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Una persona amb dificultats de mobilitat troba problemes per a reciclar correctament els residus en el contenidor específic, no obstant això, una amiga seua que viu en una altra ciutat no té problemes. La persona decideix buscar en el portal de transparència els contractes relatius al reciclatge dels diferents residus a la seua ciutat i a la ciutat de la seua amiga per a comparar-ho i veure si les dificultats que pateix poden ser degudes al contracte de reciclatge de residus de la seua ciutat. La informació és obligada per la normativa de transparència i troba que a la ciutat de la seua amiga és completa i té molts detalls. A la seua ciutat, encara que està la informació bàsica del contracte, no està prou detallada per a comparar-la amb la de la ciutat de la seua amiga. Així decideix realitzar una sol·licitud d'accés a informació pública que li permeta completar les dades i poder comparar el servei de recollida de residus en totes dues poblacions.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=8)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=11)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '3.4':
            term = 'Transparència'
            bot.sendMessage(msg.from.id, 'Transparència: \n Capacitat de les administracions públiques de no limitar la informació a través de la publicitat activa, dret d\'accés a la informació i les dades obertes.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Una persona amb dificultats de mobilitat troba problemes per a reciclar correctament els residus en el contenidor específic, no obstant això, una amiga seua que viu en una altra ciutat no té problemes. La persona decideix buscar en el portal de transparència els contractes relatius al reciclatge dels diferents residus a la seua ciutat i a la ciutat de la seua amiga per a comparar-ho i veure si les dificultats que pateix poden ser degudes al contracte de reciclatge de residus de la seua ciutat. La informació és obligada per la normativa de transparència i troba que a la ciutat de la seua amiga és completa i té molts detalls. A la seua ciutat, encara que està la informació bàsica del contracte, no està prou detallada per a comparar-la amb la de la ciutat de la seua amiga. Així decideix realitzar una sol·licitud d'accés a informació pública que li permeta completar les dades i poder comparar el servei de recollida de residus en totes dues poblacions.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=8)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=11)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concepte: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
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
            term = 'Govern obert';
            bot.sendMessage(msg.from.id, 'Govern obert: \n Té com a objectiu que la ciutadania i les organitzacions de qualsevol tipus col·laboren en la creació i millora de serveis públics i les polítiques públiques consolidant la transparència i la rendició de comptes.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Una persona amb dificultats de mobilitat troba problemes per a reciclar correctament els residus en el contenidor específic, no obstant això, una amiga seua que viu en una altra ciutat no té problemes. La persona decideix buscar en el portal de transparència els contractes relatius al reciclatge dels diferents residus a la seua ciutat i a la ciutat de la seua amiga per a comparar-ho i veure si les dificultats que pateix poden ser degudes al contracte de reciclatge de residus de la seua ciutat. La informació és obligada per la normativa de transparència i troba que a la ciutat de la seua amiga és completa i té molts detalls. A la seua ciutat, encara que està la informació bàsica del contracte, no està prou detallada per a comparar-la amb la de la ciutat de la seua amiga. Així decideix realitzar una sol·licitud d'accés a informació pública que li permeta completar les dades i poder comparar el servei de recollida de residus en totes dues poblacions. Una persona periodista s'ha interessat per la dificultat d'accés als contenidors per a les persones amb dificultats de mobilitat. Amb les dades sobre ubicació dels diferents contenidors i les xifres de reciclatge elabora una notícia per a un periòdic local amb la finalitat de visibilitzar la problemàtica. L'ajuntament, motivat per la sol·licitud d'accés a informació i per la notícia elaborada per la persona periodista, decideix realitzar una reunió per a trobar una solució al problema en la qual participen les persones afectades de la seua ciutat, diferents fabricadores de contenidors i també convida als responsables del mateix servei en l'altra ciutat i a diverses persones amb problemes de mobilitat de l'altra ciutat.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=3)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=6)\n'
            + '· [Link 3](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=3)\n'
            + '· [Link 4](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=7)\n'
            + '· [Link 5](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=9)\n'
            + '· [Link 6](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=10)\n'
            + '· [Link 7](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=19)\n'
            + '· [Link 8](https://datos.gob.es/sites/default/files/doc/file/open_data_publicacion_y_reutilizacion_de_datos_abiertos_como_iniciativa_de_gobierno_abierto_en_la_administracion_compressed.pdf#page=5)\n'
            + '· [Link 9](https://www.youtube.com/watch?v=wcao6i1yDQ4)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '4.2':
            term = 'Bon govern'
            bot.sendMessage(msg.from.id, 'Bon Govern: \n Forma d\'exercici del poder caracteritzada per l\'eficiència, la transparència, la rendició de comptes, la participació ciutadana i l\'estat de dret, que manifesta la decisió del govern d\'utilitzar els recursos disponibles a favor del desenvolupament social, mediambiental i econòmic per a tots.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, "Aplicació pràctica:\n" +
                                                                "Una persona con dificultades de movilidad encuentra problemas para reciclar correctamente los residuos en el contenedor específico, sin embargo, una amiga suya que vive en otra ciudad no tiene problemas. La persona decide buscar en el portal de transparencia los contratos relativos al reciclaje de los distintos residuos en su ciudad y en la ciudad de su amiga para compararlo y ver si las dificultades que sufre pueden ser debidas al contrato de reciclaje de residuos de su ciudad. La información es obligada por la normativa de transparencia y encuentra que en la ciudad de su amiga es completa y tiene muchos detalles pero que no tienen en su ciudad. Aunque está la información básica del contrato, no está suficientemente detallada para compararla con la de la ciudad de su amiga. Así decide realizar una solicitud de acceso a información pública que le permita completar los datos y poder comparar el servicio de recogida de residuos en ambas poblaciones." +
                                                                "Una persona periodista se ha interesado por la dificultad de acceso a los contenedores para las personas con dificultades de movilidad. Con los datos sobre ubicación de los distintos contenedores y las cifras de reciclaje elabora una noticia para un periódico local con la finalidad de visibilizar la problemática." +
                                                                "El ayuntamiento, motivado por la solicitud de acceso a información y por la noticia elaborada por la persona periodista, decide realizar una reunión para encontrar una solución al problema en la que participen las personas afectadas de su ciudad, a distintos fabricantes de contenedores y también invita a los responsables del mismo servicio en la otra ciudad y a varias personas con problemas de movilidad de la otra ciudad." +
                                                                "Fruto de la reunión, una de las empresas que fabrica contenedores decide involucrarse en el diseño contenedores que además de mejorar el reciclaje para las personas con movilidad reducida, resulten asequibles por el ayuntamiento y sean respetuosos con el medio ambiente.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](https://casaasia.es/governasia/boletin2/3.pdf#page=5)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '4.3':
            term = 'Consell de transparència';
            bot.sendMessage(msg.from.id, 'Consell de transparència: \n Organisme encarregat de vetlar per la transparència de l\'activitat pública i garantir el dret d\'accés a la informació que tenen els ciutadans o ciutadanes i organitzacions.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "L'alumnat realitza una consulta al Consell de transparència per a saber quina informació pot sol·licitar al centre en funció dels seus interessos. Els alumnes i alumnes sol·licita al centre la informació tal com els ha indicat el Consell de Transparència i ja saben que si el centre la denega, posaran una reclamació al Consell de transparència.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=9)\n'

            , {parse_mode: "Markdown"});}, 2000)
            break;
        case '4.4':
            term = 'Polítiques públiques'
            bot.sendMessage(msg.from.id, 'Polítiques públiques: \n Mesures dutes a terme pels governs en matèria de les seues competències amb la finalitat de complir les expectatives de la ciutadania.');
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Aplicació pràctica:\n' +
                                "Els delegats i delegades del centre educatiu han aconseguit que tant el seu centre com altres centres educatius de la seua ciutat i d'altres ciutats proposen en les respectives ciutats una gestió eficient de l'aigua i l'ús d'energia solar als centres. Els diferents ajuntaments decideixen que l'Agenda 2030 i els ODS suposaran l'eix transversal de les polítiques públiques de l'ajuntament.");}, 1000);
            setTimeout(function(){ bot.sendMessage(msg.from.id, 'Ací tens més informació:\n'
            + '· [Link 1](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+ESO/#page=10)\n'
            + '· [Link 2](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=10)\n'
            + '· [Link 3](http://laaventuradeaprender.intef.es/documents/10184/78318/Guia+Bachillerato#page=13)\n'

            , {parse_mode: "Markdown"});}, 2000)    
            break;
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("botdb");
        today = new Date();
        var miconsulta = { userid: msg.from.id , concepte: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + " ha consultat:" + term);
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
        var miconsulta = { userid: msg.from.id , concepte: nivelActual, terme: term, dia: today.getUTCDate(), mes: today.getMonth(), any: today.getFullYear(), hora: today.getHours(), min: today.getMinutes() };
        dbo.collection("consultes").insertOne(miconsulta, function(err, res) {
          if (err) throw err;
          console.log(msg.from.id + " ha consultat:" + term);
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