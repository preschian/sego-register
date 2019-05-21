#!/usr/bin/env node

const path = require('path');

const { promisify } = require('bluebird');
const glob = promisify(require('glob'));
const argv = require('minimist')(process.argv.slice(2));
const fetch = require('axios');

const { name, bucket, cdn } = argv;

function assetHost() {
  const random = Math.floor(Math.random() * 5);

  return `/`;
}

async function init() {
  try {
    if (name === undefined) throw '"--name your-app" required';
    if (bucket === undefined) throw '"--bucket your-bucket" required';

    const getFiles = await glob(path.join(process.cwd(), '**/*.*'));
    const files = getFiles.map(file => {
      const host = assetHost();
      const fileName = file.replace(process.cwd(), '');

      if (cdn === 'false') return `${fileName}`;

      return `${host}${bucket}${fileName}`;
    });
    const data = {
      name,
      assets: files,
    };

    await fetch({
      method: 'POST',
      url: 'https://ulyix.sse.codesandbox.io/register',
      data,
    });

    console.log('success!');
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

init();
