const { Client } = require('@bnb-chain/greenfield-js-sdk');
const fs = require('fs');
const client = Client.create('http://localhost:26657', '100000');
const ACCOUNT_PRIVATEKEY = '0xf78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';

const main = async () => {
  const filePath = '/Users/lcq/Code/zkme/mechain-scripts/storage/temp.txt';
  const bucketName = 'hello';
  const objectName = '03';
  const txnHash = 'DC3A0322A05AFAF44F97EC34553DF4FC677A54044EFA7A9C3D9A568D878A176F';
  const endpoint = 'http://node1.dev:9033';
  const uploadRes = await client.object.uploadObject(
    {
      bucketName,
      objectName,
      body: createFile(filePath),
      endpoint,
      txnHash,
    },
    {
      type: 'ECDSA',
      privateKey: ACCOUNT_PRIVATEKEY,
    }
  );

  console.log('upload object ret', uploadRes);
};

function createFile(path) {
  const stats = fs.statSync(path);
  const fileSize = stats.size;

  return {
    name: path,
    type: '',
    size: fileSize,
    content: fs.readFileSync(path),
  };
}

main();
