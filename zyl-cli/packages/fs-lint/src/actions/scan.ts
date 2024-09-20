import path from "path";
import fs from 'fs-extra';
import type { ScanOptions, ScanReport ,Config, ScanResult, PKG} from "../types";
import { PKG_NAME } from "../utils/constants";
import { doESLint, doMarkdownlint, doPrettier, doStylelint } from "../lints";

export default async (options:ScanOptions):Promise<ScanReport>=>{
  const {cwd,fix,outputReport,config:scanConfig} =options;

  const readConfigFile=(pth:string)=>{
      const localPath=path.resolve(cwd,pth);
      return fs.existsSync(localPath)?require(localPath):{};
  }

let results:ScanResult[]=[];
let runErrors:Error[]=[];
const pkg: PKG = readConfigFile('package.json');
const config:Config=scanConfig||readConfigFile(`${PKG_NAME}.config.js`)
  if(fix&&config.enablePrettier!==false){
    // handle prettier
    await doPrettier(options);
  }

  if(config.enableESLint!==false){
    // handle enableEslint
     try {
      const eslintResults = await doESLint({ ...options, pkg, config });
      results = results.concat(eslintResults);
     } catch (error) {
        runErrors.push(error)
     }
  }

  if(config.enableMarkdownlint!==false){
    // handle markdownLint
     try {
      const markdownlintResults = await doMarkdownlint({ ...options, pkg, config });
      results = results.concat(markdownlintResults);
     } catch (error) {
        runErrors.push(error)
     }
  }

  if(config.enableStylelint!==false){
    // handle  styleLint
     try {
      const stylelintResults = await doStylelint({ ...options, pkg, config });
      results = results.concat(stylelintResults);
     } catch (error) {
        runErrors.push(error)
     }
  }

  if(outputReport){
    //将结果输出到对应的文件中
    const reportPath=path.resolve(process.cwd(),`./${PKG_NAME}-report.json`);
    fs.outputFile(reportPath,JSON.stringify(results,null,2),()=>{})
  }

  
  return {
    results,
    errorCount: results.reduce((count, { errorCount }) => count + errorCount, 0),
    warningCount: results.reduce((count, { warningCount }) => count + warningCount, 0),
    runErrors,
  };


}