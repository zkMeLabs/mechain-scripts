# overview

This is an mechain chain smart contract interface call example framework based on node.js, which encapsulates a wealth of contract call interface examples. It includes three major module interfaces: `storage` and `bank`, through which you can interact with the contract.

## Usage Steps

- Install [abigen](https://geth.ethereum.org/docs/tools/abigen)
- In the dir `mechain/x/evm/precompiles` run `sh compile.sh`
- Install Node.js, version `v20.x`.
- Execute `npm install` in the project directory to install dependencies.
- `cfg.default.json` serves as a blueprint; copy its contents to a new file named `cfg.json`. Update the configuration according to your needs.
- Run the JavaScript file, such as `cd storage` then `node 01_createBucket.js`

## How to interact with the contract

In order to understand how to call the contract interface, two contract call examples are listed here, one is a tx type transaction: `createBucket()`, and the other is a query type: `listBuckets()`.

- `createBucket()` Users create bucket

```javascript
import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
    const wallet = new ethers.Wallet(privateKey, provider);
    const bucketName = 'mechain' + new Date().getTime();
    const visibility = 2;
    const paymentAddress = wallet.address;
    const primarySpAddress = '0xdDae3F957309cb8ED4621C6648669455E958215B';
    const approval = {
      expiredHeight: 0,
      globalVirtualGroupFamilyId: 1,
      sig: '0x00',
    };
    const chargedReadQuota = '100000000000000';

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.createBucket(
      bucketName,
      visibility,
      paymentAddress,
      primarySpAddress,
      approval,
      chargedReadQuota
    );
    const receipt = await tx.wait();
    console.log('create bucket success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();

```

- `listBuckets()` Query the details of the buckets

```javascript
import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: false,
    reverse: false,
  };

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const [buckets, pageResponse] = await storage.listBuckets(pageRequest);
  // console.log('buckets', buckets.toObject(true));
  for (const bucket of buckets) {
    console.log('bucket', bucket.toObject(true));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();

```
