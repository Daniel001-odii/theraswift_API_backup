const express = require("express");
const mongoose = require("mongoose");

// Connect to our MongoDB database.
mongoose.connect("mongodb://localhost:27017/dbName", { useNewUrlParser: true });

// Body parameters validation middleware. 
function validateBodyParams(req, res, next) {   
    const validEmail = req.body.email && 
        typeof req.body.email === "string" && 
        req.body.email.trim() !== "";
    const validFirstName = req.body.firstName && 
        typeof req.body.firstName === "string" && 
        req.body.firstName.trim() !== "";
    const validDateOfBirth = req.body.dateOfBirth && 
        typeof req.body.dateOfBirth === "string" && 
        req.body.dateOfBirth.trim() !== "";
    const validLastName = req.body.lastName && 
        typeof req.body.lastName === "string" && 
        req.body.lastName.trim() !== "";
    const validPassword = req.body.password && 
        typeof req.body.password === "string" && 
        req.body.password.trim() !== "" && 
        req.body.password === req.body.passwordConfirmation;
    const validMobileNumber = req.body.mobileNumber && 
        typeof req.body.mobileNumber === "string" && 
        req.body.mobileNumber.trim() !== "" && 
        req.body.mobileNumber === req.body.mobileNumberConfirmation;
    const validEmailConfirmation = req.body.emailConfirmation && 
        typeof req.body.emailConfirmation === "string" && 
        req.body.emailConfirmation.trim() !== "" && 
        req.body.email === req.body.emailConfirmation;
    const validGender = req.body.gender && 
        (req.body.gender === 'male' || req.body.gender === 'female');

    if (validEmail && validFirstName && validDateOfBirth && validLastName && validPassword && validMobileNumber && validEmailConfirmation && validGender) {
        // All fields are valid and present, proceed to the next middleware or route handler.
        next(); 
    } else {
        res.status(400).json({ message: "Bad Request. Password, passwordConfirmation and email, emailConfirmation must match. All fields required." });
    }
}

const app = express();
app.use(express.json()); // Allows parsing of JSON in requests. 

// Signup end-point. 
app.post('/signup', validateBodyParams, (req, res) => {
    const { email, firstName, dateOfBirth, lastName, password, mobileNumber, emailConfirmation, gender } = req.body;
    // Create a user object from the request body. 
    const userObj = { email, firstName, dateOfBirth, lastName, password, mobileNumber, emailConfirmation, gender };
    
    // Create a new MongoDB document from the user object. 
    const user = new User(userObj); 
    user.save((err, doc) => {
        if(err) {
            console.log(err);
            res.status(500).json({ message: "Signup failed. Please try again later." });
        } else {
            res.status(200).json({ message: "Signup successful!" });
        }
    });
});

app.listen(3000, () => console.log('App listening on port