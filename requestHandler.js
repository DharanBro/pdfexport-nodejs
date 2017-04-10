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

var table2pdf = function(request,reply){

    "use strict"
    global.window = {document: {createElementNS: () => {return {}} }};
    global.navigator = {};
    global.btoa = () => {};
    //let crosstabstring = require("./jsonData").crosstabstring;
    let crosstabstring = [
        {
            "TABLE_1_control":[
                7,
                1,
                [
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"Number of Records",
                        "align":"left",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"205",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"3,075",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"410",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"205",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"820",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"5,740",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"1,435",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"1,025",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"1,845",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"14,760",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    }
                ],
                [
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"Consumption (Billion",
                        "align":"left",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"47",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"700",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"76",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"3",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"373",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"3,003",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"510",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"3,109",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"273",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"8,095",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    }
                ],
                [
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"Consumption (Billion",
                        "align":"left",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"490",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"7,248",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"783",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"39",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"3,855",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"31,073",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"5,282",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"32,153",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"2,853",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"83,775",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    }
                ],
                [
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"Consumption (Million",
                        "align":"left",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"0",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    }
                ],
                [
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"Consumption (Million",
                        "align":"left",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"2,437",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"36,398",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"2,388",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"778",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"4,882",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"72,747",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"12,371",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"73,407",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"10,614",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"216,022",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    }
                ],
                [
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"Consumption (Thousan",
                        "align":"left",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"41,847",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"631,405",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"36,579",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"15,608",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"29,605",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"924,754",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"159,005",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"971,538",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"173,604",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#F6F6F6",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"2,983,944",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    }
                ],
                [
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"Consumption (Terawat",
                        "align":"left",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"1,882",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"16,715",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"1,637",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"60",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"610",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"28,554",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"477",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"25,293",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"13,280",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    },
                    {
                        "symbol":"",
                        "color":"#FFFFFF",
                        "colSpanPos":"N",
                        "rowSpanPos":"N",
                        "text":"88,508",
                        "align":"right",
                        "isSpan":"false",
                        "fontColor":"#000000",
                        "isBold":"false",
                        "alertLvl":"0"
                    }
                ]
            ]
        }
    ];
    let fs = require('fs');
    let jsPDF = require('jspdf');
    let Cell= require('./plugins/jspdf-plugin');
    let base64Img = require('base64-img');
 
    

    let pageDimensions = {
        'p': {
        'a2': {
            'width': 1648,
            'footerY': 280,
            'height': 1191
        },
        'a3': {
            'width': 842,
            'footerY': 410,
            'height': 1191
        },
        'a4': {
            'width': 595,
            'footerY': 280,
            'height': 842
        },
        'a5': {
            'width': 420,
            'footerY': 200,
            'height': 595
        },
        'letter': {
            'width': 612,
            'footerY': 270,
            'height': 792
        },
        'legal': {
            'width': 612,
            'footerY': 340,
            'height': 1008
        },
        'ledger_tabloid': {
            'width': 792,
            'footerY': 340,
            'height': 1224
        }
        },
        'l': {
        'a2': {
            'width': 1648,
            'footerY': 280,
            'height': 1191
        },
        'a3': {
            'width': 1191,
            'footerY': 200,
            'height': 1191
        },
        'a4': {
            'width': 842,
            'footerY': 200,
            'height': 595
        },
        'a5': {
            'width': 595,
            'footerY': 200,
            'height': 420
        },
        'letter': {
            'width': 792,
            'footerY': 200,
            'height': 612
        },
        'legal': {
            'width': 1008,
            'footerY': 200,
            'height': 612
        },
        'ledger_tabloid': {
            'width': 1224,
            'footerY': 340,
            'height': 792
        }
        }
    };

    let docs = new jsPDF("portrait", 'pt', "a4");
    let pageNumber=0;
    let exportOptions = {};
    let crosstabs=crosstabstring[0];

    _exportTabletoPdf(crosstabs["TABLE_1_control"], "TABLE_1_control", docs, exportOptions, pageNumber,pageDimensions);


   let data = docs.output('arraybuffer');

   console.log("########################################################################################################################################################################################");
   //console.log("Docs Output",docs.output());

    let buffer = Buffer.from(data);
    let arraybuffer = Uint8Array.from(buffer);

    fs.writeFile('./document.pdf', new Buffer(arraybuffer), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 

    // fs.appendFile('./document.pdf', new Buffer(arraybuffer), function (err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("PDF created");
    //     }
    // });

	delete global.window;
	delete global.navigator;
	delete global.btoa;

    reply("pdf created");


}

var pdfFormat=function(){
  return 'a4';
};
var pdfOrientation=function(){
    return 'p';
}

var _exportTabletoPdf = function(rowsArray, component, pdf, exportOptions, pageNumber, pageDimensions) {
    // console.log(rowsArray);
    console.log("exporttable");
    let PDFCrosstabUtils = require('./plugins/tabletab');
    let PDFProcessingUtils = require('./plugins/tableprocessing');
    let PDFTextWrappingUtils = require('./plugins/tabletabtext');
    var cellObject;
    var cellText;
    var cellColor;
    var cellColorArray = [255, 255, 255];
    var cellFontColor;
    var cellFontColorArray = [0, 0, 0];
    var isCellFontBold;
    var cellSymbol;
    var symbolDataUrlsO = '';
    //  var cellAlertLevel;
    var cellAlignment;
    var isSpanCell;
    var rowSpanPos;
    var colSpanPos;
    var tableHeaderConfigs = []; // store array of cells in a header
    var noOfRowHeaderCols;
    var noOfColHeaders;
    var maxRows;
    var maxCols;
    var marginTop = 55;
    var hasConditionalFormatting = true; //NEED TO CHANGE THIS LATER
    //          var hasConditionalFormatting = sap.ui.getCore().getControl(component.id).getPropertyBag().isDisplayExceptions();

    var cellHeightPt = 20;
    var cellWidthPt = 100;

    console.log("initialization success");

    if (exportOptions.showMetadata) {
        marginTop = 130;
    }

    var pageCrosstabDimensions = PDFCrosstabUtils().getPDFDimensions(pageDimensions[pdfOrientation()][pdfFormat()]['width'], pageDimensions[pdfOrientation()][pdfFormat()]['height'], cellWidthPt, cellHeightPt, marginTop, pdfFormat(), pdfOrientation(), exportOptions.showMetadata, pageNumber.toString(), exportOptions.footerText); //jshint ignore:line
    maxRows = pageCrosstabDimensions.maxRows;
    maxCols = pageCrosstabDimensions.maxCols;

    pdf.cellInitialize();
    pdf.setFontSize(10);

    noOfColHeaders = rowsArray.splice(0, 1)[0]; // i.e. number of rows which are column headers
    noOfRowHeaderCols = rowsArray.splice(0, 1)[0]; // i.e. number of columns which are header rows

    if (exportOptions.isWrapColHeadersChecked) {
        console.log("isWrapColHeadersChecked", true);
        rowsArray = PDFTextWrappingUtils().markColumnHeaderRowsForExpansion(pdf, rowsArray, noOfColHeaders); //jshint ignore:line
        rowsArray = PDFTextWrappingUtils().expandColumnHeaderRowsAndWrapText(pdf, rowsArray, noOfColHeaders); //jshint ignore:line
        noOfColHeaders = rowsArray.splice(0, 1)[0];
    }

    if (exportOptions.isWrapRowHeadersChecked) {
        console.log("isWrapRowHeadersChecked", true);
        rowsArray = PDFTextWrappingUtils().markRowHeaderRowsForExpansion(pdf, rowsArray, noOfColHeaders, noOfRowHeaderCols); //jshint ignore:line
        rowsArray = PDFTextWrappingUtils().expandHeaderRowsAndWrapText(pdf, rowsArray, noOfColHeaders, noOfRowHeaderCols); //jshint ignore:line
    }

    rowsArray = PDFProcessingUtils().repeatColumnHeaders(rowsArray, maxRows, noOfColHeaders); //jshint ignore:line
    rowsArray = PDFProcessingUtils().repeatRowHeaders(rowsArray, maxCols, noOfRowHeaderCols); //jshint ignore:line

    // rowsArray now contains repeated column and row headers
    // Push each cell of the crosstab to jsPDF
    console.log(rowsArray.length);
    for (var rowCount = 0; rowCount < rowsArray.length; rowCount += maxRows) { // For each page // rowCount = no. of rows exported to PDF
        var noOfPagesAcross = 1; // no. of pages the crosstab is split across, horizontally, at a time
        console.log("eachData");
        if (rowsArray[rowCount].length > maxCols) {
            console.log("maxCols is lesser");
            console.log("rowCount ", rowCount);
            console.log("noOfRowHeaderCols ", noOfRowHeaderCols);
            console.log("rowsArray Length ", rowsArray.length);


            noOfPagesAcross = Math.ceil((rowsArray[rowCount].length - noOfRowHeaderCols) / maxCols); // total cols do not fit on a single page; split across several pages
        }

        var colCount = 0; // no. of cols exported to PDF
        console.log(noOfPagesAcross);
        for (var splitPageCount = 0; splitPageCount < noOfPagesAcross; splitPageCount++) {
            console.log("eachPage");
            for (var pageRowCount = 0; pageRowCount < maxRows && pageRowCount < rowsArray.length; pageRowCount++) { // pageRowCount: one of no. of rows which will fit on page
                var curRow = pageRowCount + rowCount;

                if (curRow >= rowsArray.length) {
                    break; // done with the crosstab
                }

                // loop through each col in this row
                for (var j = 0; j < maxCols; j++) { // looping through each col in this row
                    var curCol = colCount + j;
                    if (curCol >= rowsArray[rowCount].length) {
                        break; // done with this row
                    }

                    // Parse cell information
                    cellObject = rowsArray[curRow][curCol];

                    cellText = (cellObject.text === '') ? ' ' : cellObject.text; // Or else the cell doesn't get drawn by jsPDF

                    var hexToRgb = function(hex) {
                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return result ? parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) : null;
                    };

                    if (hasConditionalFormatting) {
                        cellColor = hexToRgb(cellObject.color);
                        cellColorArray = cellColor.split(',');
                        for (var k = 0; k < cellColorArray.length; k++) {
                            cellColorArray[k] = parseInt(cellColorArray[k]);
                        }

                        cellFontColor = hexToRgb(cellObject.fontColor);
                        cellFontColorArray = cellFontColor.split(',');

                        for (var l = 0; l < cellFontColorArray.length; l++) {
                            cellFontColorArray[l] = parseInt(cellFontColorArray[l]);
                        }
                    }

                    cellSymbol = cellObject.symbol + cellObject.alertLvl;
                    cellAlignment = cellObject.align;
                    isSpanCell = cellObject.isSpan;
                    rowSpanPos = cellObject.rowSpanPos;
                    colSpanPos = cellObject.colSpanPos;

                    pdf.setFillColor.apply(pdf, cellColorArray);
                    pdf.setTextColor.apply(pdf, cellFontColorArray);
                    pdf.setDrawColor(0.00, 0.00, 0.00, 0.40);

                    isCellFontBold = (cellObject.isBold === 'true') ? true : false;
                    if (isCellFontBold === true) {
                        pdf.setFontStyle('bold');
                    } else {
                        pdf.setFontStyle('normal');
                    }

                    var closeBottomBorder = false;
                    if (cellObject.isSpan && (pageRowCount === maxRows - 1)) {
                        closeBottomBorder = true;
                    }

                    pdf.printingHeaderRow = true;

                    if (pageRowCount + 1 < noOfColHeaders) {
                        console.log("one");
                        if (pageRowCount === 0) {
                            if (cellText.length > 20) {
                                if (cellText.length > 35) {
                                    cellText = cellText.substring(0, 35);
                                    cellText = cellText + '...';
                                }

                                cellText = pdf.splitTextToSize(cellText, 95);
                            }

                            if (isSpanCell.toLowerCase() === 'true') {
                                tableHeaderConfigs.push([10, marginTop, cellWidthPt, cellHeightPt, cellText, pageRowCount, cellAlignment, isCellFontBold, symbolDataUrlsO[cellSymbol], rowSpanPos, colSpanPos, closeBottomBorder]);
                            } else {
                                tableHeaderConfigs.push([10, marginTop, cellWidthPt, cellHeightPt, cellText, pageRowCount, cellAlignment, isCellFontBold]);
                            }
                        } else {
                            if (isSpanCell.toLowerCase() === 'true') {
                                tableHeaderConfigs.push([10, marginTop, cellWidthPt, cellHeightPt, cellText, pageRowCount, cellAlignment, isCellFontBold, symbolDataUrlsO[cellSymbol], rowSpanPos, colSpanPos, closeBottomBorder]);
                            } else {
                                tableHeaderConfigs.push([10, marginTop, cellWidthPt, cellHeightPt, cellText, pageRowCount, cellAlignment, isCellFontBold]);
                            }
                        }

                    } else {
                        console.log("two");
                        var cellConfigs;

                        if (isSpanCell.toLowerCase() === 'true') {
                            if (hasConditionalFormatting) {
                                cellConfigs = [10, marginTop, cellWidthPt, cellHeightPt, cellText, pageRowCount, cellAlignment, isCellFontBold, symbolDataUrlsO[cellSymbol], rowSpanPos, colSpanPos, closeBottomBorder];
                            } else {
                                cellConfigs = [10, marginTop, cellWidthPt, cellHeightPt, cellText, pageRowCount, cellAlignment, isCellFontBold, '', rowSpanPos, colSpanPos, closeBottomBorder];
                            }
                        } else {
                            cellConfigs = [10, marginTop, cellWidthPt, cellHeightPt, cellText, pageRowCount, cellAlignment, isCellFontBold];
                            if (hasConditionalFormatting) {} else {
                                cellConfigs.push('');
                            }
                        }
                        pdf.spanCell.apply(pdf, cellConfigs);
                    }
                }

                // Push rows which are column headers
                if (pageRowCount < noOfColHeaders) {
                    console.log("three");
                    pdf.setTableHeaderRow(tableHeaderConfigs);
                    pdf.printHeaderRow(pageRowCount, isCellFontBold);
                    tableHeaderConfigs = [];
                }
            }

            // Add header and footer
            //  addPdfHeader(pdf, exportOptions);
            //  addPdfFooter(pdf, exportOptions);

            if (exportOptions.showMetadata) {
                console.log("four");
                addPdfMetadata(pdf, component, exportOptions.selectedPageSize, exportOptions.pageOrientation, exportOptions.pdfHeaderTextDate, //jshint ignore:line
                    exportOptions.pdfHeaderTextQuery, exportOptions.pdfHeaderTextVariables, exportOptions.pdfHeaderTextDynamic, //jshint ignore:line
                    exportOptions.pdfHeaderTextStatic); //jshint ignore:line
            }

            // Next page of PDF
            if ((pageRowCount + rowCount) < rowsArray.length || (noOfPagesAcross !== 1 && splitPageCount <= noOfPagesAcross - 2)) {
                console.log("five");
                pdf.cellAddPage();
            }

            colCount += maxCols;
            tableHeaderConfigs = [];
        }
    }
}

var canvg = function(request,reply){
    // "use strict"
    // global.window = {document: {createElementNS: () => {return {}} }};
    // global.navigator = {};
    // global.btoa = () => {};
   
    // let fs = require('fs');
    // let jsPDF = require('jspdf');
    // let Cell= require('./plugins/jspdf-plugin');
    // let base64Img = require('base64-img');

    // let rbgcolor = require('./libs/canvg_context2d/libs/rgbcolor');
    // let StackBlur = require('./libs/canvg_context2d/libs/StackBlur');
    // let canvg = require('./libs/canvg_context2d/canvg');

    // var pdf = new jsPDF('p', 'pt', 'c1');
    // var c = pdf.canvas;
    // c.width = 1000;
    // c.height = 500;


    // delete global.window;
	// delete global.navigator;
	// delete global.btoa;

    var html=`<html>
    <head>
        <script src="public/js/jquery/dist/jquery.min.js"></script>
        <script src="public/js/jspdf.debug.js"></script>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>

        <script type="text/javascript" src="public/js/canvg_context2d/libs/rgbcolor.js"></script> 
        <script type="text/javascript" src="public/js/canvg_context2d/libs/StackBlur.js"></script>
        <script type="text/javascript" src="public/js/canvg_context2d/canvg.js"></script> 
        
        <script>
            $(document).ready(function(){
                Highcharts.chart('container', {
                    chart: {
                        type: 'bar',
                    },
                    title: {
                        text: 'Historic World Population by Region'
                    },
                    subtitle: {
                        text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
                    },
                    xAxis: {
                        categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Population (millions)',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ' millions'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            },                            
                            animation: false
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'Year 1800',
                        data: [107, 31, 635, 203, 2]
                    }, {
                        name: 'Year 1900',
                        data: [133, 156, 947, 408, 6]
                    }, {
                        name: 'Year 2012',
                        data: [1052, 954, 4250, 740, 38]
                    }]
                });

                

                makePdf();
                
            });

            var makePdf = function () {
                var pdf = new jsPDF('p', 'pt', 'c1');
                var c = pdf.canvas;
                c.width = 1000;
                c.height = 500;
                

                var ctx = c.getContext('2d');
                ctx.ignoreClearRect = true;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 1000, 700);
                var htmlString;
                //load a svg snippet in the canvas with id = 'drawingArea'
                $("#container").find("svg").each(function(){
                    var $target = $(this);

                    var $clone = $target.clone();
                    $clone.wrap('<div>');
                    htmlString = $clone.parent().html();
                    
                });
                // alert(htmlString);
                // var c = document.getElementById('canvas');
                // var ctx = c.getContext('2d');
                // ctx.drawSvg(htmlString, 0, 0, 1000, 500);

                canvg_context2d($("#canvas"), htmlString, {ignoreMouse: true, ignoreAnimation: true, ignoreDimensions: true});
                return pdf;
            };
            
        </script>
    </head>
    <body>
        <h1>VBI DX Components</h1>
        <div id="container" style="min-width: 310px; max-width: 800px; height: 400px; margin: 0 auto"></div>
        <canvas id="canvas" width="1000px" height="600px"></canvas> 
    </body>
</html>`;
    reply(html);

}

exports.index = index;
exports.canvas = canvas;
exports.exportpdf = exportpdf;
exports.uploadFiles = uploadFiles;
exports.table2pdf = table2pdf;
exports.canvg = canvg;