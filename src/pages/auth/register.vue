<template>
  <div id="main" class="d-flex align-center justify-center fill-height">
    <div class="form-login">
      <div>
        <v-img
            src="/images/login.webp"
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
          @keydown.enter="register()"
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
          @keydown.enter="register()"
      />
      <v-btn
          block
          class="mb-3"
          color="primary"
          @click="register()"
      >
        Confirm register
      </v-btn>

      <v-alert
          density="compact"
          v-if="messagesError"
          type="error"
      >
        {{messagesError}}
      </v-alert>

    </div>
  </div>
</template>

<script setup>
import {isNil} from "lodash";

definePageMeta({auth: false})

//api
const {registerAccount} = useApi();

const username = ref(null);
const password = ref(null);
const show = ref(false);

const messagesError = ref(null);

async function register(){
  messagesError.value = null;
  let formatSpecial = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  let formatNumber = /[1234567890]/;
  let formatCharLowerCase = /[qwertyuiopasdfghjklzxcvbnm]/;
  let formatCharUpperCase = /[QWERTYUIOPASDFGHJKLZXCVBNM]/;

  if(isNil(password.value) || password.length < 13)
  {
    messagesError.value = "Password must have min 13 characters";
    return;
  }
  else if (!formatSpecial.test(password.value))
  {
    messagesError.value = "Password must have one character special";
    return;
  }
  else if (!formatNumber.test(password.value))
  {
    messagesError.value = "Password must have one number";
    return;
  }
  else if (!formatCharLowerCase.test(password.value))
  {
    messagesError.value = "Password must have one lower character";
    return;
  }
  else if (!formatCharUpperCase.test(password.value))
  {
    messagesError.value = "Password must have one upper character";
    return;
  }

  try {
    let result = await registerAccount(username.value, password.value);
    navigateTo('/auth/login')
  }catch(e){
    if(e.toString().indexOf('409') !== -1)
      messagesError.value = "The name already exists";
    else
      messagesError.value = "Error Generic";
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