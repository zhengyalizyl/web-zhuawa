<template>
    <component :is="component_item.configComponent" :data="component_item" :onchange="handleConfig"></component>
</template>

<script>
import TitleTextConfig from "./title_text_config.vue";
import ImageConfig from "./image_config.vue";
export default {
    components: {
        TitleTextConfig,
        ImageConfig
    }
}
</script>

<script setup>
import { defineProps } from "vue";
const props = defineProps(["component_item"]);

const handleConfig = (id, key, value) => {
    console.log(id, "<<--->>", key, "<<<<---->>>>",value);
    _EE_.emit("updateComponent", {id, key, value});
}

</script>