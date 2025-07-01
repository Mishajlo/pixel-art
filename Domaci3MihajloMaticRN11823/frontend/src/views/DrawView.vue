<template>
  <main @click="kursor">
    <body @mouseup="neDrziSe" >
      <div
      v-for="(cursor, i) in drugiLjudi"
      :key="i"
      :style="{
        position: 'absolute',
        top: cursor.y + 'px',
        left: cursor.x + 'px',
        width: '10px', height: '10px',
        backgroundColor: 'red',
        borderRadius: '50%',
        pointerEvents: 'none'
      }">
      <span>{{drugiLjudi[i].user}}</span>
    </div>
        <nav id="opcije">
          <div id="main">
            <DrawNotifComponent/>
            <UpdateDrawingComponent/>
            <SaveDrawingComponent/>
            <div style="font-size: 28px; color: springgreen; user-select: none;">|</div>
            <button class="dugme" @click="brisi" :style="{background: profesorovPredlog.pozadinaGumica}" style="height: fit-content; padding: 2px;"><img src="@/assets/gumica.png" style="margin:2px; width: 32px; height: 32px"></button>
            <button class="dugme" @click="pisi" :style="{background: profesorovPredlog.pozadinaOlovka}" style="height: fit-content; padding: 2px;"><img src="@/assets/olovcica.png" style="margin:2px; width: 30px; height: 30px"></button>
            <button class="dugme" @click="sprej" :style="{background: profesorovPredlog.pozadinaSprej}" style="height: fit-content; padding: 2px;"><img src="@/assets/sprej.png" style="margin:2px; width: 30px; height: 30px"></button>
            <div style="font-size: 28px; color: springgreen; user-select: none;">|</div>
            <button id="brisi" class="dugme" @click="pixelStore.reset">Reset</button>
            <input id="boja" type="color" v-model="boja" class="boja" style="border-color: springgreen; border-style: dashed; background-color: #8D5DB7;">
            <input id="kolicina" type="number" v-model="velicina" max="24" class="velicina">
            <button id="klik" class="dugme" @click="promeniGrid">Confirm</button>
          </div>
          <div id="name">{{ naslov }}</div>
          <div id="grid" :style="{'--size': profesorovPredlog.broj}">
            <div id="red" v-for="(red, i) in pikseli" :key="i" :style="{'--size': profesorovPredlog.broj}" >
              <div v-for="(pixel, j) in red" :key="j" @click="pixelStore.promeniBoju(pixel.idi, pixel.idj, boja, brisanje, sprejic)" @mousedown="drziSe(pixel.idi, pixel.idj)" @mouseup="neDrziSe" @mouseover="pixelStore.prevuciBoju(pixel.idi, pixel.idj, brisanje, prevuci, boja)" :style="{backgroundColor : pixel.boja, borderRadius:pixel.border}"/>
            </div>
          </div>
        </nav>
    </body>
  </main>
</template>

<style>

*{
  margin: 0;
  padding: 0;
}

#opcije{
  padding: 13px;
  position: fixed;
  left: 0;
  top: 75.5px;
  background-image:url("@/assets/pozadinaDrawBar.gif"); background-repeat:repeat;
  width: 100%;
}

@font-face {
  font-family: "Silkscreen";
  src: url(fonts/Silkscreen/slkscr.ttf);
}

.dugme{
  width: fit-content;
  padding: 1px;
  height: 25px;
  font-size: 17px;
  color: springgreen;
  background-color: #8D5DB7;
  border-style: dashed;
  border-color: #00ff7f;
  font-family: "Silkscreen";
}

#main{
  position: relative;
  align-items: center;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
  left: 23%;
}

#name{
  position: relative;
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 45px;
  font-family: "Silkscreen";
  color: #00ff7f;
  -webkit-text-stroke-width: 0.7px;
  -webkit-text-stroke-color: #FF13F0;
  user-select: none;
}

#grid{
  user-select: none;
  position: relative;
  left: 32%;
  height: 530px;
  width: 530px;
  display: grid;
  margin: -5px;
  background-color: #305050;
  --size: 10;
  grid-template-rows: repeat(var(--size), 1fr);
  gap: 2px;
  padding: 3px;
  border-style: dashed;
  border-color: springgreen;
  border-radius: 13px;
}

#red{
  display: grid; gap: 2px;
  grid-template-columns: repeat(var(--size), 1fr)
}

#pocetna{
  display: flex;
  place-items: center;
  padding: 100px;
  font-size: 50px;
  text-wrap:pretty;
  font-family: "Silkscreen";
  font-weight: bold;
  color: springgreen;
  -webkit-text-stroke-width: 0.7px;
  -webkit-text-stroke-color: #FF13F0;
}

</style>

<script setup lang="ts">
import DrawNotifComponent from '@/components/DrawNotifComponent.vue';
import SaveDrawingComponent from '@/components/SaveDrawingComponent.vue';
import UpdateDrawingComponent from '@/components/UpdateDrawingComponent.vue';
import { useLoginStore } from '@/stores/login';
import { usePixelStore } from '@/stores/pixels';
import {inject, onBeforeMount, onUnmounted, provide, reactive, ref, type Ref} from 'vue'

  const authStore = useLoginStore()
  const pixelStore = usePixelStore()
  const prijavljeni = inject('Korisnik') as Ref
  pixelStore.matrixGriddy(String(prijavljeni.value))

  provide('Yup', pixelStore.getSuccessNotif)
  provide('Nop', pixelStore.getFailNotif)

  const soket = pixelStore.socket
  const brisanje = ref(false)
  const sprejic = ref(false)
  const naslov = pixelStore.getNaslov
  const pikseli = pixelStore.getPixels
  const boja = ref("#8D5DB7")
  const velicina = ref(pixelStore.getBroj)
  const prevuci = ref(false)


  const profesorovPredlog = reactive({
      broj: velicina.value,
      pozadinaGumica: "#8D5DB7",
      pozadinaOlovka: "#D5C1E7",
      pozadinaSprej: "#8D5DB7"
  })

  function kursor(event : MouseEvent){
    const { x, y } = event
    const dodatak = pixelStore.idSlidze
    const userId = prijavljeni.value
    soket.emit('kurcor', {x:x, y:y, roomId: dodatak, user: userId})
    //console.log({ x, y, roomId: dodatak, user: userId });
  }

  function promeniGrid(){
    const dodatak = pixelStore.idSlidze
    const sizic = velicina.value
    soket.emit('dopuna', {dodatak, sizic})
    profesorovPredlog.broj = velicina.value
    console.log(velicina.value)
    pixelStore.pomocna(velicina.value)
    console.log(velicina.value)
  }

  soket.on('dodatno', ({sizic}) => {
    profesorovPredlog.broj = sizic
    velicina.value = sizic
  })

  const drugiLjudi = ref<{ user: string, x: number, y: number }[]>([]);
  soket.on('b2b', ({x, y, username}) => {
    console.log("USAO")
    if(username !== authStore.getUsername){
      console.log("USAO?")
      drugiLjudi.value = drugiLjudi.value.filter(cursor => cursor.user !== username);
      drugiLjudi.value.push({ user: username, x: x, y: y });
    }
  })

  soket.on('userLefty', ({username}) => {
    drugiLjudi.value = drugiLjudi.value.filter(cursor => cursor.user !== username);
  })

  function brisi(){
    brisanje.value = true
    sprejic.value = false
    profesorovPredlog.pozadinaGumica = "#D5C1E7"
    profesorovPredlog.pozadinaOlovka = "#8D5DB7"
    profesorovPredlog.pozadinaSprej = "#8D5DB7"
  }

  function pisi(){
    brisanje.value = false
    sprejic.value = false
    profesorovPredlog.pozadinaGumica = "#8D5DB7"
    profesorovPredlog.pozadinaOlovka = "#D5C1E7"
    profesorovPredlog.pozadinaSprej = "#8D5DB7"
  }

  function sprej(){
    brisanje.value = false
    sprejic.value = true
    profesorovPredlog.pozadinaGumica = "#8D5DB7"
    profesorovPredlog.pozadinaOlovka = "#8D5DB7"
    profesorovPredlog.pozadinaSprej = "#D5C1E7"
  }

  function neDrziSe(){
    prevuci.value = false
  }

  function drziSe(idi: number, idj: number){
    promeniBoju(idi, idj)
    prevuci.value = true
  }

  function promeniBoju(idi: number, idj: number){
    pixelStore.promeniBoju(idi, idj, boja.value, brisanje.value, sprejic.value)
  }

  onBeforeMount(() => {
    pixelStore.pridruziSe()
  })

  onUnmounted(() =>{
    console.log("desilose")
    pixelStore.odlazi()
  })
 // pixelStore.matrixGrid(pikseli, velicina.value)
</script>
