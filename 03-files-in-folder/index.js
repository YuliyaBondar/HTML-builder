const fs = require('fs');
const path = require('path');
fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, data) => {
  if (err) throw err;
  const dataFilter = data.filter((element) => {
    return !element.isDirectory();    
  })
  dataFilter.forEach((element) => {
    fs.stat(path.join(__dirname, 'secret-folder', element.name), (err, stat) => {
      if (err) throw err;
      const name = path.parse(element.name).name;
      const ext = path.parse(element.name).ext.slice(1);
      const size = (stat.size / 1024).toFixed(3);
      console.log(`${name} - ${ext} - ${size}kb`);
    })
  })
});