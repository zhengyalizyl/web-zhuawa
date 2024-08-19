<template>
    <div class="edit_container fl fl_jc_fs fl_ai_fs">
        <div class="edit_left">
            <template v-for="item in ToolsList" :key="item.componentName">
                <div class="edit_tools_item flv fl_jc_c fl_ai_c" @click="addComp(item.componentName, item.limit)">
                    <img :src="item.iconUrl" class="edit_tools_item_icon" />
                    <span class="edit_tools_item_title">{{ item.name }}</span>
                    <span class="edit_tools_item_count">{{ ToolItemCount[item.componentName] }} / {{ item.limit }}</span>
                </div>
            </template>
            <!-- <button @click="addComp('TitleText')">标题文本</button>
            <button @click="addComp('Image')">图片</button>
            <button @click="addComp('Carousel')">轮播</button> -->
        </div>
        <div class="edit_main">
            <iframe id="edit_preview_iframe" src="/preview" class="edit_iframe" />
        </div>
        <div class="edit_right">
            <div class="edit_right_type">
                {{ selectedComponent.name }}
            </div>
            <component :is="selectedComponent.configComponentName" :data="selectedComponent" :onChange="onChange"></component>
        </div>
    </div>
</template>
<script>
// 导入要注册的组件
import TitleTextConfig from "../components/editor_config/title_text_config.vue";

export default {
    // 在这里局部注册
    components: {
        TitleTextConfig
    }
};
</script>
<script setup>
import { onMounted, ref } from "vue";
import _remove from "lodash/remove";
import state, { ToolsList, ToolItemCount } from "../stores/editor_store";
import db from "../db";
// 当前选中的组件
const selectedComponent = ref({});
let childIFrame = null;
const ComponentMap = {
    TitleText: {
        name: "标题文本",
        componentName: "TitleText",
        configComponentName: "TitleTextConfig",
        value: "这里是标题文本",
        styles: {
            textAlign: "left",
            fontWeight: "normal",
            color: "#333",
            backgroundColor: "#fff"
        },
        is_splite_line: false,
        is_more: false,
        more_setting: {
            mode: "mod1",
            url: "",
            text: "查看更多"
        }
    },
    Image: {
        name: "图片",
        componentName: "Image",
        value: "",
        styles: {
            margin: "",
            borderRadius: "",
            boxShadow: ""
        }
    },
    Carousel: {
        name: "轮播",
        componentName: "Carousel",
        value: [
            {
                name: "图片",
                componentName: "Image",
                value: "",
                styles: {
                    margin: "",
                    borderRadius: "",
                    boxShadow: ""
                }
            }
        ]
    }
};
const addComp = (key, limit) => {
    if (ComponentMap[key] && ToolItemCount[key] < limit) {
        const cid = s4() + s4();
        const cData = { ...ComponentMap[key] };
        cData.id = cid;
        // console.log(cData);
        state.components.push(cData);
        ToolItemCount[key]++;
        // window.postMessage(cData);
        childIFrame.postMessage({ message: "addComponent", data: cData });
        db.states.add({...cData, create_time: Date.now()});
    }
};
const s4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

function deleteComponent(cid) {
    state.components = _remove(state.components, item => {
        return item.id === cid;
    });
}

function onChange(key, value){
    // console.log(key,'===',value);
    selectedComponent.value[key] = value
    childIFrame.postMessage({ message: "updateComponent", data: JSON.parse(JSON.stringify(selectedComponent.value)) });
}

onMounted(() => {
    childIFrame = document.getElementById("edit_preview_iframe").contentWindow;
    if (childIFrame) {
        childIFrame.postMessage({ message: "init", data: null });
    }
    window.addEventListener("message", event => {
        // console.log('Message received:', event.data);
        const { message, data } = event.data;
        if (message === "deleteComponent" && data && data.id) {
            deleteComponent(data.id);
        }
        if(message === "selectComponent" && data && data.id){
            state.components.forEach(item => {
                if(item.id === data.id){
                    selectedComponent.value = item;
                }
            })
        }
    });
});
</script>

<style scoped>
.edit_left {
    width: 200px;
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-content: start;
    grid-gap: 10px;
    margin-top: 24px;
}
.edit_main {
    flex: 1;
    background-color: #f7f8fa;
    height: 100vh;
    min-width: 400px;
}
.edit_right {
    width: 376px;
    height: 100vh;
}

.edit_iframe {
    width: 100%;
    height: 844px;
    background-color: #fff;
    margin-top: 24px;
    border: none !important;
}
.edit_tools_item {
    width: 80px;
    height: 88px;
    cursor: pointer;
}
.edit_tools_item_icon {
    width: 32px;
    height: 32px;
}
.edit_tools_item_title {
    font-size: 12px;
    margin-top: 4px;
    color: #323233;
}
.edit_tools_item_count {
    font-size: 12px;
    margin-top: 4px;
    color: #7d7e80;
}
.edit_right_type{
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    color: #323233;
    padding: 24px 16px;
    border-bottom: 1px solid #f2f4f6;
}
</style>
