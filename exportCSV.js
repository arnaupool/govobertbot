var exec = require('child_process').exec;
var mongoExport;

module.exports = {
    export2csv: function () {
        var child = exec('mongoexport.bat', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
        });
    }
}
