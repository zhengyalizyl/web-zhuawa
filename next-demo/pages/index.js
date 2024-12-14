import Link from 'next/link'
const  Home=()=>{
  return(
    <div>
      <h1>Welcome to Home Page</h1>
      <Link href="/userList">
         <span>用户列表页</span>
      </Link>
    </div>
  )
}

export default Home;