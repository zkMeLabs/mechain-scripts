import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const {
      rpc,
      contracts,
      storageAddress,
      privateKey,
      primarySpAddress,
      bucketName,
    } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(
      path.join(contracts, 'storage/IStorage.sol/IStorage.json'),
    );
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const wallet = new ethers.Wallet(privateKey, provider);
    const visibility = 2;
    const paymentAddress = wallet.address;
    const approval = {
      expiredHeight: 0,
      globalVirtualGroupFamilyId: 1,
      sig: '0x00',
    };
    const chargedReadQuota = '100000000000000';

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.createBucket(
      bucketName,
      visibility,
      paymentAddress,
      primarySpAddress,
      approval,
      chargedReadQuota,
    );
    const receipt = await tx.wait();
    console.log('create bucket success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
