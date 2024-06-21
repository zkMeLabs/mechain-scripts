import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  const member = '0x2C3a8b5E870478DD2370D0C2f85d8aeCD04871fE';
  const groupOwner = '0x62d574476d10f5745DC0c686c280762f97251c8a';
  const groupName = 'mechain';

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const groupinfo = await storage.headGroup(member, groupOwner, groupName);
  console.log('groupmember:', groupinfo.toObject(true));
};

main();
