import React,{Fragment, useState,} from 'react'
import {Link,Redirect} from 'react-router-dom';
import {register} from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

 const Register = ({setAlert,register,isAuthenticated}) => {
  
  const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:"",
    password2:""
});
const {name,email,password,password2} = formData;

function handleChange(event){
    const {name,value} = event.target
    // console.log(event.target)
    // console.log(formData)
    //  setFormData({...formData,[event.target.name]:event.target.value})
     setFormData({...formData,[name]:value})
};
function handleClick(event){
    event.preventDefault();
    if(password !== password2){
        setAlert('Passwords do not match','danger')
    }else{
      // console.log(name)
      // console.log(email)
      // console.log(password)
        register({name,email,password});
    }
};

//Redirect to dashboard if authenticated
if(isAuthenticated){
  return <Redirect to="/dashboard" />
}

return(
<Fragment>
    <h1 className="large text-primary">Sign Up</h1>
    <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
    <form className="form" onSubmit={handleClick}>
    <div className="form-group">
      <input type="text" placeholder="Name" name="name" value={name} onChange={handleChange} required />
    </div>
    <div className="form-group">
      <input type="email" placeholder="Email Address" name="email" value={email} onChange={handleChange} />
      <small className="form-text"
        >This site uses Gravatar so if you want a profile image, use a
        Gravatar email</small>
    </div>
    <div className="form-group">
      <input
        type="password"
        placeholder="Password"
        name="password"
        minLength="6"
        value={password}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <input
        type="password"
        placeholder="Confirm Password"
        name="password2"
        minLength="6"
        value={password2}
        onChange={handleChange}
      />
    </div>
    <input type="submit" className="btn btn-primary" value="Register"/>
  </form>
  <p className="my-1">
    Already have an account? <Link to="/login">Sign In</Link>
  </p>
</Fragment>
); 
};

Register.PropTypes = {
  register:PropTypes.func.isRequired,
  setAlert:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool
}

const mapStateToProp = state => ({
  isAuthenticated :state.auth.isAuthenticated
})

export default connect (mapStateToProp,{setAlert,register})(Register);