<template>

</template>

<script setup>
const { deleteCookie } = useAuth()
const store = useStore();

deleteCookie();
store.setUser(null);
navigateTo('/')
</script>