<template>

    <tr>
        <td>
            <p>{{ line.line.lineId }} </p>
            <p>{{ nameStore.getName(line.line.lineId) }}</p>
            {{ maxTrains }},{{ maxRow }}
        </td>
        <td style="width: 100%;border-bottom: 1px solid black; " :style="generateGradientForTimetable()">
            <div style="width: 100%; position: relative; overflow: hidden;" :style="getStyle()">
                <ConditionRenderer v-for="(condition, index) in line.conditions['ArrDep']" :key="index"
                    :condition="condition" :displayApproachLeaveTime="props.displayApproachLeaveTime" :index="index"
                    :lineHeight="lineHeight" :lineBottomMargin="lineBottomMargin" :row="getRow(condition, index)"
                    :padding="padding">
                </ConditionRenderer>
            </div>
        </td>
    </tr>
</template>
<script setup>

import { useNameStore } from '@/stores/names';
import ConditionRenderer from './ConditionRenderer.vue';
import { calculateTrainAndRow } from '@/timeTextUtil';
const nameStore = useNameStore()
const props = defineProps(['line', 'displayApproachLeaveTime'])
const line = props.line

//time in seconds to train to aprroach/leave station
const padding = 120

const lineHeight = { value: 1.5, unit: 'rem', total() { return `${this.value}${this.unit}` } }
const lineBottomMargin = { value: 0.25, unit: 'rem' }

const { maxTrainsOnStationByLine, rowAmountToDisplayByLine } = calculateTrainAndRow(line.conditions?.ArrDep, padding)
const maxTrains = maxTrainsOnStationByLine
const maxRow = rowAmountToDisplayByLine

function generateGradientForTimetable() {
    const totalMinutes = 60;

    let gradientStops = [];

    const addStop = (position, color) => {
        gradientStops.push(`white ${position}%, ${color} ${position}% calc(${position}% + 1px), white calc(${position}% + 1px)`);
    };
    // Loop through each 10-minute interval
    for (let i = 0; i <= totalMinutes; i++) {
        let position = (i / totalMinutes) * 100;

        if (position == 100) {
            gradientStops.push(`white calc(${position}% - 1px), black calc(${position}% - 1px) ${position}% `);
        } else {
            if (i % 10 === 0) {
                // Black lines every 10 minutes
                addStop(position, 'black');
            } else if (i % 5 === 0) {
                // Dark gray lines every 5 minutes
                addStop(position, 'darkgray');
            } else {
                // Light gray lines every minute
                addStop(position, 'lightgray');
            }

        }
    }

    let gradientString = gradientStops.join(', ');

    return { backgroundColor: 'white', background: `linear-gradient(to right, ${gradientString})` }
}


function getStyle() {
    let style = {}
    let height = 0
    height = (lineHeight.value + lineBottomMargin.value) * maxRow

    style.height = height + 'rem';
    return style
}


function getRow(condition, index) {
    return index % maxRow
}


</script>