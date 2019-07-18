var exec = require('child_process').exec;
var mongoExport;

module.exports = {
    export2csv: function (callback) {
        var creation = new Date();
        //mongoexport /db botdb /c consultes /type:csv /o Registro.csv /f _id,userid,concepte,terme,dia,mes,any,hora,min
        var command = 'mongoexport --db botdb --collection consultes --fields _id,userid,concepte,terme,dia,mes,any,hora,min --csv --out Registro.csv'
        if (process.platform == 'win32') {  
            var child = exec('mongoexport.bat', function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('win exec error: ' + error);
                    }
            callback(creation);
            });
        } else {
            var child = exec(command, function(error, stdout, stderr){
                console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('deb exec error: ' + error);
                    }
            callback(creation);
            });
        }
    }
}
