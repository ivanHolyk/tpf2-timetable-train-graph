<template>
  <label for="timetableLoad">Load save .lua file</label>
  <input ref="file" id="timetableLoad" @change="loadSave" type="file" accept="text/">
  <label for="namesLoad">Load state.csv file</label>
  <input ref="file" id="namesLoad" @change="loadCSV" type="file" accept="text/">
  <RouterLink to="/linesView">Lines view</RouterLink>
  <RouterLink to="/stationsView">Stations view</RouterLink>
  <RouterView></RouterView>

</template>
<script setup>
import { ref } from 'vue';
import { useLineStore } from './stores/lines';
import { parse as parseLuaJson } from 'lua-json'
import { parse as parseCSV } from 'csv-parse/browser/esm/sync';
import { useNameStore } from './stores/names';


const lineStore = useLineStore();
const file = ref();
const content = ref('');
const nameStore = useNameStore()


function loadSave($event) {
  const reader = new FileReader();
  const target = $event.target;
  file.value = target?.files[0];

  reader.addEventListener(
    "load",
    async () => {
      let text = await file.value.text();
      //trim function data() and 'end' at the end   
      text = text.slice(16, text.length - 5)

      let json = parseLuaJson(text)

      let timetable = getTimetable(json).timetable;
      console.log(timetable)
      timetable = Object.keys(timetable).map(key => {
        const line = { ...timetable[key], lineId: key };
        return line;
      });
      console.log(timetable)
      lineStore.setTimetable(timetable)
      content.value = timetable;

    },
    false,
  );
  reader.readAsText(file.value);

}
function loadCSV($event) {
  const reader = new FileReader();
  const target = $event.target;
  file.value = target?.files[0];

  let names = [];

  reader.addEventListener(
    "load",
    async () => {
      let text = await file.value.text();

      names = parseCSV(text, {
        columns: true,
        cast: function (value, context) {
          //expected to be integer id column
          if (!context.header && context.index === 0) {
            return parseInt(value);
          } else return value
        },
      })

      nameStore.setNames(names)


    },
    false,
  );
  reader.readAsText(file.value);
}
/**
 * 
 * @param {String} input 
 * @returns {Array}
 */
function getTimetable(json) {
  return json["timetable_gui.lua"]
}

</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
