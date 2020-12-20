import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
const isEmpty = require('is-empty');
const axios = require('axios');
const SET_CURRENT_USER = "SET_CURRENT_USER";
const USER_LOADING = "USER_LOADING";

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
};

// Set logged in user
const setCurrentUser = decoded => {
    return {
    type: SET_CURRENT_USER,
    payload: decoded
    };
};

// Loading user
// const setUserLoading = () => {
//     return {
//         type: USER_LOADING
//     };
// };

//Register user
export const registerUserThunk = (userData, history) => async(dispatch) => {
    try {
        let res = await axios.post('/api/auth/register', userData)
        if(res) {
            history.push('/')
        }
    } catch(err) {
        console.log(err);
    }
};

// Log in user
export const loginUserThunk = (userData,history) => async(dispatch) => {
    try {
        let res = await axios.post('/api/auth/login', userData);
        if(res) {
            const token = res['data']['token']
            const id = res['data']['user'].id
            sessionStorage.setItem("stockAPI", token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            sessionStorage.setItem('email', decoded.email);
            sessionStorage.setItem('id', id);
            dispatch(setCurrentUser(decoded));
            history.push('/home')
        } 
    } catch(err) {
        console.log(err);
    }
}

// Log user out
export const logoutUserThunk = (history) => async(dispatch) => {
    // Remove token from local storage
    sessionStorage.removeItem("stockAPI");
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('id');
    // Remove auth header for future requests
    setAuthToken(false);
     // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
    history.push('/');
    
};

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user:action.payload,
            };
        case USER_LOADING:
            return {
                ...state,
                loading:true
            };
        default:
            return state;
    }
}