import axios from 'axios';

const initialState={
    user:{}
}

const GET_USER_INFO='GET_USER_INFO';
const UPDATE_USER='UPDATE_USER';

export function updateUser(battleTag, server, mmr, tier,hero){
    axios.put('/api/user',{battleTag, server, mmr, tier,hero})
            return {
        type:UPDATE_USER,
        payload:initialState.user 
    }
}

export function getUser(){
    let userData=axios.get('/auth/me').then(res=>{
        return res.data
    });
    return {
        type: GET_USER_INFO,
        payload: userData
    }
}
export default function reducer(state=initialState, action){
    switch (action.type){
        case GET_USER_INFO+'_FULFILLED':
        return Object.assign({}, state, {user:action.payload})

        case UPDATE_USER+'_FULFILLED':
        return Object.assign({}, state, {user:action.payload})


        default: 
        return state
    }


}