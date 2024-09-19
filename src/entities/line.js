export class Line {
  id
  name
  constructor(name, id, frequency, hasTimetable, stations) {
    this.name = name
    this.id = id
    this.frequency = frequency
    this.hasTimetable = hasTimetable
    this.stations = stations
  }
}
