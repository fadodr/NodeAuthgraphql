const User = require('../model/userschema');
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    signup : async ({userinput}, req) =>{
        const errors = [];
        if(!validator.isEmail(userinput.email)){
            errors.push('please enter a valid email address');
        }

        if(validator.isEmpty(userinput.password)){
            errors.push('Please input a password');
        }

        if(errors.length > 0){
            const error = new Error('Invalid input')
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existinguser = await User.findOne({ email : userinput.email});
        if(existinguser){
            const error = new Error('User already exist');
            error.code = 500;
            throw error;
        }

        const name = userinput.name;
        const username = userinput.username;
        const email = userinput.email;
        const password = userinput.password;

        const hashpwd = await bcrypt.hash(password, 10);
        const user = new User({
            name : name,
            username : username,
            email : email,
            password : hashpwd,
        })

        const createduser = await user.save();
        return { ...createduser._doc, _id : createduser._id.toString()}
    },

    login : async ({username, password}) => {
        try {
            const existinguser = await User.findOne({username : username});
            if(!existinguser){
                const error = new Error('User does not exist')
                error.code = 500;
                throw error;
            }
            try{
                const isequal = await bcrypt.compare(password, existinguser.password)
                if(!isequal){
                    const error = new Error('Incorrect password')
                    error.code = 422;
                    throw error;
                }
                const token = await jwt.sign({ id : existinguser._id, email : existinguser.email}, 'somesecretthing', {expiresIn : '1h'})
                const expiresin = new Date(new Date().getTime() + 7200750).toUTCString()
                console.log(expiresin)
                return { tokendata : { token : token, expiresIn : expiresin }, _id : existinguser._id, name : existinguser.name, email : existinguser.email}
            }
            catch(error){
                error.code = 500;
                throw error;
            }
        }
        catch(error){
            error.code = 500;
            throw error;
        }
    }
}