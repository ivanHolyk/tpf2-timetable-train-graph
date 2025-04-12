// main.go
package main

import (
	"encoding/json"
	"syscall/js"

	lua "github.com/yuin/gopher-lua"
)

func parseLua(this js.Value, args []js.Value) interface{} {
	luaCode := args[0].String()

	L := lua.NewState()
	defer L.Close()

	err := L.DoString(luaCode)
	if err != nil {
		js.Global().Get("console").Call("error", "Lua Error: ", err.Error())
		return js.Null()
	}

	// Call data() and assume it returns a table
	err = L.CallByParam(lua.P{
		Fn:      L.GetGlobal("data"),
		NRet:    1,
		Protect: true,
	})
	if err != nil {
		js.Global().Get("console").Call("error", "Call Error: ", err.Error())		
	}

	table := L.Get(-1)
	L.Pop(1)

	// Convert Lua table to Go map (VERY minimal example)
	goValue := luaValueToGo(L, table)

	jsonBytes, err := json.Marshal(goValue)
	if err != nil {
		js.Global().Get("console").Call("error", "JSON Error: ", err.Error())		
	}

	return js.ValueOf(string(jsonBytes))
}

func luaValueToGo(L *lua.LState, val lua.LValue) interface{} {
	switch v := val.(type) {
	case *lua.LTable:
		m := map[string]interface{}{}
		v.ForEach(func(key, value lua.LValue) {
			m[key.String()] = luaValueToGo(L, value)
		})
		return m
	case lua.LString:
		return string(v)
	case lua.LNumber:
		return float64(v)
	case lua.LBool:
		return bool(v)
	default:
		return nil
	}
}

func registerCallbacks() {
	js.Global().Set("parseLua", js.FuncOf(parseLua))
}

func main() {
	c := make(chan struct{}, 0)
	registerCallbacks()
	<-c // Keep running
}
