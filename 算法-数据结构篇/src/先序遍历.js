function preOrder(root){
  if(root==null){return }
  console.log(root.value);
  preOrder(root.left);
  preOrder(root.right);
}