<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4 h-dvh">
        <UPageCard class="w-full max-w-md">
        <UAuthForm
            :schema="schema"
            title="Create"
            description="Create your account"
            :fields="fields"
            @submit="onSubmit"
        />
        </UPageCard>
    </div>
</template>
<script setup lang="ts">
import z from 'zod';
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui';

definePageMeta({
    layout: "login-layout"
});

const fields: AuthFormField[] = [{
    name: "username",
    type: "text",
    placeholder: "username",
    required: true
},{
    name: "password",
    type: "password",
    placeholder: "password",
    required: true
},{
    name: "repeate_password",
    type: "repeate_password",
    placeholder: "Repeat password",
    required: true
}];

const schema = z.object({
  username: z.string('Invalid username'),
  password: z.string('Password is required'),
  repeate_password: z.string('Password is required')
})
type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    if(payload.data.password === payload.data.repeate_password){
        await $fetch("/api/proxy/accounts/create", {
            method: "POST",
            body: {
                username: payload.data.username,
                password: payload.data.password
            }
        })
    }
}
</script>