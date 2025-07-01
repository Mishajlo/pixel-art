import router from "@/router";
import type { Notif } from "@/types/notifs";
import type { Pixel } from "@/types/pixel";
import type { Slika } from "@/types/slika";
import axios from "axios";
import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { computed, ref, watch} from "vue";
import { useLoginStore } from "./login";

const pix = 'pixels'
const titl = 'naslov'
const slidza = 'idSlike'
export const usePixelStore = defineStore('pixels', () => {

    const pixseli = ref<Pixel[][]>(JSON.parse(localStorage.getItem(pix) || '[]'))
    const broj = ref(Number(JSON.parse(localStorage.getItem(pix) || '[]').length) || 10)
    const naslov = ref(JSON.parse(localStorage.getItem(titl) || JSON.stringify("New Image") || "New Image"))
    const idSlike = ref(JSON.parse(localStorage.getItem(slidza) || JSON.stringify(null) || ""))
    const slika = ref<Slika>({
      korisnik : "",
      naziv : "New Image",
      idKorisnika : "",
      idSlike : "",
      pikseli : []
    })
    const obrisi = ref(false)

    const successNotif = ref<Notif>({show:false, text: ""})
    const failNotif = ref<Notif>({show:false, text:""})

  const getPixels = computed(() => {
    return pixseli.value
  })

  const getObrisi = computed(() => {
    return obrisi
  })

  const getBroj = computed(() => {
    return broj.value
  })

  const getNaslov = computed(() => {
    return naslov
  })

  const getSlika = computed(() => {
    return slika.value
  })

  const getSuccessNotif = computed(() => {
    return successNotif
  })

  const getFailNotif = computed(() => {
    return failNotif
  })

  const idSlidze = computed(() => {
    return idSlike.value
  })

  function sacuvajPixels(){
    localStorage.setItem(pix, JSON.stringify(pixseli.value))
  }

  function sacuvajNaslov(){
    localStorage.setItem(titl, JSON.stringify(naslov.value))
  }

  function sacuvajId(){
    localStorage.setItem(slidza, JSON.stringify(idSlike.value))
  }

  watch(pixseli.value, () => {
    sacuvajPixels()
  })

  const loginStore = useLoginStore()
  //const userId = loginStore.getUserID.value
  //const token = loginStore.getToken.value
  const socket = io("http://localhost:3001/", {
    auth: { token: `Bearer ${ JSON.parse(localStorage.getItem('token') || JSON.stringify(null)) || "" }`},
  });

  function pridruziSe(){
    const token = JSON.parse(localStorage.getItem('token') || JSON.stringify(null)) || ""
    const userId = JSON.parse(localStorage.getItem('id') || JSON.stringify(null)) || ""
    const slicica = idSlike.value
    console.log("desilo se")
    socket.emit('join', {slicica, userId , token})
  }

  function odlazi(){
    const userId = JSON.parse(localStorage.getItem('id') || JSON.stringify(null)) || ""
    const slicica = idSlike.value
    //console.log(userId)
    //console.log(slicica)
    socket.emit('leave', {slicica, userId})
  }

  function sendColor(i:number, j:number, color:string){
    const slicica = idSlike.value
    console.log(color)
    socket.emit('klik', {i,j,boja:color,slicica})
  }

  socket.on('userJoined', ({userid, roomid}) => {
    console.log("User " + userid + " has joined room " + roomid)
  })

  socket.on('userLeft', ({userid, roomid}) => {
    console.log("User " + userid + " has left room " + roomid)
  })

  socket.on('compel', ({i,j,boja}) => {
    console.log("i: " + i + " j: " + j + " boja: " + boja )
    pixseli.value[i][j].boja = boja
    console.log(pixseli.value[i][j])
  })

  socket.on('menjaj', ({size}) =>{
    console.log("Pozvalo se: " + size)
    promeniGrid(size)
  })

  function pomocna(velicina : number){
    const slicica = idSlike.value
    console.log("Desilo se promena")
    socket.emit('duzina', {slicica, size:velicina})
    promeniGrid(velicina)
  }

  function matrixGrid(pikseli: Pixel[][], velicina: number){

    if(slika.value.idSlike !== ""){
      pixseli.value = slika.value.pikseli
      console.log(pixseli.value)
      return
    }
    if(velicina > 24){
      velicina = 24
    }

    if(pikseli[0] === undefined ){
      for(let i=0; i<broj.value;i++){
        pikseli[i] = []
        for(let j=0; j<broj.value; j++){
          pikseli[i][j] = {
            idi: i,
            idj: j,
            boja: "#D5C1E7",
            border: 1
          }
        }
      }
    }

    console.log(pikseli)

  }

  function matrixGriddy(idKorisnika : string){

    if(slika.value.idSlike !== ""){
      console.log(slika.value.pikseli.length)
      pixseli.value = slika.value.pikseli

      if(idKorisnika === slika.value.idKorisnika){
        sacuvajNaslov()
        sacuvajPixels()
        sacuvajId()
        console.log(idSlike.value)
        watch(pixseli.value, () => {
          sacuvajPixels()
        })
      }
      broj.value = slika.value.pikseli.length
      return
    }
    if(broj.value > 24){
      broj.value = 24
    }

    if(pixseli.value[0] === undefined ){
      for(let i=0; i<broj.value;i++){
        pixseli.value[i] = []
        for(let j=0; j<broj.value; j++){
          pixseli.value[i][j] = {
            idi: i,
            idj: j,
            boja: "#D5C1E7",
            border: 1
          }
        }
      }
    }
    sacuvajNaslov()
    sacuvajId()
    console.log(idSlike.value)

  }



  function promeniGrid(velicina: number){
    if(velicina >= 24){
      velicina = 24
      failNotif.value.show = true
      failNotif.value.text = "24 is the max!!!"
    }

   broj.value = velicina
   console.log("Nov css " + broj.value)

    for(let i = 0; i<pixseli.value.length; i++){
      if(i == velicina){
        pixseli.value.splice(i, pixseli.value.length - velicina)
      }
      for(let j=0; j<pixseli.value.length; j++){
        if(j == velicina){
          pixseli.value[i].splice(j, pixseli.value[i].length - velicina)
        }
      }
    }

    for(let i=0; i<velicina;i++){
      if(pixseli.value[i] == undefined) pixseli.value[i] = []
      for(let j=0; j<velicina; j++){
        if(pixseli.value[i][j] == undefined){
          pixseli.value[i][j] = {
            idi: i,
            idj: j,
            boja: "#D5C1E7",
            border: 1
          }
        }
      }
    }

  }

  function prevuciBoju(idi: number, idj: number,brisanje: boolean, prevuci: boolean, bojica: string){
    if(prevuci) {
      if(brisanje){
        pixseli.value[idi][idj].boja = "#D5C1E7"
        sendColor(idi, idj, "#D5C1E7")
      }
      else {
        pixseli.value[idi][idj].boja = bojica
        sendColor(idi, idj, bojica)
      }

    }
  }

  function reset(){
    for(let i=0; i<pixseli.value.length;i++){
      for(let j=0; j<pixseli.value.length; j++){
        pixseli.value[i][j].boja = "#D5C1E7"
        sendColor(i, j, "#D5C1E7")
      }
    }
    idSlike.value = ""
    naslov.value = "New Image"
    sacuvajNaslov()
    sacuvajId()
    successNotif.value.show = true
    successNotif.value.text = "Reset!"
  }

    function promeniBoju(idi: number, idj: number, boja: string, brisanje: boolean, sprejic: boolean){
      if(brisanje) {
        pixseli.value[idi][idj].boja = "#D5C1E7"
        sendColor(idi, idj, "#D5C1E7")
      }
      else {
        pixseli.value[idi][idj].boja = boja
        console.log("Poslao " + boja)
        sendColor(idi, idj, boja)
      }
      if(sprejic){
        for(let i=0; i<pixseli.value.length;i++){
          for(let j=0; j<pixseli.value.length; j++){
            pixseli.value[i][j].boja = boja
            sendColor(i, j, boja)
          }
        }
      }
    //  sacuvajPixels()

    }

    function primiSliku(novaSlika : Slika){
      slika.value.idKorisnika = novaSlika.idKorisnika
      slika.value.idSlike = novaSlika.idSlike
      idSlike.value = novaSlika.idSlike
      slika.value.korisnik = novaSlika.korisnik
      slika.value.naziv = novaSlika.naziv
      naslov.value = novaSlika.naziv
      slika.value.pikseli = novaSlika.pikseli
      console.log(novaSlika.idSlike)
      successNotif.value.show = true
      successNotif.value.text = "You are now watching: " + novaSlika.naziv + " Drawn By: " + novaSlika.korisnik
      router.push('/draw')
    }

    async function saveImage(novNaslov: string, idKorisnika: string, token: string){
      console.log("Korisnik: " + idKorisnika)
      console.log(" Token: " + token)
      if((idKorisnika !== "" || idKorisnika !== undefined) && token !== ""){
        try{

          const transMatrica : Array<string>[] = []

          for(let i=0; i<pixseli.value.length; i++){
            transMatrica[i] = []
          }

          for(let i=0; i<pixseli.value.length; i++){
            for(let j=0; j<pixseli.value.length; j++){
              transMatrica[j][i] = pixseli.value[i][j].boja
            }
          }

          const data = {
            name : novNaslov,
            picture_data: transMatrica
          }

          const auth = {
            headers:{
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
          }

          if(idSlike.value === ""){
            //const odgovor = await axios.post("https://raf-pixeldraw.aarsen.me/api/pictures/", data, auth)
            const odgovor = await axios.post(`http://localhost:3001/pictures`, data, auth)
            naslov.value = novNaslov
            sacuvajNaslov()
            console.log(odgovor)
            successNotif.value.show = true
            successNotif.value.text = "Upload Successful!"
          }else if(idSlike.value !== ""){
            if(slika.value.idKorisnika === ""){
              console.log("Nema id!")
              //const odgovor = await axios.post("https://raf-pixeldraw.aarsen.me/api/pictures/", data, auth)
              const odgovor = await axios.post(`http://localhost:3001/pictures`, data, auth)
              naslov.value = novNaslov
              sacuvajNaslov()
              console.log(odgovor)
              successNotif.value.show = true
              successNotif.value.text = "Dont Copy Next Time!"
            }else{
              if(slika.value.idKorisnika === idKorisnika){
                console.log("Ima Id")
               // const odgovor = await axios.post("https://raf-pixeldraw.aarsen.me/api/pictures/", data, auth)
                const odgovor = await axios.post(`http://localhost:3001/pictures`, data, auth)
                naslov.value = novNaslov
                sacuvajNaslov()
                console.log(odgovor)
                successNotif.value.show = true
                successNotif.value.text = "Dont Copy Next Time!"
              }else{
                console.log("Alo Svetlana!")
                failNotif.value.show = true
                failNotif.value.text = "Dont Dekrati!"
                return
              }
            }
          }

        }catch(greska){
          console.log(greska)
          failNotif.value.show = true
          failNotif.value.text = "Error"
        }
      }else{
        failNotif.value.show = true
        failNotif.value.text = "You are not mogged in!"
        console.log("You are not mogged in!")
      }

    }

    async function updateImage(novNaslov: string, idKorisnika: string, token: string){

      if((idKorisnika !== "" || idKorisnika !== undefined) && token!==""){
        try{

          const transMatrica : Array<string>[] = []

          for(let i=0; i<pixseli.value.length; i++){
            transMatrica[i] = []
          }

          for(let i=0; i<pixseli.value.length; i++){
            for(let j=0; j<pixseli.value.length; j++){
              transMatrica[j][i] = pixseli.value[i][j].boja
            }
          }

          const data = {
            name : novNaslov,
            picture_data: transMatrica
          }

          const auth = {
            headers:{
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
          }

          if(idSlike.value === ""){
            console.log("Try Saving First! :)")
            failNotif.value.show = true
            failNotif.value.text = "Try Saving First! :)"
          }else if(idSlike.value !== ""){
            if(slika.value.idKorisnika === ""){
             // const odgovor = await axios.patch(`https://raf-pixeldraw.aarsen.me/api/pictures/${idSlike.value}`, data, auth)
              const odgovor = await axios.patch(`http://localhost:3001/pictures/${idSlike.value}`, data, auth)
              naslov.value = novNaslov
              sacuvajNaslov()
              console.log(odgovor)
              successNotif.value.show = true
              successNotif.value.text = naslov.value + " Has Been Updated!"
            }else{
              if(slika.value.idKorisnika === idKorisnika){
                //const odgovor = await axios.patch(`https://raf-pixeldraw.aarsen.me/api/pictures/${slika.value.idSlike}`, data, auth)
                const odgovor = await axios.patch(`http://localhost:3001/pictures/${idSlike.value}`, data, auth)
                naslov.value = novNaslov
                sacuvajNaslov()
                console.log(odgovor)
                successNotif.value.show = true
                successNotif.value.text = naslov.value + " Has Been Updated!"
              }else{
                console.log("Alo Svetlana!")
                failNotif.value.show = true
                failNotif.value.text = "Others Are Not Ours To Change"
              }
            }
          }

        }catch(greska){
          console.log(greska)
          failNotif.value.show = true
          failNotif.value.text = "Error"
        }
      }else{
        console.log("You are not mogged in!")
        failNotif.value.show = true
        failNotif.value.text = "You are not mogged in!"
      }

    }

    async function deleteImage(idSlike:string, token:string){
      try{
        const auth = {
          headers:{
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
          }
        }
        //const odgovor = await axios.delete(`https://raf-pixeldraw.aarsen.me/api/pictures/${idSlike}`, auth)
        //              const odgovor = await axios.patch(`http://localhost:3001/pictures/${idSlike.value}`, data, auth)
        const odgovor = await axios.delete(`http://localhost:3001/pictures/${idSlike}`, auth)
        successNotif.value.show = true
        successNotif.value.text = naslov.value + " Has Been Deleted!"
          console.log(odgovor)
      }catch(greska){
        failNotif.value.show = true
        failNotif.value.text = "Error"
        console.log(greska)
      }
    }

    return {idSlidze, getPixels, getBroj, getSlika, getObrisi, getSuccessNotif, getFailNotif,  primiSliku, matrixGrid, promeniBoju,getNaslov, reset, prevuciBoju, promeniGrid, matrixGriddy, saveImage, updateImage, deleteImage, socket, pridruziSe, odlazi, pomocna}
})
