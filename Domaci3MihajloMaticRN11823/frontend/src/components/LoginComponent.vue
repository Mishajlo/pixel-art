<template>
  <form @submit.prevent style="display: flex; flex-direction: column; gap: 18px; left: 40%;   top: -40px; padding: 20px;   border-style: solid; border-color: #8D5DB7; border-radius: 15px; padding: 20px; background-color: rgba(137, 196, 244, .8)">
    <input id="field" class="text" v-model="username.username.value" v-bind="username.usernameAttrs.value" placeholder="Username" autocomplete="off">
    <p class="error" id="eror" v-if="error.username">{{ error.username }}</p>
    <input id="field" type="password" class="text"  v-model="password.password.value" v-bind="password.passwordAttrs.value" placeholder="Password">
    <p class="error" id="eror"  v-if="error.password">{{ error.password }}</p>
    <button id="field" @click="log.prijava(String(username.username.value), String(password.password.value))" style="align-self: center;">Confirm</button>
  </form>
</template>

<style scoped>

#field{
  height: 50px;
  width: 250px;
  font-size: 20px;
  width: fit-content;
  padding: 1px;
  color: #8D5DB7;
  background-color: #94d4ee;
  border-style: dashed;
  border-color: #8D5DB7;
  border-radius: 15px;
  border-width: 3.5px;
  font-family: "Silkscreen";
  padding: 7px;


}
#eror{
  font-size: 17px;
  width: fit-content;
  padding: 1px;
  color: red;
  text-decoration: underline;
  font-family: "Silkscreen";
  -webkit-text-stroke-width: 0.6px;
  -webkit-text-stroke-color: #94d4ee;
  user-select: none;
}
</style>

<script setup lang="ts">

import { useLoginStore } from '@/stores/login';

  const log = useLoginStore()

  const error = log.getErrors
  error.value.username = ""
  error.value.password = ""
  //const username = ref("")
  //const password = ref("")
  const username = log.getUsername
  const password = log.getPassword

</script>
