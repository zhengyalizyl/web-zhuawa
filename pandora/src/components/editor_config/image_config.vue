<template>
    <div>{{ data.name }}</div>
 
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps(["data"]);
</script>
