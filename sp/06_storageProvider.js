import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, spAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'storageprovider/IStorageProvider.sol/IStorageProvider.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  const id = '1';

  const sp = new ethers.Contract(spAddress, abi, provider);
  const storageProvider = await sp.storageProvider(id);
  console.log('storageProvider:', storageProvider.toObject(true));
};

main();
