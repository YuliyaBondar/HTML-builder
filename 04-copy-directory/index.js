const fs = require('fs');
const path = require('path');
async function copy() {
  await fs.promises.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true });
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
    if (err) throw err;
    console.log('The folder was created');
  });
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) throw err;
    files.forEach(element => {
      fs.copyFile(path.join(__dirname, 'files', element), path.join(__dirname, 'files-copy', element), err => {
        if (err) throw err;
        console.log('File was copied');
      });
    })
  });
}
copy();
