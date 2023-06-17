import cry from 'crypto-js';

export default function useAuth(){

    const config = useRuntimeConfig();

    function createCookie(data){

        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        
        console.log(date);
        const auth = useCookie('auth', {
            expires: date,
            priority: 'high'
        });

        try{
            const token = cry.AES.encrypt(JSON.stringify(data), config.secret).toString();
            auth.value = token;
        }catch(err){
            console.log(err);
        }
    }

    function deleteCookie(){
        const auth = useCookie('auth');
        auth.value = null;
    }

    function getCookie(){

        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);

        const token =  useCookie('auth', {
            expires: date,
            priority: 'high'
        });

        if(!isNil(token.value))
            return  JSON.parse(cry.AES.decrypt(token.value, config.secret).toString(cry.enc.Utf8));
        else
            return null;
    }
    
    return{
        getCookie,
        createCookie,
        deleteCookie
    }
}