<script setup lang="ts">
import { usePixelStore } from '@/stores/pixels';
import { inject, ref, type Ref } from 'vue';


  const active = ref(false)
  const title = ref("")

  const prijavljeni = inject('Korisnik') as Ref
  const token = inject('Token') as Ref
  const stor = usePixelStore()

  function potvrda(){
    active.value = false
    console.log("--------------------------------------------\nNaslov: " + title.value + "\n Token: " + prijavljeni + "\n--------------------------------------------")
    stor.saveImage(title.value, String(prijavljeni.value), String(token.value))
  }

</script>

<template>
  <button class="dugme" @click="active = true" style="background-color: #8D5DB7; height: fit-content; padding: 2px;"><img src="@/assets/save.png" style="margin:2px; width: 32px; height: 32px"></button>

  <Teleport to="body">
    <div id="zamraci" v-if="active">
      <div id="potvrda">
        <input id="field" class="text" placeholder="Name Your Creaton" v-model="title">
        <button class="dugme" @click="potvrda">Confirm</button>
      </div>
    </div>
  </Teleport>


</template>

<style scoped>

#zamraci{
  align-items: center;
  position: absolute;
  padding: 13px;
  position: fixed;
  left: 0;
  top: 75.5px;
  border-style: dashed;
  border-color: #00ff7f;
  border-radius: 15px;
  background-color: rgba(48, 80, 80, 0.7);
  height: 100%;
  width: 100%;
}

#potvrda{
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 35%;
  left: 42%;
  border-style: dashed;
  border-color: #00ff7f;
  border-radius: 15px;
  padding: 20px;
  gap: 15px;
  background-color: rgba(213, 193, 231, 0.8)
}

#field{
  height: 40px;
  width: 50px;
  font-size: 14px;
  width: fit-content;
  padding: 1px;
  color: #00ff7f;
  background-color: darkslategray;
  border-style: dashed;
  border-color: #00ff7f;
  border-radius: 15px;
  border-width: 3.5px;
  font-family: "Silkscreen";
  padding: 7px;
}

</style>
