const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type userdata{
        _id : ID!
        name : String!
        email : String!
        username : String!
        password : String!
    }
    type tokenData{
        token : String!
        expiresIn : String!
    }
    type authdata{
        tokendata : tokenData!
        _id : ID!
        name : String!
        email : String!
    }
    input userinputdata{
        name : String!
        email : String!
        username : String!
        password : String!
    }
    type rootmutation{
        signup(userinput : userinputdata) : userdata!
    }
    
    type rootquery{
        login(username : String!, password : String!) : authdata!
    }

    schema {
        mutation : rootmutation
        query : rootquery
    }
`)