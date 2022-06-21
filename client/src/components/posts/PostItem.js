import React, { Fragment } from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import {addLike,removeLike,deletePost} from '../../actions/post';

const PostItem = ({showActions,deletePost,addLike,removeLike,auth,postData:{_id,text,name,avatar,user,likes,comments,date} }) => {
  return (
    <div >
        <div className="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${user}`}>
            {/* Avatar */}
              <img
                className="round-img"
                src={avatar}
                alt=""
              />
            {/* UserName */}
              <h4>{name}</h4>
            </Link>
          </div>
          <div>
            {/* Post Text */}
            <p className="my-1">
              {text}
            </p>
            {/* Date Created on */}
             <p className="post-date">
                Posted on {<Moment format='DD/MM/YY'>{date}</Moment>}
            </p>
            {/* showActions is true */}
            {showActions && (<Fragment>
              {/* Like Button */}
            <button onClick={e=>addLike(_id)} type="button" className="btn btn-light">
              <i className="fas fa-thumbs-up"></i>
              <span>
                  {
                      likes.length > 0 && <span>{likes.length}</span>
                  }
              </span>
            </button>
            {/* Dislike Button */}
            <button onClick={e=>removeLike(_id)} type="button" className="btn btn-light">
              <i className="fas fa-thumbs-down"></i>
            </button>
            {/* Discussion */}
            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Comments
                  <span>{comments.length > 0 && (<span className='comment-count'>{comments.length}</span>)}</span>    
            </Link>
            {/* Delete Post button */}
            {!auth.loading && user === auth.user._id && ( <button      
            type="button"
            className="btn btn-danger"
            onClick={e=>deletePost(_id)}>
                <i className="fas fa-times"></i>
            </button>)}
            </Fragment>)}
            
           
          </div>
        </div>
    </div>
  )
}
PostItem.defaultProps ={
  showActions:true
};

PostItem.propTypes = {
    postData:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired,
    addLike:PropTypes.func.isRequired,
    removeLike:PropTypes.func.isRequired,
    deletePost:PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    auth:state.auth
});

export default connect(mapStateToProps,{ addLike,removeLike,deletePost })(PostItem);