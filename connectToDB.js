var url = "mongodb://localhost:puerto/newdb";

//crear clientet en mongoDB
var MongoClient = require('mongodb').MongoClient;

//conectar cliente al servicio
MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    console.log("Cambio a " + db.databaseName + "database");

    //documento a insertar
    var doc = { name: "Roshan", age: "22"};
    //esto debera pasarse como argumento de alguna funcion

    //insertar documento en coleccion

    db.collection("users").insertOne(doc, function(err, res) {
        if (err) throw err;
        console.log("Documento insertado");

        //cierre de conexion con db
        db.close();
    });
});
