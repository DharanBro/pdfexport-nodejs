/** ====================================================================
 * jsPDF Cell plugin
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
 *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Hall, james@parall.ax
 *               2014 Diego Casorran, https://github.com/diegocr
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
 
 var jsPDF = require('jspdf');
(function(k){var u,A,B,p,q={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0},v=1,r=function(a,b,d,c,e){q={x:a,y:b,w:d,h:c,ln:e}},w={left:0,top:0,bottom:0};k.setHeaderFunction=function(a){p=a};k.getTextDimensions=function(a){u=this.internal.getFont().fontName;A=this.table_font_size||this.internal.getFontSize();B=this.internal.getFont().fontStyle;var b=19.049976/25.4,d;d=document.createElement("font");d.id="jsPDFCell";d.style.fontStyle=B;d.style.fontName=u;d.style.fontSize=A+"pt";d.innerText=a;document.body.appendChild(d);
a={w:(d.offsetWidth+1)*b,h:(d.offsetHeight+1)*b};document.body.removeChild(d);return a};k.getTextDimensionsPx=function(a){a=this.getTextDimensions(a);return{w:96*a.w/72,h:96*a.h/72}};k.cellAddPage=function(){var a=this.margins||w;this.addPage();r(a.left,a.top,void 0,void 0);v+=1};k.cellInitialize=function(){q={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0};v=1};k.cell=function(a,b,d,c,e,f,h){var g=q;void 0!==g.ln&&(g.ln===f?(a=g.x+g.w,b=g.y):(g.y+g.h+c+13>=this.internal.pageSize.height-(this.margins||
w).bottom&&(this.cellAddPage(),this.printHeaders&&this.tableHeaderRow&&this.printHeaderRow(f,!0)),b=q.y+q.h));if(void 0!==e[0])if(this.printingHeaderRow?this.rect(a,b,d,c,"FD"):this.rect(a,b,d,c),"right"===h){if(e instanceof Array)for(h=0;h<e.length;h++){var g=e[h],l=this.getStringUnitWidth(g)*this.internal.getFontSize();this.text(g,a+d-l-3,b+this.internal.getLineHeight()*(h+1))}}else this.text(e,a+3,b+this.internal.getLineHeight());r(a,b,d,c,f);return this};k.spanCell=function(a,b,d,c,e,f,h,g,l,
k,n,t){!0===g?this.setFontStyle("bold"):this.setFontStyle("normal");var m=q;void 0!==m.ln&&(m.ln===f?(a=m.x+m.w,b=m.y):(m.y+m.h+c+13>=this.internal.pageSize.height-(this.margins||w).bottom&&(this.cellAddPage(),this.printHeaders&&this.tableHeaderRow&&this.printHeaderRow(f,g,!0)),b=q.y+q.h));if(void 0!==e[0]){if(this.printingHeaderRow)if(void 0!==k&&void 0!==n){if("n"===k.toLowerCase()||"n"===n.toLowerCase())if("n"===k.toLowerCase())switch(n.toLowerCase()){case "s":this.line(a,b,a+d,b);this.line(a,
b,a,b+c);this.line(a,b+c,a+d,b+c);break;case "m":this.line(a,b,a+d,b);this.line(a,b+c,a+d,b+c);break;case "e":this.line(a,b,a+d,b),this.line(a+d,b,a+d,b+c),this.line(a,b+c,a+d,b+c)}else{if("n"===n.toLowerCase())switch(k.toLowerCase()){case "s":this.line(a,b,a+d,b);this.line(a,b,a,b+c);this.line(a+d,b,a+d,b+c);break;case "m":this.line(a,b,a,b+c);this.line(a+d,b,a+d,b+c);break;case "e":this.line(a,b,a,b+c),this.line(a+d,b,a+d,b+c),this.line(a,b+c,a+d,b+c)}}else if("s"===k.toLowerCase())switch(n.toLowerCase()){case "s":this.line(a,
b,a+d,b);this.line(a,b,a,b+c);break;case "m":this.line(a,b,a+d,b);break;case "e":this.line(a,b,a+d,b),this.line(a+d,b,a+d,b+c)}else if("m"===k.toLowerCase())switch(n.toLowerCase()){case "s":this.line(a,b,a,b+c);break;case "e":this.line(a+d,b,a+d,b+c)}else if("e"===k.toLowerCase())switch(n.toLowerCase()){case "s":this.line(a,b,a,b+c);this.line(a,b+c,a+d,b+c);break;case "m":this.line(a,b+c,a+d,b+c);break;case "e":this.line(a+d,b,a+d,b+c),this.line(a,b+c,a+d,b+c)}void 0!==t&&!0===t&&this.line(a,b+c,
a+d,b+c)}else this.rect(a,b,d,c,"FD"),void 0!==l&&0<l.length&&this.addImage(l,"PNG",a+2,b+3);else this.rect(a,b,d,c);if("right"===h)for(e instanceof Array||(e=[e]),h=0;h<e.length;h++)g=e[h],l=this.getStringUnitWidth(g)*this.internal.getFontSize(),this.text(g,a+d-l-3,b+this.internal.getLineHeight()*(h+1));else this.text(e,a+3,b+this.internal.getLineHeight())}r(a,b,d,c,f);return this};k.arrayMax=function(a,b){var d=a[0],c,e,f;c=0;for(e=a.length;c<e;c+=1)f=a[c],b?-1===b(d,f)&&(d=f):f>d&&(d=f);return d};
k.table=function(a,b,d,c,e){if(!d)throw"No data for PDF table";var f=[],h=[],g,l,p,n={},t={},m,r,y=[],x=[],u;p=!1;var z=!0;l=12;m=w;m.width=this.internal.pageSize.width;e&&(!0===e.autoSize&&(p=!0),!1===e.printHeaders&&(z=!1),e.fontSize&&(l=e.fontSize),e.margins&&(m=e.margins));this.lnMod=0;q={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0};v=1;this.printHeaders=z;this.margins=m;this.setFontSize(l);this.table_font_size=l;if(void 0===c||null===c)f=Object.keys(d[0]);else if(c[0]&&"string"!==typeof c[0])for(m=
19.049976/25.4,e=0,l=c.length;e<l;e+=1)g=c[e],f.push(g.name),h.push(g.prompt),t[g.name]=g.width*m;else f=c;if(p)for(u=function(a){return a[g]},e=0,l=f.length;e<l;e+=1){g=f[e];n[g]=d.map(u);y.push(this.getTextDimensions(h[e]||g).w);r=n[g];c=0;for(p=r.length;c<p;c+=1)m=r[c],y.push(this.getTextDimensions(m).w);t[g]=k.arrayMax(y)}if(z){n=this.calculateLineHeight(f,t,h.length?h:f);e=0;for(l=f.length;e<l;e+=1)g=f[e],x.push([a,b,t[g],n,String(h.length?h[e]:g)]);this.setTableHeaderRow(x);this.printHeaderRow(1,
!1)}e=0;for(l=d.length;e<l;e+=1)for(h=d[e],n=this.calculateLineHeight(f,t,h),c=0,x=f.length;c<x;c+=1)g=f[c],this.cell(a,b,t[g],n,h[g],e+2,g.align);this.lastCellPos=q;this.table_x=a;this.table_y=b;return this};k.calculateLineHeight=function(a,b,d){for(var c,e=0,f=0;f<a.length;f++)c=a[f],d[c]=this.splitTextToSize(String(d[c]),b[c]-3),c=this.internal.getLineHeight()*d[c].length+3,c>e&&(e=c);return e};k.setTableHeaderRow=function(a){this.tableHeaderRow=a};k.printHeaderRow=function(a,b,d){if(!this.tableHeaderRow)throw"Property tableHeaderRow does not exist.";
var c,e;this.printingHeaderRow=!0;void 0!==p&&(e=p(this,v),r(e[0],e[1],e[2],e[3],-1));!0===b?this.setFontStyle("bold"):this.setFontStyle("normal");var f=[];b=0;for(e=this.tableHeaderRow.length;b<e;b+=1)this.setFillColor(255,255,255),c=this.tableHeaderRow[b],d&&(c[1]=this.margins&&this.margins.top||0,f.push(c)),c=[].concat(c),this.spanCell.apply(this,c.concat(a));0<f.length&&this.setTableHeaderRow(f);this.setFontStyle("normal");this.printingHeaderRow=!1};k.printHeaderRows=function(a,b){if(!a||1>a)throw"headerRowsArray is empty or does not exist.";
var d,c,e,f;this.printingHeaderRow=!0;void 0!==p&&(c=p(this,v),r(c[0],c[1],c[2],c[3],-1));this.setFontStyle("bold");for(c=0;c<a.length;c++){e=0;for(f=a[c].length;e<f;e++)this.setFillColor(255,255,255),this.setDrawColor(0,0,0,.4),d=a[c][e],d=[].concat(d),this.cell.apply(this,d.concat(b));b+=1}this.setFontStyle("normal");this.printingHeaderRow=!1}})(jsPDF.API);
