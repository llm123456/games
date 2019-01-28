/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import { CompilePlugin, EmitResConfigFilePlugin, ExmlPlugin, IncrementCompilePlugin, ManifestPlugin, UglifyPlugin } from 'built-in';
import * as path from 'path';

const config: ResourceManagerConfig = {

    buildConfig: (params) => {

        const target = params.target;
        const command = params.command;
        const projectName = params.projectName;
        const version = params.version;

        if (command == 'bake') {
            const outputDir = '.';
            return {
                outputDir,
                commands: [
                    new EmitResConfigFilePlugin({
                        output: "resource/default.res.json",
                        typeSelector: config.typeSelector,
                        nameSelector: p => {
                            if (p.indexOf("2d/") > 0) {
                                return path.basename(p).replace(/\./gi, "_")
                            }

                            return p;
                        },
                        groupSelector: p => null
                    })
                ]
            }
        }
        else if (command == 'build') {
            const outputDir = '.';
            return {
                outputDir,
                commands: [
                    new ExmlPlugin('debug'),
                    new IncrementCompilePlugin(),
                ]
            }
        }
        else if (command == 'publish') {
            const outputDir = `bin-release/web/${version}`;
            return {
                outputDir,
                commands: [
                    new CompilePlugin({ libraryType: "release" }),
                    new ExmlPlugin('commonjs'),
                    new UglifyPlugin([
                        {
                            sources: ['resource/2d/default.thm.js'],
                            target: "default.thm.min.js"
                        },
                        {
                            sources: ["main.js"],
                            target: "main.min.js"
                        }]),
                    new ManifestPlugin({ output: "manifest.json" })
                ]
            }
        }
        else {
            throw `unknown command : ${params.command}`
        }
    },

    typeSelector: (path) => {

        if (path.indexOf("2d/") >= 0) {
            const ext = path.substr(path.lastIndexOf(".") + 1);
            const typeMap = {
                "jpg": "image",
                "png": "image",
                "webp": "image",
                "json": "json",
                "fnt": "font",
                "pvr": "pvr",
                "mp3": "sound",
                "zip": "zip",
                "mergeJson": "mergeJson",
                "sheet": "sheet"
            }
            let type = typeMap[ext];
            return type;
        } else {
            let filei = path.lastIndexOf("/");
            let file = path.substr(filei + 1);
            let i = file.indexOf(".", 0);
            let extname = "";
            while (i >= 0) {
                extname = file.substr(i);
                const typemap = {
                    ".png": "Texture",
                    ".jpg": "Texture",

                    ".scene.json": "Scene",
                    ".prefab.json": "Prefab",

                    ".image.json": "TextureDesc",
                    ".vs.glsl": 'GLVertexShader',
                    ".fs.glsl": "GLFragmentShader",
                    ".shader.json": "Shader",
                    ".mat.json": "Material",
                    ".mesh.bin": "Mesh",
                    ".ani.bin": "Animation",

                    ".bin": "bin",
                    ".zipjson": "bin"
                }
                const type = typemap[extname]
                if (type) {
                    return type;
                }
                i = file.indexOf(".", i + 1);
            }
            return 'Unknown';
        }
    }
}


export = config;