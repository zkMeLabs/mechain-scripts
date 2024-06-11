

This is an mechain chain smart contract interface call example framework based on node.js, which encapsulates a wealth of contract call interface examples. It includes three major module interfaces: `storage` and `bank`, through which you can interact with the contract.

## Usage Steps

- Install Node.js, version `v20.x`.
- Execute `npm intall` in the project directory to install dependencies.
- `cfg.default.json` serves as a blueprint; copy its contents to a new file named `cfg.json`. Update the configuration according to your needs.
- Prepare an `abi` file in json format
- Run the JavaScript file, such as `storage/01_createBucket.js`



## How to interact with the contract

In order to understand how to call the contract interface, two contract call examples are listed here, one is a tx type transaction: `createBucket()`, and the other is a query type: `listBuckets()`.

- `createBucket()` Users create bucket

```javascript

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