'use strict';

const Hapi = require('hapi');
var requestHandler = require('./requestHandler');
var fs = require('fs');
var inert = require('inert');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.register(require("inert"),(err)=>{

    server.route({
        method: 'GET',
        path:'/public/js/{path*}', 
        config : {
            handler : {directory: {path: './public/js/', listing: false}},
            cache: {
                expiresIn: 10 * 60 * 1000
            },
            auth: false
        }
    });
    // Add the route
    server.route({
        method: 'GET',
        path:'/hello', 
        handler: function (request, reply) {

            return reply('hello world');
        }
    });

    server.route({
        method: 'POST',
        path:'/exportpdf', 
        config: {
            payload:{
                maxBytes:209715200,
                output:'stream',
                parse: false
            }, 
            handler: requestHandler.uploadFiles
        }
        
    });

    server.route({
        method: 'POST',
        path:'/canvas', 
        handler: requestHandler.canvas
    
    });

    server.route({
        method: 'POST',
        path:'/table2pdf', 
        handler: requestHandler.table2pdf
    
    });

    server.route({
        method: 'GET',
        path:'/canvg', 
        handler: requestHandler.canvg
    
    });

    server.route({
        method: 'POST',
        path:'/canvgserver', 
        handler: requestHandler.canvgserver
    
    });

    server.route({
        method: 'POST',
        path:'/finalPdf', 
        handler: requestHandler.finalPdf
    
    });
    server.route({
        method: 'GET',
        path:'/index', 
        handler: requestHandler.index
    });

    server.route({
        method: 'GET',
        path:'/phantomtest', 
        handler: requestHandler.phantomtest
    });

});





// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});