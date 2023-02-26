function  withTiming (WrappedComponent){
    let start,end;
    return class extends WrappedComponent{
         constructor(props){
            super(props)
            start=0;
            end=0;
         }
         componentWillMount(){
             if(super.componentWillMount){
                super.componentWillMount()
             }
             start+=Date.now();
         }
        componentDidMount(){
            if(super.componentDidMount){
                super.componentDidMount()
            }
            end+=Date.now();
            console.log(`组件${WrappedComponent.name}渲染需要的时间为${end-time}ms`)
        }
        render(){
            return super.render();
        }
    }
}

export default  withTiming(Home)