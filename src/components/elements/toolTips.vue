<template>
    <v-btn
        @click="startToolTips()"
        :prepend-icon="preicon"
    >
        {{ show? message : label }}
    </v-btn>
</template>
<script setup>
const props = defineProps({
    preicon:String,
    label:{
        type: String,
        require: true
    },
    message:{
        type: String,
        require: true
    },
    action:{
        type: Function,
        require: true
    }
})

const token = ref();
const show = ref(false);

function startToolTips(){
    show.value = true;
    clearTimeout(token.value);
    token.value = setTimeout(() => {
        show.value = false;
    }, 2000);
}

</script>