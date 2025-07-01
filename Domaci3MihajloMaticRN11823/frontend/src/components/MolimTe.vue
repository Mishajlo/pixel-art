<template>
    <form @submit.prevent style="display: flex; flex-direction: column; gap: 18px;   left: 40%;   top: -40px; padding: 20px; border-style: solid; border-color: #FF7F50; border-radius: 15px; padding: 20px; background-color: rgba(137, 196, 244, .5)">
      <input id="unos" class="text" v-model="username.username.value" v-bind="username.usernameAttrs.value" placeholder="Username" autocomplete="off">
      <p class="error" id="eror" v-if="error.username">{{ error.username }}</p>
      <input id="unos" type="password" class="text" v-model="password.password.value" v-bind="password.passwordAttrs.value" placeholder="Password">
      <p class="error" id="eror"  v-if="error.password">{{ error.password }}</p>
      <input id="unos" type="password" class="text" v-model="password2.confirm.value" v-bind="password2.confirmAttrs.value" placeholder="Confirm Password">
      <p class="error" id="eror"  v-if="error.confirm">{{ error.confirm }}</p>
      <button id="unos" @click="reg.registracija(String(username.username.value), String(password.password.value))" style="align-self: center;">Confirm</button>
    </form>
</template>

<style>

#unos{
  height: 50px;
  width: 250px;
  font-size: 20px;
  width: fit-content;
  padding: 1px;
  color: #FF7F50;
  background-color: #94d4ee;
  border-style: dashed;
  border-radius: 15px;
  border-width: 3px;
  border-color: #FF7F50;
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

  const reg = useLoginStore()

  const error = reg.getErrors
  error.value.username = ""
  error.value.password = ""
  error.value.confirm = ""
  const username = reg.getUsername
  const password = reg.getPassword
  const password2 = reg.getConfirm

  console.log(username.username.value)
  console.log(localStorage.getItem("username"))

</script>
