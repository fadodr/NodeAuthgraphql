const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {graphqlHTTP} = require('express-graphql');
const resolver = require('./graphql/resolver');
const graphschema = require('./graphql/schema');

app.use('/graphql', graphqlHTTP({
    schema : graphschema,
    rootValue : resolver,
    graphiql : true,
    formatError(error){
        if(!error.originalError){
            return error
        }
        const message = error.message;
        const data = error.originalError.data;
        const code = error.originalError.code
        return { message : message, code : code, data : data};
    }
}))

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.code = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.code).json({
        error : error.message
    })
})

mongoose.connect('mongodb+srv://fadodatabase:playboy10@shop.kqlba.mongodb.net/Users?retryWrites=true&w=majority')
.then( result => console.log('conneted'))

module.exports = app;