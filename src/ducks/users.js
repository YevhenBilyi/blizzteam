import axios from 'axios';

const initialState={
    user:{},
    allData:{},
    users:[],
    channels:[]
}

const GET_USER_INFO='GET_USER_INFO';
const UPDATE_USER='UPDATE_USER';
const UPDATE_ALL_DATA='UPDATE_ALL_DATA';
const GET_ALL_USERS='GET_ALL_USERS';
const GET_ALL_CHANNELS='GET_ALL_CHANNELS';

export function getAllChannels(){
    let allChannels=axios.get('/api/channels').then(res=>{
        return res.data
    })
    return {
        type:GET_ALL_CHANNELS,
        payload: allChannels
    }
}

export function getAllUsers(){
    let allUsers=axios.get('/api/users').then(res=>{
        return res.data
      })
      return {
          type:GET_ALL_USERS,
          payload:allUsers
      }
}

export function updateUser(battleTag, server, mmr, tier,hero){
    axios.put('/api/user',{battleTag, server, mmr, tier,hero})
            return {
        type:UPDATE_USER,
        payload:initialState.user 
    }
}

export function getAllData(){
    let allUserData=axios.get('/api/getalldata').then(res=>{
        return res.data
    })
    return{
        type:UPDATE_ALL_DATA,
        payload:allUserData
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

        case UPDATE_ALL_DATA+'_FULFILLED':
        return Object.assign({},state, {allData:action.payload})

        case GET_ALL_USERS+'_FULFILLED':
        return Object.assign({}, state, {users:action.payload})

        case GET_ALL_CHANNELS+'_FULFILLED':
        return Object.assign({}, state, {channels:action.payload})



        default: 
        return state
    }


}