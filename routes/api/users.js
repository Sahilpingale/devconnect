const express = require('express');
const router = express.Router();
const {check,validationResult} = require("express-validator");

const User = require('../../models/User');
const gravatar = require("gravatar");
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken')

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post(('/'),[
    check('name',"Please enter a name").not().isEmpty(),
    check('email',"Please enter  email").isEmail(),
    check('password',"Please enter a password with min 6 characters").isLength({min:6})

], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    //if there are no validation errors- code below
    const {name,email,password}=req.body;

    try{
        //See if user exists
        let user = await User.findOne({email})
        if(user){
            res.status(400).json({errors:[{msg: "User already exists"}]})
        }

        //Get user gravitar
        const avatar = gravatar.url(email,{
            s:"200",
            r:'pg',
            d:'mm'
        });

        //Store user in db
        user = new User({
            name,
            email,
            avatar,
            password
        });

        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        // console.log(user.password)
        // console.log(`just pass ${password}`)
        user.password = await bcrypt.hash(password,salt) //?

        await user.save();

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