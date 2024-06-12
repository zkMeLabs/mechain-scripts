import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769'; // YOU PRIVATE KEY
    const wallet = new ethers.Wallet(privateKey, provider);
    const bucketName = 'mechain' + new Date().getTime();
    const visibility = 2;
    const paymentAddress = wallet.address;
    const primarySpAddress = '0xdDae3F957309cb8ED4621C6648669455E958215B'; // PLEASE UPDATE
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
      chargedReadQuota
    );
    const receipt = await tx.wait();
    console.log('create bucket success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
