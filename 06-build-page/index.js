const fs = require('fs');
const path = require('path');

async function build() {
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
    if (err) throw err;
  });
  mergeStyles();
  copy();
  let template = '';
  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, tempData) => {
    if (err) throw err;
    template += tempData;
    fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        fs.readFile(path.join(__dirname, 'components', file.name), 'utf-8', (err, data) => {
          if (err) throw err;   
          const key = '{{' + path.parse(file.name).name + '}}';       
          template = template.replace(key, data);
          fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, err => {
            if (err) throw err;
          })
        })
      })
    })
  });
}
build();

function mergeStyles() {
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
    })).then((result) => {
      const resultStr = result.join('\n');
      fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), resultStr, err => {
        if (err) throw err;
      })
    });
  });
}

function copy() {
  const assetsFrom = path.join(__dirname, 'assets');
  const assetsTo = path.join(__dirname, 'project-dist', 'assets');
  fs.readdir(assetsFrom, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (!file.isDirectory) return;
      fs.mkdir(path.join(assetsTo, file.name), { recursive: true }, err => {
        if (err) throw err;
        fs.readdir(path.join(assetsFrom, file.name), 'utf-8', (err, elements) => {
          if (err) throw err;
          elements.forEach(el => {
            fs.copyFile(path.join(assetsFrom, file.name, el), path.join(assetsTo, file.name, el), err => {
              if (err) throw err;
            })
          })
        })        
      });
    })
  })
}