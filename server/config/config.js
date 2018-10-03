//PUERTO
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//URL BD
let URL_DB = ''

if (process.env.NODE_ENV === 'dev') {
    URL_DB = 'mongodb://localhost:27017/cafe';
} else {
    URL_DB = 'mongodb://cafe-user:ABC123@ds259732.mlab.com:59732/node-cafe'
}

process.env.URL_DB = URL_DB;
