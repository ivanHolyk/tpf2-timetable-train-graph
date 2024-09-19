<template>
    <h1>Lines</h1>
    <div v-for="line, index in lines" :key="index">
        <LineItem :line="line" :index="index"></LineItem>

    </div>
</template>
<script setup>

import { useLineStore } from '@/stores/lines';
import LineItem from './LineItem.vue'

const lineStore = useLineStore()
const lines = lineStore.getLines()

</script>