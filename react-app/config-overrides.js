const  {name} =reuqire('./package');
module.exports={
    webpack:(config)=>{
      config.output.library=`${name}-[name]`;
      config,output.libraryTarget='umd';
      config.output.chunkLodingGlobal=`webpackJsonp_${name}`;
      return config;
    }
}