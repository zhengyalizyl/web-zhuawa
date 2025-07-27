'use client'
import { useEffect, useState } from 'react' 
const Blog = () => {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => setPosts(data))   
    }, [])
    return <span>123</span>
}

export default Blog