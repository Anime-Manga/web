export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    const { status, signIn, signOut } = useSession();

    if(status.value == "authenticated")
    {
      const token = await useFetch('/api/token');
      const {name: username, password} = token.data.value;
      
      let {error} = await signIn('credentials', {username, password, redirect: false});
      
      if (!isNil(error))
        signOut();
    }
  }
})