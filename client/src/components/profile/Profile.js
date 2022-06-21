import React,{ Fragment,useEffect } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {getProfileById} from '../../actions/profile';
import Spinner from '../layout/Spinner';
import {Link} from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import GithubProfile from './GithubProfile';



const Profile = ({getProfileById,auth,match,profile:{profile,loading}}) => {
    useEffect(()=> {
        getProfileById(match.params.id)
    },[])
  return (
    <Fragment>
        {profile===null || loading ? (<Spinner />):(
            <Fragment>
                <Link to='/profiles' className='btn btn-light'>
                    Back To Profiles
                </Link>
                {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&
                (<Link to='/edit-profile' className='btn btn-dark'>Edit Profile</Link>)}
                <div className='profile-grid my-1'>
                    <ProfileTop profileData={profile} />
                    <ProfileAbout profileData={profile} />
                    <div className="profile-exp bg-white p-2">
                        <h2 className="text-primary">Experience</h2>
                        {
                            profile.experience.length >0 ?(
                                <Fragment>
                                    {profile.experience.map(experience=>(<ProfileExperience key={experience._id} expData={experience}/>))}
                                </Fragment>
                            ):(<h4>No experience credentials</h4>)
                        }
                    </div>

                    <div className="profile-edu bg-white p-2">
                        <h2 className="text-primary">Education</h2>
                        {
                            profile.education.length >0 ?(
                                <Fragment>
                                    {profile.education.map(education=>(<ProfileEducation key={education._id} eduData={education}/>))}
                                </Fragment>
                            ):(<h4>No education credentials</h4>)
                        }
                    </div>
                    {/* Github Repos div */}
                    {profile.githubusername && (<GithubProfile usernameData={profile.githubusername}/>)}
                </div>
            </Fragment>
        )}
    </Fragment>
  )
}

Profile.propTypes = {
    profile:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired,
    getProfileById:PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile:state.profile,
    auth:state.auth
});

export default connect(mapStateToProps,{ getProfileById })(Profile)
