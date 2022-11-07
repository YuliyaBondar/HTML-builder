const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, data) => {
  if (err) throw err;
  const dataFilter = data.reduce((array, element) => {
    return !element.isDirectory() && path.parse(element.name).ext === '.css' ? array.concat(element.name) : array;
  }, []);
  Promise.all(dataFilter.map(styleName => {
    return new Promise(resolve => {
      let result = '';
      const rs = fs.createReadStream(path.join(__dirname, 'styles', styleName), 'utf-8');
      rs.on('data', chunk => result += chunk);
      rs.on('end', () => {
        resolve(result);
      })
    }); 
  })).then(result => {
    const resultStr = result.join('\n');
    fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), resultStr, err => {
      if (err) throw err;
      console.log('Styles merged');
    })
  });
});