import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress, privateKey, groupName } =
      await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(
      path.join(contracts, 'storage/IStorage.sol/IStorage.json'),
    );
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const wallet = new ethers.Wallet(privateKey, provider);

    const tags = [
      { key: 'name', value: 'whzkme' },
      { key: 'info', value: 'mechain' },
    ];

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.setTagForGroup(groupName, tags);
    const receipt = await tx.wait();
    console.log('update group member success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
