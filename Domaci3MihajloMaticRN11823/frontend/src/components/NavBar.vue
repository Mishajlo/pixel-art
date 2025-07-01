<template>

  <header>

    <nav id="nav" style=" padding: 10px; position: fixed; top: 0; left: 0; width: 100%; display: flex; justify-content: space-between; padding-left: 30px;">
      <a href="http://localhost:5173/"><img id="slicica" src="@/assets/globe.png"></a>
      <div id="nav" style="padding-right: 20px; display: flex; color: black; gap: 18px;">
        <label class="links" v-if="stor.getToken.value" style="position: relative; top: 3px;">Korisnik: {{ (stor.getUsername.username.value) }} |<br></label>
        <RouterLink class="links" to="/">Home</RouterLink>
        <RouterLink class="links" to="/login" v-if="!stor.getToken.value">Login</RouterLink>
        <RouterLink class="links" to="/register" v-if="!stor.getToken.value">Register</RouterLink>
        <RouterLink class="links" to="/gallery">Gallery</RouterLink>
        <RouterLink class="links" to="/myGallery" v-if="stor.getToken.value">Archive</RouterLink>
        <RouterLink class="links" to="/" v-if="stor.getToken.value"  @click="stor.odjava">Logout</RouterLink>
        <RouterLink class="links" to="/draw">Draw!</RouterLink>
      </div>
    </nav>

  </header>

</template>

<style>

@font-face {
  font-family: "Silkscreen";
  src: url(fonts/Silkscreen/slkscr.ttf);
}

#slicica{
  height: 43px;
  width: 45px;
}

#nav{
  background-image:url("@/assets/pozadina.gif"); background-repeat:repeat;
}

.links{
  color: #00ff7f;
  font-size: 23px;
  font-family: "Silkscreen";
  font-weight: bold;
  -webkit-text-stroke-width: 0.7px;
  -webkit-text-stroke-color: #FF13F0;
}

</style>

<script setup lang="ts">
import { useLoginStore } from '@/stores/login';


  const stor = useLoginStore()



</script>
