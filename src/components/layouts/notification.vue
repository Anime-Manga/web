<template>
  <ClientOnly>
    <Toaster closeButton richColors position="top-center" />
  </ClientOnly>
</template>

<script setup>
const { $emitOn, $toast } = useNuxtApp();

$emitOn('api:error', (message) => {
  $toast.error(message)
})

$emitOn('api:success', (message) => {
  $toast.success(message)
})

$emitOn('api:message', ({title, message}) => {
  $toast.message(title, {
    description: message,
  })
})
</script>  