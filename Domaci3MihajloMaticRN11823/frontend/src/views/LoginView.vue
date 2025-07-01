<script setup lang="ts">
import LoginComponent from '@/components/LoginComponent.vue';
</script>

<template>
  <main>
    <body id="login">
        <LoginComponent style="position: relative;"/>
    </body>
  </main>
</template>

<style>

*{
  margin: 0;
  padding: 0;
}

#login{
  padding: 13px;
  position: fixed;
  left: 0;
  top: 75.5px;
  background-image:url("@/assets/login.gif"); background-repeat:repeat;
  width: 100%;
}


</style>
