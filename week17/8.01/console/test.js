var tty = require('tty');
var ttys = require('ttys');
var readline = require('readline');

var stdin = process.stdin;
var stdout = ttys.stdout;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

// stdin.on("data", function(key) {
//     if(key === '\u0003') {
//         process
//     }
// })

function getChar() {
  return new Promise((resolve) => {
    stdin.once('data', function (key) {
      resolve(key);
    });
  });
}

function up(n = 1) {
  stdout.write('\033[' + n + 'A');
}

function down(n = 1) {
  stdout.write('\033[' + n + 'B');
}

function right(n = 1) {
  stdout.write('\033[' + n + 'C');
}

function left(n = 1) {
  stdout.write('\033[' + n + 'D');
}
void (async function () {
  stdout.write('which framework you want to choice?\n');
  let answer = await select(['vue', 'react', 'angular']);
  stdout.write('you selected ' + answer + '\n');

  process.exit();
})();

async function select(choices) {
  let selected = 0;
  for (let i = 0; i < choices.length; i++) {
    if (i === selected) {
      stdout.write('[\x1b[32mx\x1b[0m]' + choices[i] + '\n');
    } else {
      stdout.write('[ ]' + choices[i] + '\n');
    }
  }
  up(choices.length);
  right();
  while (true) {
    let char = await getChar();
    if (char === '\u0003') {
      process.exit();
      break;
    }
    if (char === 'w' && selected > 0) {
      stdout.write(' ');
      left();
      selected--;
      up();
      stdout.write('\x1b[32mx\x1b[0m');
      left();
    }
    if (char === 's' && selected < choices.length - 1) {
      stdout.write(' ');
      left();
      selected++;
      down();
      stdout.write('\x1b[32mx\x1b[0m');
      left();
    }
    if (char === '\r') {
      down(choices.length - selected);
      left();
      return choices[selected];
    }
    // console.log(char.split('').map((c) => c.charCodeAt(0)));
  }
}
