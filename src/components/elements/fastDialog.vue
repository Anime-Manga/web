<template>
    <ClientOnly>
        <v-dialog
            v-bind:model-value="modelValue"
        >
        <v-card>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text
                v-html="text"
            >
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="error"
                    @click="close()"
                >
                    Close
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    @click="actionButton"
                >
                    {{ textBtn }}
                </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </ClientOnly>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue:{
        type: Boolean,
        default: false
    },
    title:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    actionButton:{
        type: Function,
        required: true
    },
    textBtn:{
        type: String,
        default: 'confirm'
    }
});

function close(){
    emit('update:modelValue', false);
}
</script>

<style lang="scss" scoped>

</style>