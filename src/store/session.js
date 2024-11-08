import { createSlice } from "@reduxjs/toolkit"


const { reducer, actions} = createSlice({
    name:'session',
    initialState:{
        user:null,
        streets:null,
        server:{}
    },
    reducers:{
        updateServer(state, action) {
            state.server = action.payload;
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

