import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey = 'a160e95008c72e45572774970581da6ab99c4663a5ca2385d455740a6342a42b'; // YOU PRIVATE KEY
    const wallet = new ethers.Wallet(privateKey, provider);
    const bucketName = 'testabc';

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.deleteBucket(
      bucketName
    );
    const receipt = await tx.wait();
    console.log('delete bucket success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
