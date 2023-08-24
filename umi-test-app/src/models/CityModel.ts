import { Reducer } from "react"
import { Effect } from "umi"

export interface CityModelType{
  namespace:string,
  state:CityModelStateType
  reducers:CityModelReducerType,
  effects:CityModelEffectType
}

export interface CityModelStateType{
  cityName:string,
  cityId:string
}

export interface CityModelReducerType{
  save: Reducer<CityModelStateType,any>
}

export interface CityModelEffectType{
  query1:Effect
}

const  CityModel:CityModelType={
   namespace:'city',
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
   }
}

export default CityModel