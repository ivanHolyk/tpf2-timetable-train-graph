import { ref } from "vue"
import { defineStore } from "pinia"

export const useNameStore = defineStore("names", () => {
  const names = ref([])

  function setNames(newNames) {
    names.value = newNames
  }

  function getName(id) {
    let name = names.value.find((e) => e.id == id)
    return name && name.name ? name.name : id
  }
  return { names, setNames, getName }
})
