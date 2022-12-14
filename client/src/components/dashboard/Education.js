import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux'
import { deleteEducation } from '../../actions/profile';

const Education = ({education, deleteEducation}) => {
    const educations = education.map(edu=>(
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td>{edu.degree}</td>
            <td>{edu.fieldofstudy}</td>
            <td>
                <Moment format='DD/MM/YYYY'>{edu.from}</Moment> - {' '}{edu.to === null? ('Now') : (<Moment format='DD/MM/YYYY'>{edu.to}</Moment>)}
            </td>
            <td>
                <button onClick={()=> deleteEducation(edu._id)} className='btn btn-danger'>Delete</button>
            </td>
        </tr>
    ))
  return (
    <Fragment>
        <h2 className='my-2'>Education Credentials</h2>
        <table className='table'>
            <thead>
                <tr>
                    <th>School</th>
                    <th className='hide-sm'>Degree</th>
                    <th className='hide-sm'>Field of study</th>
                    <th>Years</th>
                    <th />
                </tr>
            </thead>
            <tbody>{educations}</tbody>
        </table>
    </Fragment>
  )
}

Education.propTypes = {
    deleteEducation:PropTypes.func.isRequired,
    education:PropTypes.array.isRequired
}

export default connect(null,{ deleteEducation })(Education);