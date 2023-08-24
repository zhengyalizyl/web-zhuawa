import { Reducer } from "react"
import { Effect, history } from 'umi';



const  global={
   namespace:'global',
   state:{
    cityName:'北京',
    cityId:'9'
   },
   effects:{
      *query1(){

      }
   },
   reducers:{
      save(state,action){
        return state
      }
   },
   subscriptions:{
      listenRoute({dispatch,history}){
        history.listen(({pathname,query})=>{
          console.log('global subscriptions',pathname,query)
        })
      }
   }
}

export default global