import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(
    path.join(contracts, 'storage/IStorage.sol/IStorage.json'),
  );
  const provider = new ethers.JsonRpcProvider(rpc);

  const groupOwner = '0x62d574476d10f5745DC0c686c280762f97251c8a';
  const groupName = 'mechain';

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const groupInfo = await storage.headGroup(groupOwner, groupName);
  console.log('group:', groupInfo.toObject(true));
};

main();
