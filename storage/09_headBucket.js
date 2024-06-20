import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  const bucketName = 'testabc';

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const [objectinfo, extrainfo] = await storage.headBucket(bucketName);
  console.log('object:', objectinfo.toObject(true));
  console.log('extrainfo:', extrainfo.toObject(true));
};

main();
