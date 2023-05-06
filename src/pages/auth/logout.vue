<template>

</template>

<script setup>
const {
  signOut
} = useAuth()

await signOut({redirect: false});

navigateTo('/')
</script>