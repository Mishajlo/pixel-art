import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate"
import { defineStore } from "pinia";
import * as z from 'zod'
import { computed, ref, watch } from "vue";
import axios from "axios";
import router from "@/router";
import type { Notif } from "@/types/notifs";

const tok = 'token'
const user = 'username'
const id = 'id'
export const useLoginStore = defineStore('login', () => {

  const loginSchema = toTypedSchema(
    z.object({
      username: z.string().min(2, {message: "Username too short boo!"}).max(32, {message: "Pretera ga i ti..."}).default(JSON.parse(localStorage.getItem(user) || JSON.stringify(null)) || ""),
      password: z.string().min(8, {message: "Password too short diva!"}).max(128, {message: "KO CE DA PAMTI TOLIKO?!"}),
      token: z.string().default(JSON.parse(localStorage.getItem(tok) || JSON.stringify(null)) || ""),
      userId: z.string().default(JSON.parse(localStorage.getItem(id) || JSON.stringify(null)) || ""),
      confirm: z.string().min(8).max(128)
    }).refine((form) => form.password === form.confirm, {message:"The curtains must match the drapes!", path:['confirm']})
  )

  const loginNotif = ref<Notif>({ show:false, text:"" })
  const registerNotif = ref<Notif>({show:false, text:""})
  const uspehNotif = ref<Notif>({show:false, text:""})

  const getLoginNotif = computed(() => {
    return loginNotif
  })

  const getRegisterNotif = computed(() => {
    return registerNotif
  })

  const getUspehNotif = computed(() => {
    return uspehNotif
  })

  const form = useForm({
    validationSchema: loginSchema
  })

  const [username, usernameAttrs] = form.defineField('username', state => {
    return{
      validateOnModelUpdate: (state.errors.length || 0) > 0
    }
  })

  const [password, passwordAttrs] = form.defineField('password')
  const [confirm, confirmAttrs] = form.defineField('confirm')
  const [token] = form.defineField('token')
  const [userId] = form.defineField('userId')

  function sacuvajTokenInfo(){
    localStorage.setItem(id, JSON.stringify(userId.value))
    localStorage.setItem(tok, JSON.stringify(token.value))
    localStorage.setItem(user, JSON.stringify(username.value))
  }

  watch(token, () => {
    sacuvajTokenInfo()
  })

  watch(loginSchema.parse, ()=>{
    sacuvajTokenInfo()
  })

  const getUsername = computed(() => {
    return {username, usernameAttrs}
  })

  const getPassword = computed(() => {
    return {password, passwordAttrs}
  })

  const getConfirm = computed(() => {
    return {confirm, confirmAttrs}
  })

  const getErrors = computed(() => {
    return form.errors
  })

  const getToken = computed(() => {
    return token
  })

  const getUserID = computed(() => {
    console.log(userId.value)
    return userId
  })

  function setup(){
    userId.value = JSON.parse(localStorage.getItem(id) || JSON.stringify(null)) || ""
    username.value = JSON.parse(localStorage.getItem(user) || JSON.stringify(null)) || ""
    token.value = JSON.parse(localStorage.getItem(tok) || JSON.stringify(null)) || ""
  }

  function odjava(){
    localStorage.removeItem(user)
    localStorage.removeItem(id)
    localStorage.removeItem(tok)
    uspehNotif.value.show = true
    uspehNotif.value.text = "Goodbye " + username.value + "!"
    setup()
  }

  async function registracija(username : string, password : string){
    try{
      const data = {
        username,
        password
      }
      //const odgovor = await axios.post("https://raf-pixeldraw.aarsen.me/api/auth/register", data)
      const odgovor = await axios.post(`http://localhost:3001/auth/register`, data)
      console.log(odgovor)
      router.push('/login')
      uspehNotif.value.show = true
      uspehNotif.value.text = username + "Has Been Registered!"
      if(odgovor.data.failed){
        throw new Error("Registracija pala...")
      }
    }catch(greska){
      if(axios.isAxiosError(greska)){
        if(greska.response?.data.code === "DUPLICATE_USERNAME" ){
          registerNotif.value.show = true
          registerNotif.value.text = "Korisnicko Ime Zauzeto"
          throw new Error("Korisnicko Ime Zauzeto")
        }else{
          registerNotif.value.show = true
          registerNotif.value.text = "Registracija pala..."
          throw new Error(greska.response?.data.message || "Registracija pala...")
        }
      }else{
        console.log(greska)
        registerNotif.value.show = true
        registerNotif.value.text = "Ovaj je nov.."
        throw new Error("Ovaj je nov..")
      }
    }
  }

  async function prijava (korisnik: string, password : string) {
    try{
      const data = {
        username : korisnik,
        password
      }
      //const odgovor = await axios.post("https://raf-pixeldraw.aarsen.me/api/auth/login", data)
      const odgovor = await axios.post(`http://localhost:3001/auth/login`, data)
      console.log(odgovor)
      username.value = odgovor.data.username
      userId.value = odgovor.data.user_id
      token.value = odgovor.data.token
      sacuvajTokenInfo()
      router.push('/')
      uspehNotif.value.show = true
      uspehNotif.value.text = "Welcome " + username.value
    }catch(greska){
      console.log("Greska U Prijavi: " + greska)
      if(axios.isAxiosError(greska)){
        if(greska.response?.data.code === "INCORRECT_CREDENTIALS"){
          loginNotif.value.show = true
          loginNotif.value.text = "To NISU Super Podaci"
          throw new Error("To NISU Super Podaci")
        }else{
          loginNotif.value.show = true
          loginNotif.value.text = "Pala Prijava"
          throw new Error(greska.response?.data.message || "Pala Prijava...")
        }
      }else{
          loginNotif.value.show = true
          loginNotif.value.text = "Ovaj je nov.."
        throw new Error("Ovaj je nov..")
      }
    }
  }

  return {getErrors, getUsername, getPassword, getConfirm, getUserID, getToken, getLoginNotif, getRegisterNotif, getUspehNotif, registracija, prijava, setup, odjava}

})

