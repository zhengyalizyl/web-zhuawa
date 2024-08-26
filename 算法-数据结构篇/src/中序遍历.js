function inOrder(root){
  if(root==null){return }
 
  inOrder(root.left);
  console.log(root.value);
  inOrder(root.right);
}