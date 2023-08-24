import React from 'react'
import { connect } from 'umi'

function CityDetail(props:any) {

  return (
    <div>CityDetail</div>
  )
}

export default connect(state=>({
   ciityName:state.city.cityName
}))(CityDetail)