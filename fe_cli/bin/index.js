#! /usr/bin/env node

const {Command} =require('commander');
const fs=require("fs-extra");
const path=require("path");

console.log("hello cli");
console.log(process.argv);
const program =new Command();
program
  .name("fe cli test")
  .description("fe cli 的详细描述在这里")
  .version('0.0.1')

 program.command("create <name>")
 .description("创建一个新工程")
 .action((name)=>{
  console.log('用户传入:'+name);
  const cwd = process.cwd();
  const targetDir=path.join(cwd,name);
  if(fs.existsSync(targetDir)){
    console.log(name+"项目已存在")
    return 
  }else{
    fs.mkdir(targetDir)
  }
 })

  program.parse(process.argv)