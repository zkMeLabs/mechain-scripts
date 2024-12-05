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
    const dstChainId = 97; //bsc-testnet
    const wallet = new ethers.Wallet(privateKey, provider);
    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.mirrorGroup(0, groupName, dstChainId);
    const receipt = await tx.wait();
    console.log('start mirror group success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
