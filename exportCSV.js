var spawn = require('child_process').spawn;
var mongoExport;

function export2csv() {
    mongoExport = spawn('mongoexport', [ 
        '--db', 'botdb', '--collection', 'consultes', 
        '--fields',
        '_id,userid,concepte,terme,dia,mes,any,hora,min',   
        '--csv'
    ]);

    mongoExport.stdout.on('data', (data) => {
        console.log(`mongoexport-stdout: ${data}`);
      });

    mongoExport.stderr.on('data', (data) => {
        console.log(`mongoexport-stderr: ${data}`);
    });
}