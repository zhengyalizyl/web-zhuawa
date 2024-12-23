function postOrder(root){
  if(root==null){return }
  inOrder(root.left);
  inOrder(root.right);
  console.log(root.value);
}

// 前序位置本身其实没有什么特别的性质，之所以你发现好像很多题都是在前序位置写代码，实际上是因为我们习惯把那些对前中后序位置不敏感的代码写在前序位置罢了。
// 你可以发现，前序位置的代码执行是自顶向下的，而后序位置的代码执行是自底向上的
// 那么换句话说，一旦你发现题目和子树有关，那大概率要给函数设置合理的定义和返回值，在后序位置写代码了。
// 前序位置的代码只能从函数参数中获取父节点传递来的数据，而后序位置的代码不仅可以获取参数数据，还可以获取到子树通过函数返回值传递回来的数据。