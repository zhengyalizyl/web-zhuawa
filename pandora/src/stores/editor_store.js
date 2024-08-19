import { ref, reactive } from 'vue';

export default reactive({
    id: '',
    setting: {
        title: '',
        desc: '',
        backgroundColor: '',
        category: '',
    },
    components: [],
    countComponents:{},
})


export const ToolsList = [{
    id: 'title_text',
    componentName: 'TitleText',
    name: '标题文本',
    limit: 10,
    iconUrl: '/src/assets/tools_title_text.svg'
}, {
    id: 'image',
    componentName: 'Image',
    name: '图片',
    limit: 50,
    iconUrl: '/src/assets/tools_image.svg'
}, {
    id: 'carousel',
    componentName: 'Carousel',
    name: '轮播',
    limit: 10,
    iconUrl: '/src/assets/tools_carousel.svg'
}]

export const ToolItemCount = reactive({
    TitleText: 0,
    Image: 0,
    Carousel: 0,
})