<template>
  <div id="pag" v-if="zaCecuIma">
    <button class="dugme" @click="idiNazad" >{{ "<" }}</button>
    <label>{{ stranica }} / {{ max }}</label>
    <button class="dugme" @click="idiNapred" >{{ ">" }}</button>
  </div>
  <div id="galerija" v-if="zaCecuIma">
    <div  id="griid" v-for="(jedan, z) in gridniz" :key="z">
      <div @click="pixelStore.primiSliku(jedan)" id="gred" :style="{'--size': jedan.pikseli.length}">
        <div id="reed" v-for="(red, i) in jedan.pikseli" :key="i" :style="{'--size': jedan.pikseli.length}" >
          <div v-for="(pixel, j) in red" :key="j" :style="{backgroundColor : pixel.boja, borderRadius:pixel.border}"/>
        </div>
      </div>
      <div id="info" style="display: flex; flex-direction: column;">
        <button id="dugme" v-if="jedan.idKorisnika === vlasnik && !obrisi" @click="obrisi = true">Delete</button>
        <div id="zamraci" v-if="jedan.idKorisnika === vlasnik && obrisi">
          <div id="potvrda">
            <button id="dugme" @click="brisiSe(jedan.idSlike)">Confirm</button>
          </div>
        </div>
        <RouterLink id="info" to="/gallery" v-if="jedan.idKorisnika !== vlasnik" @mousedown="uzmiKorisnika(jedan.idKorisnika)" @mouseup="slikee">Author: {{ jedan.korisnik }}</RouterLink>
        <RouterLink id="info" to="/myGallery" v-if="jedan.idKorisnika === vlasnik" @mouseup="slikee"  style="margin-bottom: -7px;">Author: {{ jedan.korisnik }}</RouterLink>
        <label>Name: {{ jedan.naziv }}</label>
      </div>
    </div>
  </div>
  <p id="ceca" v-if="!zaCecuIma">For Ceca There Isn't</p>
</template>

<style scoped>
.dugme{
  width: fit-content;
  padding: 2px;
  height: 25px;
  width: 25px;
  font-size: 17px;
  color: rgb(54, 123, 88);
  background-color: rgba(255, 0, 238, 0.4);
  border-style: solid;
  border-color: #00ff7f;
  font-family: "Silkscreen";
}

.dugme:active{
  border-color: rgb(255, 0, 238);
  background-color: #00ff7f;
}

#griid{
  border-style: dashed;
  border-color: rgb(255, 0, 238);
  border-radius: 8px;
  background-color: rgba(54, 123, 88, 0.755);
  user-select: none;
  position: relative;
  left: 26%;
  height: 280px;
  width: 240px;
  margin: 17px;
  gap: 2px;
  padding: 3px;
}

#dugme{
  width: fit-content;
  padding: 1px;
  font-size: 12px;
  height: fit-content;
  color: springgreen;
  background-color: #8D5DB7;
  border-style: dashed;
  border-color: #00ff7f;
  font-family: "Silkscreen";
}

#galerija{
  user-select: none;
  position: relative;
  height: 1200px;
  width: 1200px;
  display: grid;
  margin: 5px;
  --velciina: 5;
  grid-template-rows: repeat(var(--velciina), 1fr);
  grid-template-columns: repeat(var(--velciina), 1fr);
  gap: 2px;
  padding: 3px;
}
#gred{
  position: relative;
  left: 4%;
  height: 210px;
  width: 210px;
  display: grid;
  --size: 10;
  grid-template-rows: repeat(var(--size), 1fr);
  gap: 2px;
  padding: 3px;
}

#reed{
  display: grid; gap: 2px;
  grid-template-columns: repeat(var(--size), 1fr)
}

#ceca{
  position: absolute;
  font-size: 60px;
  font-family: "Silkscreen";
  color: #00ff7f;
  background-size: 100%;
  -webkit-text-stroke-width: 0.7px;
  -webkit-text-stroke-color: #FF13F0;
  user-select: none;
}

#pag{
  display: flex;
  flex-direction: row;
  gap: 20px;
  user-select: none;
  top: 75px;
  left: 48%;
  width: 100%;
  position: fixed;
  align-items: center;
  font-size: 20px;
  font-family: "Silkscreen";
  font-weight: bold;
  color: rgb(238, 130, 148);
  -webkit-text-stroke-width: 0.3px;
  -webkit-text-stroke-color: #ff00ee;
}

#info{
  font-size: 13px;
  display: flex;
  place-items: center;
  text-wrap: pretty;
  font-family: "Silkscreen";
  font-weight: bold;
  color: rgb(238, 130, 148);
  -webkit-text-stroke-width: 0.3px;
  -webkit-text-stroke-color: #ff00ee;
}
</style>

<script setup lang="ts">
import { usePixelStore } from '@/stores/pixels';
import type { Slika } from '@/types/slika';
import axios from 'axios';
import {inject, onBeforeMount, onWatcherCleanup, ref, watch, type Ref} from 'vue'


await new Promise(slikee => setTimeout(slikee))

  const podaciKorisnika = defineEmits<{
    NovKorisnikId: [korisnikId:string]
  }>()

  const korisnik = defineProps({
    korisnikId : {type:String, default: ""},
  })

  function uzmiKorisnika(id:string){
    podaciKorisnika('NovKorisnikId', id)
  }

  const vlasnik = inject('Korisnik') as Ref

  const pixelStore = usePixelStore()

  const obrisi = ref(false)
  const slikaZaBrisanje = ref("")
  const pikseli = pixelStore.getPixels
  const velicina = ref(pixelStore.getBroj)
  const gridniz = ref<Slika[]>([])
  const zaCecuIma = ref(true)
  const token = inject('Token') as Ref
  const stranica = ref(1)
  const max = ref(1)

  pixelStore.matrixGrid(pikseli, velicina.value)

  onBeforeMount(() => {
    slikee()
  })

  function aktivBrisi(id: string){
    obrisi.value = true
    slikaZaBrisanje.value = id
  }

  async function brisiSe(idSlike:string){
    pixelStore.deleteImage(idSlike, String(token.value))
    removePicById(idSlike)
  }

  function idiNapred(){
    if(stranica.value >= max.value){
      return
    }else{
      stranica.value++
    }
  }

  function idiNazad(){
    if(stranica.value == 1){
      return
    }else{
      stranica.value--
    }
  }


  function removePicById(id: string){
    for(let i = 0; i<gridniz.value.length; i++){
      if(gridniz.value[i].idSlike === id){
        gridniz.value.splice(i, 1)
      }
    }
    if(gridniz.value.length === 0) zaCecuIma.value = false
  }

  watch(gridniz.value, () => {
    slikee()
  })


  watch(
    () => stranica.value,
    (newValue) => {
      const abort = new AbortController()
      setTimeout(async() => {
        try{

    console.log(korisnik.korisnikId)
    const params = new URLSearchParams({
    limit: String(10),
    page: String(newValue),
    older_first: 'false',
    author: '',
  });
  if (korisnik.korisnikId) {
    params.set('author', korisnik.korisnikId)
  }
  console.log("Params! " + params.toString)
    //const odgovor = await axios.get(`https://raf-pixeldraw.aarsen.me/api/pictures/?${params}`, { signal: abort.signal })
    const odgovor = await axios.get(`http://localhost:3001/pictures/?${params}`, { signal: abort.signal })
    gridniz.value = []
    const slike = odgovor.data.pictures
    max.value = Math.ceil(odgovor.data.total / 10)
    console.log(stranica.value)
    if(slike.length === 0){
      zaCecuIma.value = false
    }
    for(let i=0; i<slike.length; i++){
      const trenutna = slike[i].picture_data
      gridniz.value[i] = {
        korisnik: slike[i].author.username,
        naziv: slike[i].name,
        idKorisnika: slike[i].author.user_id,
        idSlike: slike[i].picture_id,
        pikseli: []
      }
      for(let j=0; j<trenutna.length; j++){
        gridniz.value[i].pikseli[j] = []
        for(let k=0; k<trenutna.length; k++){
          gridniz.value[i].pikseli[j][k] = {
            idi: j,
            idj: k,
            boja: trenutna[k][j],
            border: 1
          }
        }
      }
    }}catch(greska){
      console.log("SlowDown!")
    }
      })

      onWatcherCleanup(() => {
        abort.abort()
      })
    }
  )

  function vratiKorisnika(){
    return korisnik.korisnikId
  }

  watch(vratiKorisnika, () => {
    stranica.value = 1
  })

  async function slikee(){
    const abort = new AbortController()
    console.log(korisnik.korisnikId)
    const params = new URLSearchParams({
    limit: String(10),
    page: String(stranica.value),
    older_first: 'false',
    author: '',
  });
  if (korisnik.korisnikId) {
    params.set('author', korisnik.korisnikId)
  }
  console.log(params)
    //const odgovor = await axios.get(`https://raf-pixeldraw.aarsen.me/api/pictures/?${params}`, { signal: abort.signal })
    const odgovor = await axios.get(`http://localhost:3001/pictures/?${params}`)
    console.log(odgovor)
    gridniz.value = []
    const slike = odgovor.data.pictures
    max.value = Math.ceil(odgovor.data.total / 10)
    console.log(stranica.value)
    if(slike.length === 0){
      zaCecuIma.value = false
    }
    for(let i=0; i<slike.length; i++){
      const trenutna = slike[i].picture_data
      gridniz.value[i] = {
        korisnik: slike[i].author.username,
        naziv: slike[i].name,
        idKorisnika: slike[i].author.user_id,
        idSlike: slike[i].picture_id,
        pikseli: []
      }
      for(let j=0; j<trenutna.length; j++){
        gridniz.value[i].pikseli[j] = []
        for(let k=0; k<trenutna.length; k++){
          gridniz.value[i].pikseli[j][k] = {
            idi: j,
            idj: k,
            boja: trenutna[k][j],
            border: 1
          }
        }
      }
    }
    //console.log(gridniz.value)
  }

  //console.log(gridniz.value)
</script>
