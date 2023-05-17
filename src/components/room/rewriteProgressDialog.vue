<template>
    <v-dialog
        v-model="show"
        persistent
        width="auto"
    >
        <v-card
            color="secondary"
        >
            <v-card-title

            >
                ⚠️ WARNING ⚠️ 
            </v-card-title>
            <v-card-text>
                <div>The last thing you have {{ type === 'manga'? 'red' : 'watched' }}: <b>{{ restore }}</b></div>
                <br />
                <div>Actual is: <b>{{ actual }}</b></div>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="error"
                    @click="emit('close')"
                >
                    Resume
                </v-btn>
                <v-spacer />
                <v-btn
                    @click="emit('confirmResume')"
                >
                    Restore
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
const show = ref(true);

defineProps({
    type:{
        type: String,
        default: 'manga'
    },
    actual: String,
    restore: String
})

const emit = defineEmits(['close', 'confirmResume'])
</script>