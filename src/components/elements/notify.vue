<template>
    <div
        id="notify"
    >
        <v-alert
            class="mb-1 mr-1"
            v-for="notify in getNotifications"
            :key="notify.id"
            closable
            close-icon="$x"
            type="info"
            icon="$info"
        >
            {{ notify.message }}
        </v-alert>
    </div>
</template>

<script setup>
const store = useStore();

const getNotifications = computed(() => store.getNotifications);
</script>

<style lang="scss" scoped>
#notify{
    position: absolute;
    bottom: 10;
    right: 0;
    transform: translate(0%, -100%);
    z-index: 2000;
}
</style>