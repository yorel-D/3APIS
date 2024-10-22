const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'RailRoad',
    description: 'API pour la gestion des trains et des tickets',
  },
  host: 'localhost:5001'
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];


swaggerAutogen(outputFile, routes, doc);
