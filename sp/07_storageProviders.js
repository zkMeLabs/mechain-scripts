import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, spAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'storageprovider/IStorageProvider.sol/IStorageProvider.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const sp = new ethers.Contract(spAddress, abi, provider);
  const [sps, pageResponse] = await sp.storageProviders(pageRequest);
  // console.log('buckets', buckets.toObject(true));
  for (const item of sps) {
    console.log('storage provider', item.toObject(true));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
