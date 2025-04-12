let goInstance = null
let initialized = false

export async function initLuaParser() {
  if (initialized) return
  console.log('init instance')
  const go = new Go()
  const result = await WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject)

  goInstance = go
  go.run(result.instance) // <-- don't await this, it runs forever

  initialized = true
}
export async function parseLua(code) {
  console.log('want to get lua parser')
  await initLuaParser()
  console.log('we got an instance')
  if (!window.parseLua) {
    throw new Error('Lua parser function not found')
  }
  const result = window.parseLua(code)
  return JSON.parse(result)
}
