var fs = require('fs'),
    multiparty = require('multiparty');

function exportpdf(){
    console.log("exportPdf Called");
}

function uploadFiles(request, reply){
    console.log("uploadfiles triggered");
    var form = new multiparty.Form();
    console.log(request);
    form.parse(request.payload, function(err, fields, files) {
        console.log("payload parsed");
        console.log(fields.name);
        if (err) return reply(err);
        else upload(files, reply);
    });
}

var upload = function(files, reply) {
    console.log("upload triggered");
    fs.readFile(files.file[0].path, function(err, data) {
        checkFileExist();
        fs.writeFile('./public/uploads/' + files.file[0].originalFilename, data, function(err) {
            if (err) {
                return reply(err);
            }else{
                exportpdf(files,reply);
                console.log("exportPdfsdsdsds triggered");
            } 
        });
    });
};
var exportpdf = function(files,reply){
    console.log("exportPdf triggered");
    "use strict"
    global.window = {document: {createElementNS: () => {return {}} }};
    global.navigator = {};
    global.btoa = () => {};

    var fs = require('fs');
    var jsPDF = require('jspdf');
    var base64Img = require('base64-img');

    var imgData = base64Img.base64Sync('pie-legend.jpg');

    //console.log(imgData);
    //var filepath = base64Img.imgSync(imgData, '', 'out');
    
    let pdfContent = new jsPDF();
    pdfContent.setTextColor(100);
    pdfContent.text(20, 20, 'Hello world!');
    pdfContent.addPage();
    pdfContent.addImage(imgData, 'JPEG',  40, 20, 0, 0);

                    
    let data = pdfContent.output('arraybuffer');

    let buffer = Buffer.from(data);
    let arraybuffer = Uint8Array.from(buffer);

    fs.appendFile('./sample.pdf', new Buffer(arraybuffer), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("PDF created");
        }
    });



    delete global.window;
    delete global.navigator;
    delete global.btoa;
    // response.writeHead(200, {"Content-Type": "text/plain"});
    
    // console.log("Request handler 'pdfexport' was called.");
    return reply('File uploaded to: ' + './public/uploads/' + files.file[0].originalFilename);
}

var checkFileExist = function() {
    fs.exists('./public', function(exists) {
        if (exists === false) fs.mkdirSync('./public');

        fs.exists('./public/uploads', function(exists) {
            if (exists === false) fs.mkdirSync('./public/uploads');
        });
    });
};


var canvas = function(request, reply){

    "use strict"
    global.window = {document: {createElementNS: () => {return {}} }};
    global.navigator = {};
    global.btoa = () => {};
    var fs = require('fs');
    var jsPDF = require('jspdf');
    var base64Img = require('base64-img');
    console.log(request.payload.canvasobj);

    let imgData=request.payload.canvasobj;
    let pdfContent = new jsPDF();
    pdfContent.addImage(imgData, 'PNG',  40, 20, 0, 0);

                    
    let data = pdfContent.output('arraybuffer');

    let buffer = Buffer.from(data);
    let arraybuffer = Uint8Array.from(buffer);

    fs.appendFile('./canvas.pdf', new Buffer(arraybuffer), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("PDF created");
        }
    });
    // var form = new multiparty.Form();
    
    // form.parse(request.payload, function(err, fields, files) {
    //     console.log(fields.canvas);
    //     reply("received canvas");
    // });
    delete global.window;
    delete global.navigator;
    delete global.btoa;
    reply("received canvas");
}

var index = function(request, reply){
    var html=`<html>
    <head>
        <script src="public/js/html2canvas/dist/html2canvas.min.js"></script>
        <script src="public/js/jquery/dist/jquery.min.js"></script>
        
        <script>
            $(document).ready(function(){
                html2canvas(document.body, {
                    onrendered: function(canvas) {
                        console.log(canvas);
                        $.ajax({
                            async:true,
                            url:"http://localhost:8000/canvas",
                            type:"post",
                            data:{"canvasobj":canvas.toDataURL('image/png')},
                            success:function(result,status,xhr){
                                alert("success");
                            },error:function(xhr,status,error){
                                alert("error");
                            }
                    });
                    }
                });
            });
            
        </script>
    </head>
    <body>
        <h1>VBI DX Components</h1>
    </body>
</html>`;
    reply(html);
}

exports.index = index;
exports.canvas = canvas;
exports.exportpdf = exportpdf;
exports.uploadFiles = uploadFiles;