"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require('fs');
let readdir = require('readdir-enhanced');
let path = require('path');
exports.default = {
    getFiles: dir => {
        return readdir.sync(dir, { deep: true })
            .map(item => `.${path.posix.sep}${path.posix.join(dir, path.posix.format(path.parse(item)))}`)
            .filter(item => !fs.statSync(item).isDirectory() && /.js$/.test(item))
            .map(file => ({ name: path.basename(file, '.js'), path: file }));
    },
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};
