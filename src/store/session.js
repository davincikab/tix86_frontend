import { createSlice } from "@reduxjs/toolkit"


let userInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
const { reducer, actions} = createSlice({
    name:'session',
    initialState:{
        user:userInfo,
        profile:null,
        server:{}
    },
    reducers:{
        updateProfile(state, action) {
            state.profile = action.payload;
        },
        updateUser(state, action) {
            state.user = action.payload;
        },
        updateUserStreets(state, action) {
            state.streest = action.payload;
        }
    }
});

export { actions as sessionActions };
export { reducer as sessionReducer };

