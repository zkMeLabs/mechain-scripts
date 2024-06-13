import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';
import { lookup } from 'mime-types';
import { NodeAdapterReedSolomon } from '@bnb-chain/reed-solomon/node.adapter';

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    const filePath = './03_createObject.js';
    const fileBuffer = fs.readFileSync(filePath);
    const extname = path.extname(filePath);
    const rs = new NodeAdapterReedSolomon();

    // input params
    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769'; // YOU PRIVATE KEY
    const wallet = new ethers.Wallet(privateKey, provider);
    const bucketName = 'mechain';
    const objectName = 'object name';
    const payloadSize = fileBuffer.length;
    const visibility = 2;
    const contentType = lookup(extname);
    const approval = {
      expiredHeight: 0,
      globalVirtualGroupFamilyId: 1,
      sig: '0x00',
    };
    const expectChecksums = await rs.encodeInWorker(
      '/Users/lcq/Code/zkme/mechain-scripts/storage/03_createObject.js',
      Uint8Array.from(fileBuffer)
    );
    const redundancyType = 0;

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.createObject(
      bucketName,
      objectName,
      payloadSize,
      visibility,
      contentType,
      approval,
      expectChecksums,
      redundancyType
    );
    const receipt = await tx.wait();
    console.log('create object success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
