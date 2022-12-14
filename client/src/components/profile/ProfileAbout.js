import React from 'react'
import PropTypes from 'prop-types'

const ProfileAbout = ({profileData:{
    bio,skills,user:{name}
}}) => {
  return (
    <div class="profile-about bg-light p-2">
          <h2 class="text-primary">{name}'s Bio</h2>
          <p>
            {bio}
          </p>
          <div class="line"></div>
          <h2 class="text-primary">Skill Set</h2>
          <div class="skills">
            {skills.map((skill,index)=>{
               return <div key={index} className="p-1">
                    <i className='fas fa-check'/>{skill}
                </div>
            })}
          </div>
        </div>
  )
}

ProfileAbout.propTypes = {
    profile:PropTypes.object.isRequired
}

export default ProfileAbout