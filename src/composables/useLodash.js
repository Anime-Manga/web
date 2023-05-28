import _ from 'lodash'
export default function useLodash(){

    function isNil(value){
        return _.isNil(value);
    }

    return{
        isNil
    }
}