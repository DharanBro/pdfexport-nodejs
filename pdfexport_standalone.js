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

var finalPdf = function(){

    var fs = require('fs');
    var obj;
    fs.readFile('input', 'utf8', function (err, filedata) {
        if (err) throw err;


        //let pdfData=request.payload.pdfData;
        let pdfData=JSON.parse(Buffer.from(filedata, 'base64'));
        //let pdfData=JSON.parse(filedata);
        //let pdfData=require('./jsonData').pdf_data; 
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

        // reply("Process finished");
    });
    
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

finalPdf();