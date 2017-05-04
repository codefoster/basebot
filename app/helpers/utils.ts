let fs = require('fs');
let readdir = require('readdir-enhanced');
let path = require('path');

export default {
    //takes a directory and using fs to loop through the files in the directory
    //this is how we get the names of our dialogs, recognizers, etc. By looking at the file names in the dialogs folder
    //filter by .js files 
    getFiles: dir => {
        return readdir.sync(dir, { deep: true })
            .map(item => `.${path.posix.sep}${path.posix.join(dir, path.posix.format(path.parse(item)))}`) //normalize paths
            .filter(item => !fs.statSync(item).isDirectory() && /.js$/.test(item)) //filter out directories
            .map(file => ({ name: path.basename(file, '.js'), path: file }))
    },

    wait: (ms:number):Promise<any> => new Promise(resolve => setTimeout(resolve, ms))
}