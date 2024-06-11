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
