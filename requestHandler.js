var fs = require('fs'),
    multiparty = require('multiparty');

var pageDimensions = {
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

var phantomtest = function(request, reply){
    var html=`<html> <body> <div id="LOCATIONANALYZER_1_control" data-sap-ui="LOCATIONANALYZER_1_control" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgb(128, 128, 128); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 228px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: hidden; padding: 0px; pointer-events: auto; position: relative; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: none; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 516px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 258px 114px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 258px 114px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);" class="zenControl MapV3 leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom" tabindex="0"><div class="leaflet-pane leaflet-map-pane" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 228px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: absolute; resize: none; right: 516px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 0; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: matrix(1, 0, 0, 1, 0, 0); transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div class="leaflet-pane leaflet-tile-pane" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 0; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div class="leaflet-layer " style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 1; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div class="leaflet-tile-container leaflet-zoom-animated" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 18; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: matrix(1, 0, 0, 1, 0, 0); transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><img alt="" role="presentation" src="https://c.tiles.mapbox.com/v3/visualbi.jn18f940/4/3/5.png" class="leaflet-tile leaflet-tile-loaded" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: -256px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 256px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: -256px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 256px; will-change: opacity; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 128px 128px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: matrix(1, 0, 0, 1, 97, -164); transform-origin: 128px 128px 0px; transform-style: flat; -webkit-user-drag: none; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><img alt="" role="presentation" src="https://a.tiles.mapbox.com/v3/visualbi.jn18f940/4/3/6.png" class="leaflet-tile leaflet-tile-loaded" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: -256px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 256px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: -256px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 256px; will-change: opacity; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 128px 128px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: matrix(1, 0, 0, 1, 97, 92); transform-origin: 128px 128px 0px; transform-style: flat; -webkit-user-drag: none; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><img alt="" role="presentation" src="https://b.tiles.mapbox.com/v3/visualbi.jn18f940/4/2/5.png" class="leaflet-tile leaflet-tile-loaded" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: -256px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 256px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: -256px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 256px; will-change: opacity; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 128px 128px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: matrix(1, 0, 0, 1, -159, -164); transform-origin: 128px 128px 0px; transform-style: flat; -webkit-user-drag: none; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><img alt="" role="presentation" src="https://a.tiles.mapbox.com/v3/visualbi.jn18f940/4/4/5.png" class="leaflet-tile leaflet-tile-loaded" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: -256px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 256px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: -256px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 256px; will-change: opacity; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 128px 128px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: matrix(1, 0, 0, 1, 353, -164); transform-origin: 128px 128px 0px; transform-style: flat; -webkit-user-drag: none; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><img alt="" role="presentation" src="https://c.tiles.mapbox.com/v3/visualbi.jn18f940/4/2/6.png" class="leaflet-tile leaflet-tile-loaded" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: -256px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 256px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: -256px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 256px; will-change: opacity; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 128px 128px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: matrix(1, 0, 0, 1, -159, 92); transform-origin: 128px 128px 0px; transform-style: flat; -webkit-user-drag: none; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><img alt="" role="presentation" src="https://b.tiles.mapbox.com/v3/visualbi.jn18f940/4/4/6.png" class="leaflet-tile leaflet-tile-loaded" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: -256px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 256px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: -256px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 256px; will-change: opacity; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 128px 128px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: matrix(1, 0, 0, 1, 353, 92); transform-origin: 128px 128px 0px; transform-style: flat; -webkit-user-drag: none; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div></div></div><div class="leaflet-pane leaflet-shadow-pane" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 0; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div><div class="leaflet-pane leaflet-overlay-pane" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 0; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div><div class="leaflet-pane leaflet-marker-pane" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 0; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div><div class="leaflet-pane leaflet-tooltip-pane" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 0; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div><div class="leaflet-pane leaflet-popup-pane" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 0; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div><div class="leaflet-proxy leaflet-zoom-animated" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: matrix(8, 0, 0, 8, 928.996, 1558.06); transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div></div><div class="leaflet-control-container" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 516px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 258px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 258px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div class="leaflet-top leaflet-left" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 153px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 75px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: 472px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 44px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 1000; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 22px 37.5px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 22px 37.5px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div class="leaflet-control-zoom leaflet-bar leaflet-control" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box padding-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 2px solid rgba(0, 0, 0, 0.2); border-radius: 4px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: both; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: left; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 61px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 10px 0px 0px 10px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: relative; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 30px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 800; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: padding-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 17px 32.5px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 17px 32.5px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><a class="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in" style="animation: none 0s ease 0s 1 normal none running; background: none 50% 50% / auto no-repeat scroll padding-box border-box rgb(255, 255, 255); background-blend-mode: normal; border-color: rgb(0, 0, 0) rgb(0, 0, 0) rgb(204, 204, 204); border-radius: 4px 4px 0px 0px; border-style: none none solid; border-width: 0px 0px 1px; border-collapse: separate; border-image-outset: 0px; border-image-repeat: stretch; border-image-slice: 100%; border-image-source: none; border-image-width: 1; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Lucida Console&quot;, Monaco, monospace; font-kerning: auto; font-size: 22px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: bold; height: 30px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 30px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: center; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 1px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 30px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 15px 15.5px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 15px 15.5px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);">+</a><a class="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out" style="animation: none 0s ease 0s 1 normal none running; background: none 50% 50% / auto no-repeat scroll padding-box border-box rgb(255, 255, 255); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px 0px 4px 4px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Lucida Console&quot;, Monaco, monospace; font-kerning: auto; font-size: 24px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: bold; height: 30px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 30px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: center; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 1px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 30px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 15px 15px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 15px 15px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);">-</a></div></div><div class="leaflet-top leaflet-right" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 170px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 58px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 458px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 58px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 1000; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 29px 29px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 29px 29px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div class="leaflet-control-layers leaflet-control" aria-haspopup="true" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box padding-box rgb(255, 255, 255); background-blend-mode: normal; border: 2px solid rgba(0, 0, 0, 0.2); border-radius: 5px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: both; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: right; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 44px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 10px 10px 0px 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: relative; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 44px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 800; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: padding-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 24px 24px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 24px 24px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><a class="leaflet-control-layers-toggle" href="#" title="Layers" style="animation: none 0s ease 0s 1 normal none running; background: none 50% 50% / auto no-repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 120, 168); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 120, 168); cursor: auto; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 44px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 120, 168) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: underline solid rgb(0, 120, 168); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 44px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 120, 168); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 22px 22px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: underline; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 22px 22px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></a><form class="leaflet-control-layers-list" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: none; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: auto; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: auto; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 50% 50%; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 50% 50% 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div class="leaflet-control-layers-base" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: auto; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: auto; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 50% 50%; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 50% 50% 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div><div class="leaflet-control-layers-separator" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border-color: rgb(221, 221, 221) rgb(0, 0, 0) rgb(0, 0, 0); border-radius: 0px; border-style: solid none none; border-width: 1px 0px 0px; border-collapse: separate; border-image-outset: 0px; border-image-repeat: stretch; border-image-slice: 100%; border-image-source: none; border-image-width: 1; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: none; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 5px -10px 5px -6px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: auto; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 50% 50%; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 50% 50% 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div><div class="leaflet-control-layers-overlays" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: auto; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: auto; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 50% 50%; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 50% 50% 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div></form></div></div><div class="leaflet-bottom leaflet-left" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 160px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: 506px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 68px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 10px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 1000; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 5px 80px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 5px 80px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div class="leaflet-bottom leaflet-left leaflet-control" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: both; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 0px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px 0px 10px 10px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 150px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 1000; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><a href="http://visualbi.com/sap-design-studio/dsx-extensions/" target="_blank" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px solid rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 3px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 120, 168); cursor: auto; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 27px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 3px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 120, 168) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: -75px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: underline solid rgb(0, 120, 168); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: -30px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 72px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 120, 168); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 36px 13.5px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: underline; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 36px 13.5px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><img src="zen/mimes/sdk_include/com.visualbi.vbisuite/res/library/visualbi.png" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 120, 168); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 120, 168); cursor: auto; direction: ltr; display: inline; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 22px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 120, 168) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 120, 168); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 72px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 120, 168); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 36px 11px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: underline; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 36px 11px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></a></div><div class="legend-marker leaflet-control" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: both; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: left; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 150px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px 0px 10px 10px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: relative; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 800; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 75px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 75px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div id="legendBox" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: auto; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 150px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: auto; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 0px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 75px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 75px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"></div></div></div><div class="leaflet-bottom leaflet-right" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 0, 0); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 0, 0); cursor: -webkit-grab; direction: ltr; display: block; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 12px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 18px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 313px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 0, 0) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: none; position: absolute; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 0, 0); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 210px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 203px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 1000; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 0, 0); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 101.5px 9px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 101.5px 9px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><div class="leaflet-control-attribution leaflet-control" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(255, 255, 255, 0.701961); background-blend-mode: normal; border: 0px none rgb(51, 51, 51); border-radius: 0px; border-collapse: separate; bottom: 0px; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: both; clip: auto; color: rgb(51, 51, 51); cursor: auto; direction: ltr; display: block; empty-cells: show; float: right; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 11px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: 18px; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: 0px; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(51, 51, 51) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px 5px; pointer-events: auto; position: relative; resize: none; right: 0px; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(51, 51, 51); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: 0px; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: 193px; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: 800; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(51, 51, 51); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 101.5px 9px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 101.5px 9px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);"><a href="http://leafletjs.com" title="A JS library for interactive maps" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 120, 168); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 120, 168); cursor: auto; direction: ltr; display: inline; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 11px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: auto; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 120, 168) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 120, 168); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: auto; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 120, 168); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);">Leaflet</a> | © <a href="http://www.openstreetmap.org/copyright" style="animation: none 0s ease 0s 1 normal none running; background: none 0% 0% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0); background-blend-mode: normal; border: 0px none rgb(0, 120, 168); border-radius: 0px; border-collapse: separate; bottom: auto; box-shadow: none; box-sizing: content-box; break-after: auto; break-before: auto; break-inside: auto; caption-side: top; clear: none; clip: auto; color: rgb(0, 120, 168); cursor: auto; direction: ltr; display: inline; empty-cells: show; float: none; font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-kerning: auto; font-size: 11px; font-stretch: normal; font-style: normal; font-variant: normal; font-weight: normal; height: auto; image-rendering: auto; isolation: auto; justify-items: normal; justify-self: normal; left: auto; letter-spacing: normal; line-height: 18px; list-style: disc outside none; margin: 0px; max-height: none; max-width: none; min-height: 0px; min-width: 0px; mix-blend-mode: normal; object-fit: fill; object-position: 50% 50%; motion: none 0px auto 0deg; offset-rotate: auto 0deg; opacity: 1; orphans: 2; outline: rgb(0, 120, 168) none 0px; outline-offset: 0px; overflow-anchor: auto; overflow-wrap: normal; overflow: visible; padding: 0px; pointer-events: auto; position: static; resize: none; right: auto; speak: normal; table-layout: auto; tab-size: 8; text-align: start; text-align-last: auto; text-decoration: none solid rgb(0, 120, 168); text-decoration-skip: objects; text-underline-position: auto; text-indent: 0px; text-rendering: auto; text-shadow: none; text-size-adjust: 100%; text-overflow: clip; text-transform: none; top: auto; touch-action: auto; transition: all 0s ease 0s; unicode-bidi: normal; vertical-align: baseline; visibility: visible; white-space: normal; widows: 2; width: auto; will-change: auto; word-break: normal; word-spacing: 0px; word-wrap: normal; z-index: auto; zoom: 1; -webkit-appearance: none; backface-visibility: visible; -webkit-background-clip: border-box; -webkit-background-origin: padding-box; border-spacing: 0px; -webkit-border-image: none; -webkit-box-align: stretch; -webkit-box-decoration-break: slice; -webkit-box-direction: normal; -webkit-box-flex: 0; -webkit-box-flex-group: 1; -webkit-box-lines: single; -webkit-box-ordinal-group: 1; -webkit-box-orient: horizontal; -webkit-box-pack: start; columns: auto auto; column-gap: normal; column-rule: 0px none rgb(0, 120, 168); column-span: none; align-content: normal; align-items: normal; align-self: normal; flex: 0 1 auto; flex-flow: row nowrap; justify-content: normal; -webkit-font-smoothing: auto; grid-auto-columns: auto; grid-auto-flow: row; grid-auto-rows: auto; grid-area: auto / auto / auto / auto; grid-template-areas: none; grid-template-columns: none; grid-template-rows: none; grid-gap: 0px 0px; -webkit-highlight: none; hyphens: manual; -webkit-hyphenate-character: auto; -webkit-line-break: auto; -webkit-locale: &quot;en&quot;; -webkit-margin-collapse: collapse collapse; -webkit-mask-box-image-outset: 0px; -webkit-mask-box-image-repeat: stretch; -webkit-mask-box-image-slice: 0 fill; -webkit-mask-box-image-source: none; -webkit-mask-box-image-width: auto; -webkit-mask: none 0% 0% / auto repeat border-box border-box; -webkit-mask-composite: source-over; order: 0; perspective: none; perspective-origin: 0px 0px; -webkit-print-color-adjust: economy; -webkit-rtl-ordering: logical; shape-outside: none; shape-image-threshold: 0; shape-margin: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-text-combine: none; -webkit-text-decorations-in-effect: none; -webkit-text-emphasis: none rgb(0, 0, 0); -webkit-text-emphasis-position: over; -webkit-text-fill-color: rgb(0, 0, 0); -webkit-text-orientation: vertical-right; -webkit-text-security: none; -webkit-text-stroke: 0px rgb(0, 0, 0); transform: none; transform-origin: 0px 0px 0px; transform-style: flat; -webkit-user-drag: auto; -webkit-user-modify: read-only; user-select: none; -webkit-writing-mode: horizontal-tb; -webkit-app-region: no-drag; buffered-rendering: auto; clip-path: none; clip-rule: nonzero; mask: none; filter: none; flood-color: rgb(0, 0, 0); flood-opacity: 1; lighting-color: rgb(255, 255, 255); stop-color: rgb(0, 0, 0); stop-opacity: 1; color-interpolation: sRGB; color-interpolation-filters: linearRGB; color-rendering: auto; fill: rgb(0, 0, 0); fill-opacity: 1; fill-rule: nonzero; marker: none; mask-type: luminance; shape-rendering: auto; stroke: none; stroke-dasharray: none; stroke-dashoffset: 0px; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 1px; alignment-baseline: auto; baseline-shift: 0px; dominant-baseline: auto; text-anchor: start; writing-mode: horizontal-tb; vector-effect: none; paint-order: fill; d: none; cx: 0px; cy: 0px; x: 0px; y: 0px; r: 0px; rx: auto; ry: auto; caret-color: rgb(0, 0, 0);">OpenStreetMap</a> contributors.</div></div></div></div> </body> </html>`;
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
   console.log("Docs Output",docs.output());

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

var canvg = function(request,reply){
    

    var html=`<html>
                <head>
                    <script src="public/js/jquery/dist/jquery.min.js"></script>
                    <script src="public/js/jspdf.debug.js"></script>
                    <script src="https://code.highcharts.com/highcharts.js"></script>
                    <script src="https://code.highcharts.com/modules/exporting.js"></script>

                    <script type="text/javascript" src="public/js/canvg_context2d/libs/rgbcolor.js"></script> 
                    <script type="text/javascript" src="public/js/canvg_context2d/libs/StackBlur.js"></script>
                    <script type="text/javascript" src="public/js/canvg_context2d/canvg.js"></script> 
                    <script type="text/javascript" src="public/js/circular-json/build/circular-json.js"></script> 
                    
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

                            

                            //makePdf().save();
                            makePdf();
                            
                        });

                        var makePdf = function () {
                            var pdf = new jsPDF('p', 'pt', 'a4');
                            var c = pdf.canvas;
                            c.width = 595;
                            c.height = 100;

                            var ctx = c.getContext('2d');
                            ctx.ignoreClearRect = true;
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, 595, 100);

                            //load a svg snippet in the canvas with id = 'drawingArea'
                            canvg(c, $("#container .highcharts-container").html(), {
                                ignoreMouse: true,
                                ignoreAnimation: true,
                                ignoreDimensions: true,
                                scaleWidth: 500,
                                scaleHeight: 300
                            });
                            console.log(c);
                            console.log(CircularJSON.stringify(c));
                            console.log(CircularJSON.parse(CircularJSON.stringify(c)));
                            var postData={
                                "pdfData" : CircularJSON.stringify(c)
                            }
                            $.ajax({
                                async:true,
                                url:"http://localhost:8000/canvgserver",
                                type:"POST",
                                data: {"svgData":$("#container .highcharts-container").html()},
                                success:function(result,status,xhr){
                                    alert("success");
                                },error:function(xhr,status,error){
                                    alert("error");
                                }
                            });

                            return pdf;
                        };
                        
                    </script>
                </head>
                <body>
                    <h1>VBI DX Components</h1>
                    <div id="container" style="min-width: 310px; max-width:595px; height: 400px; margin: 0 auto"></div>
                    <canvas id="canvas" width="1000px" height="600px"></canvas> 
                </body>
            </html>`;
    reply(html);

}

var canvgserver = function(request,reply){
    "use strict"
    // global.window = {document: {createElementNS: () => {return {}} }};
    //
    var jsdom = require("jsdom").jsdom;
    global.document = jsdom(undefined, {});
    global.window = document.defaultView;
    global.navigator = window.navigator;

    global.btoa = () => {};
   
    let fs = require('fs');
    let jsPDF = require('jspdf');
    let base64Img = require('base64-img');

    let canvg = require("./libs/canvg_context2d/canvg");
 
    let svg=request.payload.svgData;
    
    

    let pdf = new jsPDF("portrait", 'pt', "a4");

    //load a svg snippet in the canvas with id = 'drawingArea'
   // canvg(canvas, svg,{});

    var c = pdf.canvas;
    c.width = 595;
    c.height = 500;

    var ctx = c.getContext('2d');
    ctx.ignoreClearRect = true;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 595, 700);

    //load a svg snippet in the canvas with id = 'drawingArea'
    canvg(c, svg, {
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: true
    });

    console.log(pdf.canvas);
    //pdf.addSVG(svg, 40, 50, 0, 0);
    let pdfSVGData=pdf.output();
    fs.appendFile('./canvastest.pdf',pdfSVGData, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("PDF created");
        }
    });

    //fs.writeFileSync('./canvgserver.pdf', pdfData);
   // console.log(pdfData);
    var result = {"msg":"success"};
    delete global.window;
	delete global.navigator;
	delete global.btoa;
    reply(result);
}

var _exportTabletoPdf = function(rowsArray, component, pdf, startPosY, exportOptions, pageNumber, pageDimensions,pdf_prop,header_content,footer_content) {

    let orientation = pdf_prop.orientation;
    let pageSize = pdf_prop.format;
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
    var marginTop = startPosY+55;
    var hasConditionalFormatting = true; //NEED TO CHANGE THIS LATER
    //          var hasConditionalFormatting = sap.ui.getCore().getControl(component.id).getPropertyBag().isDisplayExceptions();

    var cellHeightPt = 20;
    var cellWidthPt = 100;


    if (exportOptions.showMetadata) {
        marginTop = 130;
    }

    var pageCrosstabDimensions = PDFCrosstabUtils().getPDFDimensions(pageDimensions[orientation][pageSize]['width'], pageDimensions[orientation][pageSize]['height'], cellWidthPt, cellHeightPt, marginTop, pageSize, orientation, exportOptions.showMetadata, pageNumber.toString(), exportOptions.footerText); //jshint ignore:line
    maxRows = pageCrosstabDimensions.maxRows;
    maxCols = pageCrosstabDimensions.maxCols;

    pdf.cellInitialize();
    pdf.setFontSize(10);

    noOfColHeaders = rowsArray.splice(0, 1)[0]; // i.e. number of rows which are column headers
    noOfRowHeaderCols = rowsArray.splice(0, 1)[0]; // i.e. number of columns which are header rows

    if (exportOptions.isWrapColHeadersChecked) {
        
        rowsArray = PDFTextWrappingUtils().markColumnHeaderRowsForExpansion(pdf, rowsArray, noOfColHeaders); //jshint ignore:line
        rowsArray = PDFTextWrappingUtils().expandColumnHeaderRowsAndWrapText(pdf, rowsArray, noOfColHeaders); //jshint ignore:line
        noOfColHeaders = rowsArray.splice(0, 1)[0];
    }

    if (exportOptions.isWrapRowHeadersChecked) {
       
        rowsArray = PDFTextWrappingUtils().markRowHeaderRowsForExpansion(pdf, rowsArray, noOfColHeaders, noOfRowHeaderCols); //jshint ignore:line
        rowsArray = PDFTextWrappingUtils().expandHeaderRowsAndWrapText(pdf, rowsArray, noOfColHeaders, noOfRowHeaderCols); //jshint ignore:line
    }

    rowsArray = PDFProcessingUtils().repeatColumnHeaders(rowsArray, maxRows, noOfColHeaders); //jshint ignore:line
    rowsArray = PDFProcessingUtils().repeatRowHeaders(rowsArray, maxCols, noOfRowHeaderCols); //jshint ignore:line

    // rowsArray now contains repeated column and row headers
    // Push each cell of the crosstab to jsPDF
   
    for (var rowCount = 0; rowCount < rowsArray.length; rowCount += maxRows) { // For each page // rowCount = no. of rows exported to PDF
        var noOfPagesAcross = 1; // no. of pages the crosstab is split across, horizontally, at a time
        
        if (rowsArray[rowCount].length > maxCols) {
            


            noOfPagesAcross = Math.ceil((rowsArray[rowCount].length - noOfRowHeaderCols) / maxCols); // total cols do not fit on a single page; split across several pages
        }

        var colCount = 0; // no. of cols exported to PDF
        
        for (var splitPageCount = 0; splitPageCount < noOfPagesAcross; splitPageCount++) {
            
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
                    
                    pdf.setTableHeaderRow(tableHeaderConfigs);
                    pdf.printHeaderRow(pageRowCount, isCellFontBold);
                    tableHeaderConfigs = [];
                }
            }

            // Add header and footer
            //  addPdfHeader(pdf, exportOptions);
            //  addPdfFooter(pdf, exportOptions);

            if (exportOptions.showMetadata) {
                
                addPdfMetadata(pdf, component, exportOptions.selectedPageSize, exportOptions.pageOrientation, exportOptions.pdfHeaderTextDate, //jshint ignore:line
                    exportOptions.pdfHeaderTextQuery, exportOptions.pdfHeaderTextVariables, exportOptions.pdfHeaderTextDynamic, //jshint ignore:line
                    exportOptions.pdfHeaderTextStatic); //jshint ignore:line
            }

            // Next page of PDF
            if ((pageRowCount + rowCount) < rowsArray.length || (noOfPagesAcross !== 1 && splitPageCount <= noOfPagesAcross - 2)) {
                
                pdf.cellAddPage();
                addHeaderFooter(pdf, (pageNumber+splitPageCount+1).toString(),pdf_prop,header_content,footer_content);
            }

            colCount += maxCols;
            tableHeaderConfigs = [];
        }
    }
    return noOfPagesAcross;
}

var finalPdf = function(request,reply){
    //let pdfData=request.payload.pdfData;
    let pdfData=require('./jsonData').pdf_data; 
    let pdfContent=pdfData.content;

    let header_content=pdfData.header;
    let footer_content=pdfData.footer;
    let pdf_prop=pdfData.pdf_prop;

    //console.log(pdfData.header);

    "use strict"
    var jsdom = require("jsdom").jsdom;
    global.document = jsdom(undefined, {});
    global.window = document.defaultView;
    global.navigator = window.navigator;

    global.btoa = () => {};
   
    let fs = require('fs');
    let jsPDF = require('jspdf');
    let Cell= require('./plugins/jspdf-plugin');
    let base64Img = require('base64-img');
    let canvg = require("./libs/canvg_context2d/canvg");
    
    let pdfDoc = new jsPDF(pdf_prop.orientation, 'pt', pdf_prop.format);

    

    let pageNumber=1;
    let startPosY;
    let svgCount=0;

    startPosY=addHeaderFooter(pdfDoc, pageNumber.toString(),pdf_prop,header_content,footer_content);
    var c = pdfDoc.canvas;
    c.width = 595;
    c.height = 500;

    var ctx = c.getContext('2d');

    ctx.ignoreClearRect = true;
    ctx.translate(0,startPosY+50);

    
    
    
    for(var eachPage in pdfContent){
        
        //console.log(eachPage+": "+pdfContent[eachPage].type);
        switch(pdfContent[eachPage].type){
            case 'image':
                
                let imgData=pdfContent[eachPage].data;
                //console.log(startPosY+50);
                pdfDoc.addImage(imgData, 'PNG',  40, startPosY+50, 0, 0);

                pdfDoc.addPage();
                pageNumber++;
                startPosY=addHeaderFooter(pdfDoc, pageNumber.toString(),pdf_prop,header_content,footer_content);
                
                break;
            case 'svg':
                          
                let svgData=pdfContent[eachPage].data;
                console.log(startPosY+50);
                   
                               

                //load a svg snippet in the canvas with id = 'drawingArea'
                canvg(c, svgData, {
                    ignoreMouse: true,
                    ignoreAnimation: true,
                    ignoreDimensions: true
                });

                pdfDoc.addPage();
                pageNumber++;
                startPosY=addHeaderFooter(pdfDoc, pageNumber.toString(),pdf_prop,header_content,footer_content);
                break;
            case 'table':
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
                
                let exportOptions = {};
                let crosstabs=crosstabstring[0];
                
                let pagesAcross=_exportTabletoPdf(crosstabs["TABLE_1_control"], "TABLE_1_control", pdfDoc, startPosY, exportOptions, pageNumber,pageDimensions,pdf_prop,header_content,footer_content);
                pageNumber+=pagesAcross;
                
                pdfDoc.addPage();
                startPosY=addHeaderFooter(pdfDoc, pageNumber.toString(),pdf_prop,header_content,footer_content);
                break;
            default:
                break;
        }
    }

    //console.log("Pagenumber",pageNumber);

    pdfDoc.deletePage(pageNumber);

    let data = pdfDoc.output('arraybuffer');

    fs.writeFileSync('./output.txt', pdfDoc.output());

    let buffer = Buffer.from(data);
    let arraybuffer = Uint8Array.from(buffer);
    fs.appendFile('./final.pdf', new Buffer(arraybuffer), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("PDF created");
        }
    });

    reply("Process finished");
} 

var addHeaderFooter = function(doc, pageNo, pdf_prop, header_content, footer_content){
    let imageWidth=201;
    let imageHeight=72;
    let retY;

    /***********************************************
    Header Generation
    Order of execution is important! Don't change it
    ************************************************/

    //Header image
    if(header_content.image!==""){

        var imagePosObj = getStartPosition(pdf_prop,
            false, 
            header_content.image_align, 
            imageWidth, 
            imageHeight);
            //console.log(pdf_prop.top_margin);
        imagePosObj.y=0+parseInt(pdf_prop.top_margin);
        //console.log("########################################",imagePosObj.y);
        doc.addImage(header_content.image, 'PNG',  imagePosObj.x, imagePosObj.y, 0, 0);
        
        retY = imagePosObj.y;
    }

    //Header text
    if(header_content.text!==""){
        doc.setFontSize(header_content.text_size);
        var textPosObj = getStartPosition(pdf_prop,
            false, 
            header_content.text_align, 
            header_content.text, 
            header_content.text_size);
        if(header_content.image_align===header_content.text_align & header_content.image!==""){
            
            textPosObj.y=imagePosObj.y+imageHeight;
        }
        doc.text(textPosObj.x, textPosObj.y, header_content.text);

        retY = retY>textPosObj.y?retY:textPosObj.y;
    }

    //Header date
    if(header_content.add_date==="true"){
        var date = new Date()
          .toDateString();
        doc.setFontSize(header_content.date_size);
        var datePosObj = getStartPosition(pdf_prop,
            false, 
            header_content.date_align, 
            date, 
            header_content.date_size);
        if(header_content.date_align===header_content.text_align && header_content.text!==""){
            datePosObj.y=textPosObj.y+parseInt(header_content.text_size);
            
        }else if(header_content.date_align===header_content.image_align && header_content.image!==""){
            datePosObj.y=imagePosObj.y+imageHeight;
        }
        doc.text(datePosObj.x, datePosObj.y, date);

        retY = retY>datePosObj.y?retY:datePosObj.y;
        
    }

    //Header page no
    if(header_content.add_page_no==="true"){

        doc.setFontSize(header_content.page_no_size);
        var pageNoPosObj = getStartPosition(pdf_prop,
            false, 
            header_content.page_no_align, 
            pageNo, 
            header_content.page_no_size);

        if(header_content.page_no_align===header_content.date_align && header_content.add_date==="true"){
            pageNoPosObj.y=datePosObj.y+parseInt(header_content.date_size);
            
        }else if(header_content.page_no_align===header_content.text_align && header_content.text!==""){
            pageNoPosObj.y=textPosObj.y+parseInt(header_content.text_size);
        }
        else if(header_content.page_no_align===header_content.image_align && header_content.image!==""){
            pageNoPosObj.y=imagePosObj.y+imageHeight;
        }

        doc.text(pageNoPosObj.x, pageNoPosObj.y, pageNo);

        retY = retY>pageNoPosObj.y?retY:pageNoPosObj.y;
    }

    /**********************************
    Footer Generation
    ***********************************/

    //Footer page no
    if(footer_content.add_page_no==="true"){

        doc.setFontSize(footer_content.page_no_size);
        var footerPagePosObj = getStartPosition(pdf_prop,
            true, 
            footer_content.page_no_align, 
            pageNo, 
            footer_content.page_no_size);

        doc.text(footerPagePosObj.x, footerPagePosObj.y, pageNo);
    }

    //Footer date
    if(footer_content.add_date==="true"){
        var date = new Date()
          .toDateString();
        doc.setFontSize(footer_content.date_size);
        var footerDatePosObj = getStartPosition(pdf_prop,
            true, 
            footer_content.date_align, 
            date, 
            footer_content.date_size);
        if(footer_content.date_align===footer_content.page_no_align){
            footerDatePosObj.y=footerPagePosObj.y-footer_content.date_size-5;
        }
        doc.text(footerDatePosObj.x, footerDatePosObj.y, date);
    }

    //Footer text
    if(footer_content.text!==""){
        doc.setFontSize(footer_content.text_size);
        var footerTextPosObj = getStartPosition(pdf_prop,
            true, // Footer content
            footer_content.text_align, 
            footer_content.text, 
            footer_content.text_size);

        if(footer_content.text_align===footer_content.date_align){
            footerTextPosObj.y=footerDatePosObj.y-footer_content.text_size-5;
        }else if(footer_content.text_align===footer_content.page_no_align){
            footerTextPosObj.y=footerPagePosObj.y-footer_content.text_size-5;
        }
            
        doc.text(footerTextPosObj.x, footerTextPosObj.y, footer_content.text);
    }

    //Footer image
    if(footer_content.image!==""){

        var footerImgPosObj = getStartPosition(pdf_prop,
            true, 
            footer_content.image_align, 
            imageWidth, 
            imageHeight);

        imagePosObj.y= pageDimensions[pdf_prop.orientation][pdf_prop.format]['height']-(parseInt(pdf_prop.top_margin)+imageHeight);
        if(footer_content.image_align===footer_content.text_align){
            footerImgPosObj.y=footerTextPosObj.y-imageHeight-5;
        }else if(footer_content.image_align===footer_content.date_align){
            footerImgPosObj.y=footerDatePosObj.y-imageHeight-5;
        }else if(footer_content.image_align===footer_content.page_no_align){
            footerImgPosObj.y=footerPagePosObj-imageHeight-5;
        }
        //console.log("Footer image y position",footerImgPosObj.y);
        doc.addImage(header_content.image, 'PNG',  footerImgPosObj.x, footerImgPosObj.y, 0, 0);
        
    }

    return retY;
}

var getStartPosition = function(pdf_prop, isFooter, alignment, content, fontSize, entireSpace) {
    let orientation = pdf_prop.orientation;
    let pageSize = pdf_prop.format;
    let topmargin =parseInt(pdf_prop.top_margin);
    let leftmargin = parseInt(pdf_prop.left_margin);
    var ps = pageDimensions[orientation][pageSize]['width'];
    //typeof content=="number"? console.log("Image", pageDimensions[orientation][pageSize]['height'] - topmargin - parseInt(fontSize)): console.log("not an image");
    //var unit = 72/25.4;
    var actualWidth = 0;
    //var pos = leftmargin;
    var retObj = {};
    if (entireSpace) {
      actualWidth = ps - leftmargin * 2;
      retObj = {
        'maxLen': actualWidth,
        'totalWidth': ps,
        'y': isFooter ? pageDimensions[orientation][pageSize]['height'] - topmargin : topmargin
      };
    } else {
      var padding = 3;
      actualWidth = (ps - leftmargin * 2 - padding * 2) / 3; // Dividing the Header/Footer area into 3 parts.
      retObj = {
        'maxLen': actualWidth,
        'y': isFooter ? typeof content=="number"? pageDimensions[orientation][pageSize]['height'] - topmargin - parseInt(fontSize) : pageDimensions[orientation][pageSize]['height'] - topmargin -parseInt(fontSize) - 5 : parseInt(topmargin + parseInt(fontSize))
      };
      if (alignment == 'center') {
        var paddedSize=ps-leftmargin*2-padding*2;  
        var textLength=content.length;
        //console.log(typeof content);
        if(typeof content=="number"){
            //for image
            let imageWidth=content;
            //console.log(imageWidth);
            //console.log(imageWidth);
            retObj.x = ((paddedSize/2)-(imageWidth/2))+leftmargin+20;
        }else{
            retObj.x = (paddedSize/2)-(textLength*(((22-4)/(48-8))*fontSize)/2);
        }
        
        //retObj.x = actualWidth + leftmargin + padding;
      } else if (alignment == 'right') {
        var paddedSize=ps-leftmargin*2-padding*2;  
        var textLength=content.length;
        retObj.x = paddedSize-textLength*(((22-4)/(48-8))*fontSize);
        //retObj.x = actualWidth * 2 + leftmargin + padding * 2;
      } else {
        retObj.x = leftmargin+10;
      }
    }

    return retObj;
}


exports.phantomtest = phantomtest;
exports.index = index;
exports.canvas = canvas;
exports.exportpdf = exportpdf;
exports.uploadFiles = uploadFiles;
exports.table2pdf = table2pdf;
exports.canvg = canvg;
exports.canvgserver = canvgserver;
exports.finalPdf = finalPdf;