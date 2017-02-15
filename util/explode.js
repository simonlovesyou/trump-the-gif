const child_process = require('child_process');
const Promise = require('bluebird');
const mkdirp = Promise.promisify(require('mkdirp'));
const glob = Promise.promisify(require('glob'));
const path = require('path');
const exec = require('child_process').exec;

const execute = (script) =>
  new Promise((resolve, reject) =>
    exec(script, (error, stdout, stderr) => {
      if(error) {
        return reject(stderr);
      }
      return resolve(stdout);
    })
  );

const explode = (outputDir, target) => {
  return execute(`convert ${path.join(__dirname, '../gifs', target)} ${outputDir}/frame.png`)
}

glob('./gifs/*.gif')
.map(path.parse)
.map(({ name, dir, ext, base }) =>
  mkdirp(`images/exploded-gifs/${name}`)
  .then(() => explode(`images/exploded-gifs/${name}`, base)))
.then(() => { console.log("Done!") })
.catch(console.error);
