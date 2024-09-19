<template>
    <div>
        <h3>{{ props.index }}</h3>
        <!-- id: {{ line.lineId }}, line name: {{ nameStore.getName(line.lineId) }}
        frequency: {{ line.frequency }}, has timetable: {{ line.hasTimetable }},
        stations: {{ line.stations }}; -->
        <!-- {{ line }} -->
        <div class="transit-info">
            <div class="line-info">
                <span class="icon">🔢</span> Line ID: {{ line.lineId }}
            </div>
            <div class="line-info">
                <span class="icon">🛤️</span> Line name: {{ nameStore.getName(line.lineId) }}
            </div>
            <div class="line-info">
                <span class="icon">⏲️</span> Frequency: {{ line.frequency }}
            </div>
            <div class="line-info">
                <span class="icon">📅</span> Has Timetable: {{ line.hasTimetable }}
            </div>
            <div class="stations">
                <h3><span class="icon">🚉</span> Stations:</h3>
                <div v-for="(station, index) in line.stations" :key="index" class="station">
                    <div class="station-info">
                        <span class="icon">🏷️</span> Station ID: {{ station.stationID }}
                    </div>
                    <div class="station-conditions">
                        <span class="icon">⚙️</span> Conditions:
                        <div>
                            <span class="icon">🔄</span> Debounce: {{ station.conditions?.debounce }}
                        </div>
                        <div>
                            <span class="icon">⚙️</span> Type: {{ station.conditions?.type }}
                        </div>
                    </div>
                    <div class="vehicles-waiting">
                        <span class="icon">🚍</span> Vehicles Waiting:
                        <ul>
                            <!-- <li v-if="Object.keys(station.vehiclesWaiting).length === 0">None</li> -->
                            <li v-for="(vehicle, vehicleId) in station.vehiclesWaiting" :key="vehicleId">
                                Vehicle ID: {{ vehicleId }}, <span class="icon">🕒</span> Departure Time: {{
                                    vehicle.departureTime }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <hr>
    </div>
</template>
<script setup>
import { useNameStore } from '@/stores/names';
const props = defineProps(['line', 'index']);
const line = props.line;
const nameStore = useNameStore()
</script>
<style>
.transit-info {
    font-family: Arial, sans-serif;
}

.line-info,
.station-info,
.station-conditions,
.vehicles-waiting {
    margin-bottom: 10px;
}

.icon {
    margin-right: 5px;
}

.stations {
    margin-top: 20px;
}

.station {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
}
</style>