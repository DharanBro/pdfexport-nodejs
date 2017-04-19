let pdfData=require('./jsonData').pdf_data; 
let fs=require('fs');
fs.writeFile('input',new Buffer(JSON.stringify(pdfData)).toString('base64'));

