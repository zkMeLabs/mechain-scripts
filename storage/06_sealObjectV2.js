import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';
import { NodeAdapterReedSolomon } from '@bnb-chain/reed-solomon/node.adapter';

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    const filePath = './01_createBucket.js';
    const fileBuffer = fs.readFileSync(filePath);
    const rs = new NodeAdapterReedSolomon();

    // input params
    const privateKey = '25223c354d719036650deb88c4d78a4f29eec81274884939c223b314fdeccd7b'; // YOU PRIVATE KEY
    const wallet = new ethers.Wallet(privateKey, provider);
    const sealAddress = '0x26F10022BE8e14D06180BBaA22ED28D70CB03a25'; // PRIMARY SP ADDRESS
    const bucketName = 'mechain';
    const objectName = '01_createBucket.js';
    const globalVirtualGroupId = 1;
    const secondarySpBlsAggSignatures = '0x8fba72b62bfb6e46ca49cb3b8556e2e13844909eb3eb89669ccbafb4c93b8eaefaf584b010fcf19215090dc0632cba5e0be2960cd256ca816e1e122e5acf8d47ebfef31e9649183d5dcc34fd46fc4c28569244321915d1b70742c49c4e48061a'; // CAllED BY PRIMARY SP
    const expectChecksums = await rs.encodeInWorker(
      '/root/Desktop/whwork/download/mechain-scripts/storage/01_createBucket.js',
      Uint8Array.from(fileBuffer)
    );

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.sealObjectV2(
      sealAddress,
      bucketName,
      objectName,
      globalVirtualGroupId,
      secondarySpBlsAggSignatures,
      expectChecksums
    );
    const receipt = await tx.wait();
    console.log('seal object V2 success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
