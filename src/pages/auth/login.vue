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
          @keydown.enter="loginAccount()"
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
          @keydown.enter="loginAccount()"
      />
      <v-btn
          block
          class="mb-3"
          color="primary"
          @click="loginAccount()"
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
const { createCookie } = useAuth()
const { login } = useApi();
const store = useStore();

const username = ref(null);
const password = ref(null);
const show = ref(false);
const failedLogin = ref(false);

async function loginAccount() {
  failedLogin.value = false;

  try{
    const data = await login({username: username.value, password: password.value});
    createCookie(data);
    store.setUser(data);
    navigateTo('/');
  }catch{
    failedLogin.value = true;
  }
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