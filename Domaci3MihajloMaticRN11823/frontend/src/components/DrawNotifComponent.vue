<template>
  <Teleport to="div">
   <div id="notifikacijeUspeh" v-if="succesNotif.show" @click="succesNotif.show = false">{{ succesNotif.text }}</div>
   <div id="notifikacijeFail" v-if="failNotif.show" @click="failNotif.show = false">{{ failNotif.text }}</div>
  </Teleport>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';

  const succesNotif = inject('Yup') as Ref
  const failNotif = inject('Nop') as Ref

</script>

<style scoped>
#notifikacijeUspeh{
  user-select: none;
  height: fit-content;
  width: fit-content;
  font-size: 20px;
  width: fit-content;
  padding: 1px;
  color: #00ff7f;
  background-color: #FF13F0;
  border-style: dashed;
  border-color: #00ff7f;
  border-radius: 15px;
  border-width: 3.5px;
  font-family: "Silkscreen";
  padding: 7px;
  position: absolute; align-self: last baseline; left: 80%; top: 90%;
}

#notifikacijeFail{
  user-select: none;
  height: fit-content;
  width: fit-content;
  font-size: 20px;
  width: fit-content;
  padding: 1px;
  color: #ff1313;
  background-color: rgba(239, 38, 189, 0.7);
  border-style: dashed;
  border-color: #ff1313;
  border-radius: 15px;
  border-width: 3.5px;
  font-family: "Silkscreen";
  padding: 7px;
  position: absolute; align-self: last baseline; left: 80%; top: 88%;
}
</style>
