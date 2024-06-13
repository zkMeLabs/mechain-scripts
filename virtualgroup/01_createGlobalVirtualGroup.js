import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, virtualGroupAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'virtualgroup/IVirtualGroup.sol/IVirtualGroup.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey = '291819455d1beae7626a5361a03f7deb1a953d4c2409d6db1dd025905fcf7c24'; // YOU SP PRIVATE KEY
    const wallet = new ethers.Wallet(privateKey, provider);
    const familyId = 0;
    const secondarySpIds = [1, 3, 4, 5, 6, 7];
    const deposit = {
      amount: '1000000000000000000',
      denom: 'azkme',
    };

    const virtualGroup = new ethers.Contract(virtualGroupAddress, abi, wallet);
    const tx = await virtualGroup.createGlobalVirtualGroup(familyId, secondarySpIds, deposit);
    const receipt = await tx.wait();
    console.log('create global virtual group success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
