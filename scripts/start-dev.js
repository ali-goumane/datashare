const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const logs = path.join(root, 'logs');
fs.mkdirSync(logs, { recursive: true });

function start(name, cwd, command, args) {
  const output = fs.openSync(path.join(logs, `${name}.log`), 'a');
  const child = spawn(command, args, { cwd, detached: true, stdio: ['ignore', output, output], shell: process.platform === 'win32' });
  child.unref();
  console.log(`${name} lancé (PID ${child.pid})`);
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
start('backend', path.join(root, 'backend'), npm, ['run', 'start:dev']);
start('frontend', path.join(root, 'frontend'), npm, ['run', 'dev']);
console.log('DataShare démarre en arrière-plan. Logs : logs/backend.log et logs/frontend.log');
