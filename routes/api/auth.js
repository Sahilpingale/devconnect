const express = require('express');
const router = express.Router();
const auth =require('../../middleware/auth')
const {check,validationResult} = require("express-validator");
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../models/User')

//@Route    GET api/auth
//@desc     Authorization
//access    Public
router.get('/',auth, async(req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
    // res.send('Auth Route')
})


/////////////

//@route    POST api/auth
//@desc     Authenticate User and get Token
//@access   Public
router.post(('/'),[
    check('email',"Please enter  email").isEmail(),
    check('password',"Please enter a password ").exists()

], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    //if there are no validation errors- code below
    const {email,password}=req.body;

    try{
        //See if user exists
        let user = await User.findOne({email})
        if(!user){
           return res.status(400).json({errors:[{msg: "Invalid Credentials"}]})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({errors:[{msg: "Invalid Credentials"}]})
        }

        //Return jsonWebToken
        const payload = {
            user:{
                id :user.id
            }
        }

        jwt.sign(payload,config.get('jwtSecret'),{ expiresIn :3600000},(err,token) => {
            if(err) throw err;
            res.json({token})
        })

        // res.send('User Route')
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }
    
})

module.exports = router;