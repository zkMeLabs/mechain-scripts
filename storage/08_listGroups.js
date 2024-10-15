import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, storageAddress, privateKey } = await fs.readJSON('../cfg.json');
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
  const wallet = new ethers.Wallet(privateKey);
  const groupOwner = wallet.address;

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const [groups, pageResponse] = await storage.listGroups(pageRequest, groupOwner);
  // console.log('groups', groups.toObject(true));
  for (const group of groups) {
    console.log('group', group.toObject(true));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
