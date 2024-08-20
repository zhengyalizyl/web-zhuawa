const marked=require("marked") 

function loader(sourcecode){
  console.log("loader"+sourcecode)
  const  html=marked.parse(sourcecode)
   return `module.exports=\`${html}\``
}

module.exports= loader;