<template>
  <div id="main" class="d-flex align-center justify-center fill-height">
    <div class="form-login">
      <div>
        <v-img
            :src="failedLogin? '/images/wrong-password.svg' : '/images/login.webp'"
            class="mb-5"
            height="200"
        />
      </div>
      <v-text-field
          density="compact"
          color="primary"
          variant="outlined"
          v-model="username"
          label="Username"
          @keydown.enter="login()"
      />
      <v-text-field
          density="compact"
          color="primary"
          variant="outlined"
          :type="show? 'text' : 'password'"
          v-model="password"
          :append-inner-icon="show? '$show' : '$hide'"
          @click:appendInner="show = !show"
          label="Password"
          @keydown.enter="login()"
      />
      <v-btn
          block
          class="mb-3"
          color="primary"
          @click="login()"
      >
        Login
      </v-btn>
      <v-btn
          block
          color="secondary"
          to="/auth/register"
      >
        Register
      </v-btn>
    </div>
  </div>
</template>
<script setup>
import _ from 'lodash'
definePageMeta({auth: false})
const {
  signIn
} = useAuth()

const router = useRouter();

const username = ref(null);
const password = ref(null);
const show = ref(false);
const failedLogin = ref(false);

async function login() {
  let {error} = await signIn('credentials', {username: username.value, password: password.value, redirect: false});
  if (!_.isNil(error))
    failedLogin.value = true;
  else
    navigateTo('/')
}
</script>

<style lang="scss" scoped>
.form-login {
  width: 500px;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
}
</style>