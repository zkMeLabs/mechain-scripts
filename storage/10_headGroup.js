import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, storageAddress, privateKey } =
    await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(
    path.join(contracts, 'storage/IStorage.sol/IStorage.json'),
  );
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(privateKey);
  const groupOwner = wallet.address;
  const groupName = 'mechain';

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const groupInfo = await storage.headGroup(groupOwner, groupName);
  console.log('group:', groupInfo.toObject(true));
};

main();
