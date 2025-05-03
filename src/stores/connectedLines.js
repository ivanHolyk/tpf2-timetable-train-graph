import { ref } from "vue"
import { defineStore } from "pinia"

export const useConnectedLinesStore = defineStore(
  "connectedLines",
  () => {
    const connections = ref([])

    function addConnection(from, to) {
      connections.value.push({ from, to })
    }

    function removeConnection(index) {
      connections.value.splice(index, 1)
    }

    function clearConnections() {
      connections.value = []
    }

    function getConnections() {
      return connections.value
    }

    return {
      connections,
      addConnection,
      removeConnection,
      clearConnections,
      getConnections,
    }
  },
  {
    persist: true,
  },
)
