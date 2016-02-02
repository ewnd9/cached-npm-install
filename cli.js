#!/usr/bin/env node

const fs = require('fs');
const modules = process.cwd() + '/node_modules';

if (fs.existsSync(modules)) {
  console.log('node_modules is already exists');
  process.exit(0);
}

const hasha = require('hasha');
const execSync = require('child_process').execSync;
const cacheBase = require('user-home') + '/.cached-npm-install';

if(!fs.existsSync(cacheBase)) {
  fs.mkdirSync(cacheBase);
}

const pkg = require('./package.json');
const deps = JSON.stringify(Object.assign({},
  pkg.dependencies || {},
  pkg.devDependencies || {}
));

const cacheFolder = cacheBase + '/' + hasha(deps);

if (fs.existsSync(cacheFolder)) {
  execSync(`cp -R ${cacheFolder} ${modules}`);
  console.log(`node_modules was copied from cache ${cacheFolder}`);
} else {
  execSync(`npm install`, {
    stdio: [null, 1, 2]
  });
  execSync(`cp -R ${modules} ${cacheFolder}`);
  console.log(`node_modules was copied to cache ${cacheFolder}`);
}
