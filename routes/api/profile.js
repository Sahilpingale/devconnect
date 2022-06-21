const express = require('express');
const { check ,validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile');
// const { findOneAndUpdate } = require('../../models/User');
const User = require('../../models/User')
const request = require('request');
const config = require('config');
const Post = require('../../models/Post')


//@route    GET api/profile/me
//@desc     Get current user's profile
//@access   Private
router.get('/me',auth, async(req,res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        res.json(profile)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


//@route    GET api/profile
//@desc     Create or Update User's Profile
//@access   Private
router.post('/',[auth,
    [check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()]],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } =req.body;

        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills) {
            profileFields.skills = skills.toString().split(',').map(skill => skill.trim());
        }

        //Buid social object
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;

        try{
            // console.log(req.user)
            let profile = await Profile.findOne({user:req.user.id})
            //Update
            if(profile){
                profile = await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true});
                return res.json(profile);
            }


            //Create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);


        }catch(err){
            console.error(err.message);
            res.status(500).send('Server Error')
        }
});

//@route    GET api/profile
//@desc     Get all profiles
//@access   Public

router.get('/',async(req,res)=> {
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});


//@route    GET api/user/:user_id
//@desc     Get profile by user id
//@access   Public
router.get('/user/:user_id',async(req,res)=> { 
    try {
            const profile =await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
            if(!profile) return res.status(400).json({msg:'No profile for this user'});
        
            res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg:'No profile for this user'})
        }
        res.status(500).send('Server Error 1');
    }

});

//@route    DELETE api/profile
//@desc     Delete user,profile,post
//@access   Private

router.delete('/',auth, async(req,res)=> {
    try {
        //
        await Post.deleteMany({ user:req.user.id })
        //Delete Profile
         await Profile.findOneAndDelete({user:req.user.id})
         //Delete User
         await User.findOneAndDelete({_id:req.user.id})

        res.json({msg:'User deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    PUT api/profile/experience
//@desc     Add profile experience
//@access   Private

router.put('/experience', [auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','From is required').not().isEmpty()
]], async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() })
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp ={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user:req.user.id });

        profile.experience.unshift(newExp); 
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete profile experience
//@access   Private
router.delete('/experience/:exp_id', auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({ user:req.user.id})

        //Create Remove index
        const removeIndex = profile.experience.map( item => item.id).indexOf(req.params.exp_id);
        // console.log(removeIndex);

        //Remove experience using removeIndex

        if(removeIndex > -1){
            profile.experience.splice(removeIndex,1);
            await profile.save();
            res.json(profile);
        }
        else{
            // res.json({msg:'Experience doesnt exist'});
            res.json(profile);
        }
        

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});
////////////////
//@route    PUT api/profile/education
//@desc     Add profile education
//@access   Private

router.put('/education', [auth,[
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy','Field of study is required').not().isEmpty(),
    check('from','From is required').not().isEmpty()
]], async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() })
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu ={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user:req.user.id });

        profile.education.unshift(newEdu); 
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route    DELETE api/profile/education/:exp_id
// @desc     Delete profile education
// @access   Private
router.delete('/education/:edu_id', auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({ user:req.user.id})

        //Create Remove index
        const removeIndex = profile.education.map( item => item.id).indexOf(req.params.edu_id);
        // console.log(removeIndex);

        //Remove education using removeIndex

        if(removeIndex > -1){
            profile.education.splice(removeIndex,1);
            await profile.save();
            res.json(profile);
        }
        else{
            // res.json({msg:'education doesnt exist'});
            res.json(profile);
        }
        

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});
// @route    GET api/profile/github/:username
// @desc     Get user repo from github
// @access   Public
router.get('/github/:username',(req,res)=>{
    try {
        // "githubClientId":"c555cee1f0e2bd591c7e",
        // "githubSecret":"0dba0ece22edaf5198bda062bbdcf08b5af29489"
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`
          )
        const options ={
            uri,
            method :'GET',
            headers :{ 'user-agent':'node.js'}
        }
        
        request(options,(error,response,body)=>{
            if(error) console.error(error);

            if(response.statusCode != 200){
                res.status(404).json({msg:'No GitHub profile found'});
            }
            res.json(JSON.parse(body));
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;