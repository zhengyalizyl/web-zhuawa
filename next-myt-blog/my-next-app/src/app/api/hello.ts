import { mock, Random } from "mockjs";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string
}

export default function handler(req:NextApiRequest, res:NextApiResponse<Data>) {

  res.status(200).json(
    mock({
      'list|1-10':[
        {
        'id|+1':1,
        'name|1':[Random.cname(),Random.cname()],
        'age|18-60':1
      }]
    })
  )
}