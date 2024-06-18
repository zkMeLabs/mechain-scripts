import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey = '25223c354d719036650deb88c4d78a4f29eec81274884939c223b314fdeccd7b'; // YOU PRIVATE KEY
    const wallet = new ethers.Wallet(privateKey, provider);
    const sealAddress = '0x26F10022BE8e14D06180BBaA22ED28D70CB03a25'; // SEAL ADDRESS
    const bucketName = 'mechain';
    const objectName = '01_createBucket.js';
    const globalVirtualGroupId = 1;
    const secondarySpBlsAggSignatures = '0x00';

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.sealObject(
      sealAddress,
      bucketName,
      objectName,
      globalVirtualGroupId,
      secondarySpBlsAggSignatures
    );
    const receipt = await tx.wait();
    console.log('seal object success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
