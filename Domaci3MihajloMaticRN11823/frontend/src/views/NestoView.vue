<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const idRef = ref()

function NazoviJeKakoOces(id: string){
  idRef.value = id
}

const prikaz = defineAsyncComponent(
  () => import('@/components/GalleryComponent.vue')
)
</script>

<template>
  <main>
    <body>
        <div id="mama">
          <SlotComp id="mama">
            <template #nesto>
              <main>
                  <body>
                    <div id="mama">
                        <div id="galerija">
                          <Suspense>
                            <prikaz id="galerija" :korisnik-id="idRef" @nov-korisnik-id="NazoviJeKakoOces"/>
                            <template #fallback><div id="name">loading...</div></template>
                          </Suspense>
                        </div>
                    </div>
                </body>
              </main>
            </template>
          </SlotComp>
        </div>
    </body>
  </main>
</template>

<style scoped>

*{
  margin: 0;
  padding: 0;
}

#mama{
  padding: 13px;
  position: fixed;
  left: 0;
  top: 75.5px;
  background-image:url("@/assets/gallery.gif"); background-repeat:repeat;
  width: 100%;
}

@font-face {
  font-family: "Silkscreen";
  src: url(fonts/Silkscreen/slkscr.ttf);
}

#main{
  position: relative;
  align-items: center;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
  left: 31%;
}

#name{
  position: absolute;
  font-size: 60px;
  font-family: "Silkscreen";
  color: #00ff7f;
  background-size: 100%;
  -webkit-text-stroke-width: 0.7px;
  -webkit-text-stroke-color: #FF13F0;
  user-select: none;
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

</style>
