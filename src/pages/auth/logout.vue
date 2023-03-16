<template>

</template>

<script setup>
const {
  signOut
} = useSession()

await signOut({redirect: false});

navigateTo('/')
</script>