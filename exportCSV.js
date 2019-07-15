var cp = require('child_process').exec;
var mongoExport;

module.exports = {
    export2csv: function () {
        var command = 'mongoexport --db botdb --collection consultes --fields _id,userid,concepte,terme,dia,mes,any,hora,min --csv';
        /* mongoExport = spawn('mongoexport', [ 
            '--db', 'botdb', '--collection', 'consultes', 
            '--fields',
            '_id,userid,concepte,terme,dia,mes,any,hora,min',   
            '--csv'
        ]); */
        var child = cp(command, {cwd: 'C:\Program Files\MongoDB\Server\4.0\bin'}, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
/*           });

        mongoExport.stdout.on('data', (data) => {
            console.log(`mongoexport-stdout: ${data}`);
        });

        mongoExport.stderr.on('data', (data) => {
            console.log(`mongoexport-stderr: ${data}`);
        }); */
        });
    }
}
