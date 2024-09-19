export class Station {
  // conditions = {
  //     debounce = { 6, 0, },
  //     type = "debounce",
  // },
  // stationID = 303319,
  // vehiclesWaiting = { },
  constructor(id, name, conditions, vehiclesWaiting) {
    this.id = id
    this.name = name
    this.conditions = conditions
    this.vehiclesWaiting = vehiclesWaiting
  }
}
export class Condition {
  constructor(type, ArrDep, debounce, moreFancey) {
    this.type = type
    this.ArrDep = ArrDep
    this.debounce = debounce
    this.moreFancey = moreFancey
  }
}
