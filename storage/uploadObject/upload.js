const { Client } = require('@bnb-chain/greenfield-js-sdk');
const fs = require('fs-extra');
const path = require('path');
const { lookup } = require('mime-types');
const https = require('node:https');

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const main = async () => {
  const { bucketName, objectName } = await fs.readJSON('../../cfg.json');

  const filePath = path.join('.', 'temp.txt');
  const fileBuffer = fs.readFileSync(filePath);
  const extname = path.extname(filePath);
  const contentType = lookup(extname);

  console.log(`bucketName = ${bucketName}, objectName = ${objectName}, data = ${fileBuffer.toString()}`);

  // input params
  const privateKey = '0xf78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769'; // YOU PRIVATE KEY

  // putObject
  const client = Client.create('http://devnet-lcd.mechain.tech', '100000');
  const endpoint = 'https://devnet-sp0-rpc.mechain.tech';
  const txnHash = 'D044FDCC1A3F3F79F5CC18EF5C47A42F41C6F2D9B0A3EBC59B4969819BE86938';

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
    }
  );

  if (uploadRes.code == 0) {
    console.log('sleep 6s wait sp node seal object...');
    await sleep(6000);
    console.log('try download object...');
    https
      .get(`${endpoint}/${bucketName}/${objectName}`, (res) => {
        res.on('data', (data) => {
          console.log('statusCode:', res.statusCode, 'data = ', data.toString());
        });
      })
      .on('error', (e) => {
        console.error(e);
      });
  } else {
    console.log('upload object fail, ret', uploadRes);
  }
};

main();
