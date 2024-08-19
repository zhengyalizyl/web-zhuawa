<template>
    <div class="preview_content">
        <template v-if="state.components.length > 0">
            <div
                v-for="item in state.components"
                :key="item.id"
                @click="selectComponent(item.id)"
                class="component_box">
                <div class="component_title">{{ item.name }}</div>
                <div class="seleted_component_box" v-if="currentComponentId === item.id"></div>
                <div class="selected_component_opt" v-if="currentComponentId === item.id"></div>
                <component :is="item.componentName" :data="item"></component>
            </div>
        </template>
    </div>
</template>
<script>
// 导入要注册的组件
import TitleText from "../components/editor_config/title_text_config.vue";

export default {
    // 在这里局部注册
    components: {
        TitleText
    }
};
</script>
<script setup>
import { onMounted, ref } from "vue";
import _remove from "lodash/remove";
import state from "../stores/editor_store";
// 父节点的document
let parent = null;
const currentComponentId = ref("");
function initMessage() {
    window.addEventListener("message", event => {
        // console.log('Message received:', event.data);
        const { message, data } = event.data;
        if (message === "init") {
            parent = event.source;
        }
        if (message === "addComponent" && data && data.id) {
            parent = event.source;
            state.components.push(data);
        }
        if (message === "updateComponent" && data && data.id === currentComponentId.value) {
            console.log("updateComponent:", data.value);
            state.components.forEach((item, ind) => {
                if (item.id === data.id) {
                    state.components[ind] = { ...data };
                    return;
                }
            });
            // state.components[0] = data;
        }
    });
}

function selectComponent(cid) {
    currentComponentId.value = cid;
    parent.postMessage({ message: "selectComponent", data: { id: cid } });
}

function deleteComponent(item) {
    // state.components = [];
    _remove(state.components, o => {
        return o.id === item.id;
    });
    parent.postMessage({ message: "deleteComponent", data: { id: item.id } });
}

onMounted(() => {
    initMessage();
});
</script>

<style scoped>
.preview_content {
    width: 430px;
    height: 750px;
    background-color: #fff;
}
.component_title {
    box-sizing: content-box;
    padding: 4px 7px;
    background-color: #155bd4;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-size: 14px;
    transform: translateX(-110%);
}

.component_title::after {
    content: "";
    border: 5px solid transparent;
    border-left-color: #155bd4;
    position: absolute;
    right: -9px;
    top: 10px;
}

.seleted_component_box {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid #155bd4;
    left: 0;
    top: 0;
    z-index: 999;
}
</style>

<style>
body {
    background-color: #f7f8fa;
}
#root {
    text-align: center;
    display: flex;
    justify-content: center;
}
</style>
