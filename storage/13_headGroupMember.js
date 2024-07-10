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
  const member = '0x757F0F85A5184c4E0183525EbD8fEdcD53b7eF80';
  const groupOwner = wallet.address;
  const groupName = 'mechain';

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const groupinfo = await storage.headGroupMember(
    member,
    groupOwner,
    groupName,
  );
  console.log('groupmember:', groupinfo.toObject(true));
};

main();
