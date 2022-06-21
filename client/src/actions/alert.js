import { SET_ALERT, REMOVE_ALERT } from "./types";
// import {uuidv4} from 'uuid';
import { v4 as uuidv4 } from 'uuid';
uuidv4();

export const setAlert = (msg,alertType) => dispatch =>{
    const id = uuidv4();

    dispatch({
        type:SET_ALERT,
        payload:{msg,alertType,id}
    });
    setTimeout(()=>dispatch({type:REMOVE_ALERT,payload:id}),5000)
}