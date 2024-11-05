const { Client } = require('@bnb-chain/greenfield-js-sdk');
const fs = require('fs-extra');
const path = require('path');
const { lookup } = require('mime-types');
const http = require('node:http');

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const main = async () => {
  const { bucketName, objectName } = await fs.readJSON('/Users/lcq/Code/zkme/mechain-scripts/cfg.json' || '../../cfg.json');

  const filePath = `/Users/lcq/Code/zkme/mechain-scripts/storage/uploadObject/${objectName}` || path.join('.', 'temp.txt');
  const fileBuffer = fs.readFileSync(filePath);
  const extname = path.extname(filePath);
  const contentType = lookup(extname);

  console.log(`bucketName = ${bucketName}, objectName = ${objectName}, data = ${fileBuffer.toString()}`);

  // input params
  const privateKey = '0xf78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769'; // YOU PRIVATE KEY

  // putObject
  const client = Client.create('http://localhost:26657', '5151');
  const endpoint = 'http://node1.dev:9033';
  const txnHash = '';

  const uploadRes = await client.object.uploadObject(
    {
      bucketName,
      objectName,
      body: {
        name: filePath,
        type: contentType,
        size: fileBuffer.length,
        content: fileBuffer,
      },
      endpoint,
      txnHash,
    },
    {
      type: 'ECDSA',
      privateKey,
    },
  );

  if (uploadRes.code == 0) {
    console.log('sleep 6s wait sp node seal object...');
    await sleep(6000);
  } else {
    console.log('upload object fail, ret', uploadRes);
  }

  console.log('anyway, try download object...');
  http
    .get(`${endpoint}/${bucketName}/${objectName}`, (res) => {
      res.on('data', (data) => {
        console.log('statusCode:', res.statusCode, 'data = ', data.toString());
      });
    })
    .on('error', (e) => {
      console.error(e);
    });
};

main();
