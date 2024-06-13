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
  const bucketName = 'mechain';

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const [objects, pageResponse] = await storage.listObjects(pageRequest, bucketName);
  // console.log('objects', objects.toObject(true));
  for (const object of objects) {
    console.log('object', object.toObject(true));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
