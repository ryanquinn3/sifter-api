const Hapi = require('hapi');
const sc = require('./lib/reddit');

const server = new Hapi.Server();

server.connection({
    host: '0.0.0.0',
    port: '5000',
    routes: {
        cors: true
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        sc.makeRequest()
            .then((response) => {
                reply({
                    count: response.length,
                    items: response
                })
            })
            .catch((err) => {
                console.log(err);
                reply(err);
            });
    }
});


server.start((err) => {
    if(err){
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`)
});
