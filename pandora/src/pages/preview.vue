<template>
    <div class="preview_content">
        <div class="components_content">
<!--{{ state.components }}-->
            <div class="component_item" v-for="item in state.components" :key="item.id">
                <div class="" @click="selectComponent(item)">
                    <component :is="item.componentName" :data="item"></component>
                </div>
                <div class="selected_box" v-show="item.id === current_id"></div>
                <span class="tip" :class="{ active: item.id === current_id }">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import TitleText from "@components/title_text/index.vue";
import Image from "@components/image/index.vue";
export default {
    components: {
        TitleText,
        Image
    }
};
</script>

<script setup>
import { onMounted, ref } from "vue";
import _findIndex from "lodash/findIndex";
import state from "../stores/editor_store";

const current_id = ref("");

let parent = null;

const selectComponent = item => {
    current_id.value = item.id;
    parent.postMessage({ message: "selectComponent", data: item.id });
};

onMounted(() => {
    window.addEventListener("message", event => {
        const { message, data } = event.data;
        parent = event.source;
        if (message === "createComponent") {
            // alert(JSON.stringify(data));
            console.log(data);
            state.components.push(data);
        }
        if (message === "updateComponent") {
            state.components[
                _findIndex(state.components, function (o) {
                    return o.id == data.id;
                })
            ][data.key] = data.value;
        }
    });
});
</script>

<style scoped>
.preview_content {
    width: 430px;
    height: 750px;
    background-color: #fff;
    margin: 20px auto;
}

.tip {
    padding: 6px;
    border: 1px solid #e0e0e0;
    position: absolute;
    top: 0;
    left: -6px;
    transform: translate(-100%);
    background-color: #fff;
}
.tip.active {
    border: none;
    background-color: #155bd4;
    color: #fff;
}
.tip::before {
    content: " ";
    position: absolute;
    right: -7px;
    top: 13px;
    border-top: 7px solid transparent;
    border-left: 7px solid #e0e0e0;
    border-bottom: 7px solid transparent;
}
.tip::after {
    content: " ";
    position: absolute;
    right: -5px;
    top: 14px;
    border-top: 6px solid transparent;
    border-left: 7px solid #fff;
    border-bottom: 6px solid transparent;
}

.tip.active::after {
    border: 5px solid transparent;
    border-left-color: #155bd4;
}

.selected_box {
    border: 2px solid #155bd4;
    height: calc(100% + 4px);
    width: calc(100% + 4px);
    position: absolute;
    top: -2px;
    left: -2px;
    z-index: 2;
}
</style>
