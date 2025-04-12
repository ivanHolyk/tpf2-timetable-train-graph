importScripts('/wasm_exec.js')

const go = new Go()

let ready = false
let queue = []

WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject).then((result) => {
  go.run(result.instance)
  ready = true
  queue.forEach((code) => handle(code))
  queue = []
})

function handle(code) {
  const result = self.parseLua(code) // This is the Go function exposed globally
  self.postMessage(result)
}

self.onmessage = (e) => {
  const code = e.data
  if (ready) {
    handle(code)
  } else {
    queue.push(code)
  }
}
