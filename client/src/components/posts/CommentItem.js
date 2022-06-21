import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { removeComment } from '../../actions/post';
import Moment from 'react-moment';

const CommentItem = ({ removeComment,auth,postId,commentData:{_id,name,text,user,date,avatar} }) => {
  return (
    <div class="post bg-white p-1 my-1">
          <div>
            <a href="profile.html">
              <img
                class="round-img"
                src={avatar}
                alt=""
              />
              <h4>{name}</h4>
            </a>
          </div>
          <div>
            <p class="my-1">
              {text}
            </p>
             <p class="post-date">
                Posted on <Moment format='DD/MM/YY'>{date}</Moment>
            </p>
            {!auth.loading && user === auth.user._id && (
                <button
                onClick={e=>removeComment(postId,_id)}      
                type="button"
                class="btn btn-danger">
                <i class="fas fa-times"></i>
                </button>
            )}
          </div>
        </div>
  )
}

CommentItem.propTypes = {
    auth:PropTypes.object.isRequired,
    commentData:PropTypes.object.isRequired,
    postId:PropTypes.number.isRequired
}

const mapStateToProps = state => ({
    auth:state.auth
})

export default connect(mapStateToProps,{ removeComment })(CommentItem);