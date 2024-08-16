const JSZip = require('jszip');
const { RawSource } = require('webpack-sources');

class ZipPlugin {
    constructor(options) {
        this.options = options;
    };

    apply(complier) {
        let context = this;
        complier.hooks.emit.tapAsync('zipPlugin', (compilation, callback) => {
            const zip = new JSZip();
            // 生成的所有的静态文件，我都给你压缩一下
            // emit 阶段，我已经能在 complication.assets 中，拿到所有的，要生成的静态文件了
            Object.keys(compilation.assets).forEach((filename)=> {
                const source = compilation.assets[filename].source();
                zip.file(filename, source);
            });

            zip.generateAsync({ type: 'nodebuffer'}).then(res => {
                compilation.assets[context.options.filename] = new RawSource(res);
                callback();
            })
        })
    }
}

module.exports = ZipPlugin;