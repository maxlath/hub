const { spawn } = require('child_process')

module.exports = (cmd, args) => {
  return new Promise((resolve, reject) => {
    spawn(cmd, args, { stdio: 'inherit' })
    .on('close', resolve)
    .on('error', reject)
  })
}
