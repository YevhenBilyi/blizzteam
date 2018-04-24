import axios from 'axios';

const initialState={
    user:{},
    server:0,
    battleTag:'',
    mmr:0,
    tier:''
}

const GET_USER_INFO='GET_USER_INFO';
const UPDATE_USER='UPDATE_USER';

export function updateUser(battleTag, server, mmr, tier){
    return {
        type:UPDATE_USER,
        payload:{battleTag,server,mmr,tier }
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

        case UPDATE_USER:
        return Object.assign({}, state, {battleTag:action.payload.battleTag, server:action.payload.server, mmr:action.payload.mmr,tier:action.payload.tier})


        default: 
        return state
    }


}