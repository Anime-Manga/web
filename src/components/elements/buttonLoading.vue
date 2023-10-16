<template>
    <v-btn
        :disabled="disabled"
        :color="color"
        @click="startAction()"
    >
        <template v-if="loading || loadingExternal">
            <v-progress-circular
                indeterminate
                size="25"
            />
        </template>
        <template v-else>
            <v-icon>
                {{ icon }}
            </v-icon>
        </template>
    </v-btn>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: String
    },
    action: {
        type: Function,
        required: true
    },
    color: {
        type: String,
        default: "primary"
    },
    loadingExternal: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const { action } = toRefs(props);

const loading = ref(false);

async function startAction(){
    loading.value = true;
    await action.value();
    loading.value = false;
}
</script>

<style lang="scss" scoped>

</style>