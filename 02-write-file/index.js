const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');
const { stdin: input, stdout: output } = process;
const rl = readline.createInterface({ input, output });
fs.open(path.join(__dirname, 'text.txt'), 'w', (err) => {
  if (err) throw err;
  function createQuestion(isFirst) {
    rl.question(`Введите текст! ${isFirst ? '' : 'и еще что-нибудь'}\n`, data => {
      if (data === 'exit') {
        rl.close();      
      } else {
        fs.appendFile(path.join(__dirname, 'text.txt'), `${data}\n`, err => {
          if (err) throw err;
          createQuestion(false);
        })
      }
    })
  }  
  createQuestion(true);
})
rl.on('close', () => console.log('Bye bye!'))