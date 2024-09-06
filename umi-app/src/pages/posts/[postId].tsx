import React from 'react'
import { useParams } from 'umi'

const PostId = () => {
  const param =useParams();
  return (
    <div>
      <p>post</p>
      <div>{param.postId}</div>
    </div>
  )
}

export default PostId;
