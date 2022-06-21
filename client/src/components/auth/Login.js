import React,{Fragment,useState} from 'react';
import {Link,Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';


const Login = ({login,isAuthenticated}) => {
    const [formData,setFormData] = useState({
        email:"",
        password:""
    });

    const {email,password} = formData;
    
    function handleChange(event){
        const {name,value} = event.target
        return(
            setFormData({...formData,[name]:value})
        )
    }
    async function handleSubmit(event){
        event.preventDefault();
        console.log(formData);
        login(email,password);

    }

    //Redirect to dashboard if logged in
    if(isAuthenticated){
      return <Redirect to="/dashboard" />
    }

  return (

    <Fragment>
        {/* <div class="alert alert-danger">
        Invalid credentials
      </div> */}
      <h1 class="large text-primary">Sign In</h1>
      <p class="lead"><i class="fas fa-user"></i> Sign into Your Account</p>
      <form class="form" onSubmit={handleSubmit}>
        <div class="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            required
            value={email}
            onChange={handleChange}
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <input type="submit" class="btn btn-primary" value="Login" />
      </form>
      <p class="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  )
};

Login.PropTypes = {
  login:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool
}

const mapStateToProp = state => ({
  isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProp,{login})(Login)
