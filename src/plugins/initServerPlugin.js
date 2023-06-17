export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    const store = useStore();
    const { getCookie } = useAuth();
    const user = getCookie();

    if(!isNil(user))
      store.setUser(user);
  }
})