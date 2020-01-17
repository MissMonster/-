const initialState = {
    token:''
};
export const tokenReducer = (state = initialState,action)=>{
    switch(action.type){
        case 'GETTOKEN':
            return {
                ...state,token:action.payload
            }
            default:
                return state
    }
};