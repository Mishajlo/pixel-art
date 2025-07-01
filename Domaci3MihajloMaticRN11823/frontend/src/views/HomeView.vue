<script setup lang="ts">
</script>

<template>
  <div id="home">
    <!--<img src="@/assets/starguard.gif" alt="" style="background-repeat: repeat; position: fixed; left: 0; top: 70px; height: 100%; width: 100%;">-->
    <label id="home" style="padding-left: 15px; position: fixed; left: 0; top: 75.5px; height: 100%; width: 100%;">Pixel Art</label>
  </div>

</template>

<style>

@font-face {
  font-family: "Silkscreen";
  src: url(fonts/Silkscreen/slkscr.ttf);
}

#home{
  font-size: 60px;
  font-family: "Silkscreen";
  color: #00ff7f;
  background-image:url("@/assets/starguard.gif"); background-repeat: repeat;
  background-size: 100%;
  -webkit-text-stroke-width: 0.7px;
  -webkit-text-stroke-color: #FF13F0;
  user-select: none;
}

</style>
