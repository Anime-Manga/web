<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4 h-dvh">
        <UPageCard class="w-full max-w-md">
        <UAuthForm
            :schema="schema"
            title="Login"
            description="Enter your credentials to access your account."
            :fields="fields"
            @submit="onSubmit"
        >
            <template #description>
                Don't have an account? <ULink to="create" class="text-primary font-medium">Sing up</ULink>
            </template>
        </UAuthForm>
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
}];

const schema = z.object({
  username: z.string('Invalid username'),
  password: z.string('Password is required')
})
type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    await $fetch("/api/proxy/accounts/login", {
        method: "POST",
        query: {
            username: payload.data.username,
            password: payload.data.password
        }
    })
}
</script>