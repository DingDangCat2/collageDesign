const initNumber={
    status:false
}
export default reducers=(state=initNumber,action)=>{
    let status=initNumber;
switch(action.type){
    case 'chang_status':
        return {status:!status};
    default:
            return state;
}

}