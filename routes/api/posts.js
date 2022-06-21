const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

//Require models
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//@route    POST api/posts
//@desc     Create a post
//@access   Private

router.post('/',[auth,[
    check('text','Text field is required').not().isEmpty()
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400)._construct.json({errors:errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        //create and save post
        const newPost = new Post({
            text: req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        });
        // console.log(req.user.id);

        const post = await newPost.save();
        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    

});

//@route    POST api/posts/:id
//@desc     Get post by ID
//@access   Private
router.get('/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }
        res.json(post);

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        return res.status(500).send('Server Error');

    }
});

//@route    GET api/posts/
//@desc     Get all posts
//@access   Private
router.get('/',auth,async(req,res)=>{
    try {
        const posts = await Post.find().sort({date:-1});
        res.json(posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/posts/:id
//@desc     Delete post by ID
//@access   Private
router.delete('/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }

        //Check User
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        }
        await post.remove();
        res.json({msg:'Post Removed'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private
router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }

        //Check if post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0 ){
            return res.status(400).json({msg:'Post has already been liked'});
        }

        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//@route    PUT api/posts/unlike/:id
//@desc     unlike a post
//@access   Private
router.put('/unlike/:id',auth,async(req,res) => {
    try {
        const post =await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({msg:'Post not found'});
        }

        //Create remove index
        const removeIndex = post.likes.map( like=>like.user.toString()).indexOf(req.user.id);
        console.log(removeIndex);
        console.log(post.likes);

        if(removeIndex > -1){
            post.likes.splice(removeIndex,1);
            await post.save();
            res.json(post.likes);
        }
        else if(removeIndex < 0){
            return res.status(400).json({msg:'Post has not been liked yet'});
        }
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});

//@route    POST api/posts/comment/:id
//@desc     Comment on a post
//@access   Private

router.post('/comment/:id',[auth,[
    check('text','Text is required')
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user.id).select('-password');

        const newComment = {
            text: req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        };

        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/posts/comment/:post_id/:comment_id
//@desc     Delete a comment
//@access   Private

router.delete('/comment/:post_id/:comment_id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.post_id);
        // const user = await User.findById(req.user.id).select('-password');
        const comment = post.comments.find( comment => comment.id === req.params.comment_id);

        // Check User
        // console.log(comment.user.toString());
        // console.log(comment);
        if(!comment){
            return res.status(404).json({msg:'Comment doesnt exist'})
        }
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        }

        if(!post){
            return res.status(404).json({msg:'Post doesnt exist'})
        }

        //Create remove index
        // console.log(post.comments)
        const removeIndex = post.comments.map( comment => comment.user.toString()).indexOf(req.user.id);
        // console.log(removeIndex);
        if(removeIndex > -1){
            post.comments.splice(removeIndex,1);
            await post.save();
            res.json(post.comments);
        }else if(removeIndex < 0){
            res.status(404).json({msg:'Comment not found'});
        }
       

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;