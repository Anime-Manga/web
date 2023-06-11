export default function useAuth(){

    function createCookie(data){        
        const auth = useCookie('auth');
        auth.value = data;
    }

    function deleteCookie(){
        const auth = useCookie('auth');
        auth.value = null;
    }

    function getCookie(){
        return useCookie('auth', {
            maxAge: 86400 * 10,
            priority: 'high'
        });
    }
    
    return{
        getCookie,
        createCookie,
        deleteCookie
    }
}