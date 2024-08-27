//层序遍历
function bfs(root){
   const queue=[];
   queue.push(root);
   while(queue.length){
     const sz=queue.length;
     console.log('第几层',sz)
     for(let i=0;i<sz;i++){
       const cur=queue.shift();
       console.log(cur.value);
       if(cur.left){
        queue.push(cur.left)
       }
       if(cur.right){
        queue.push(cur.right);
       }
     }
   }
}