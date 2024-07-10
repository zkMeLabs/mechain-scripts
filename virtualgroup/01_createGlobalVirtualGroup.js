import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, virtualGroupAddress, privateKey } =
      await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(
      path.join(contracts, 'virtualgroup/IVirtualGroup.sol/IVirtualGroup.json'),
    );
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const wallet = new ethers.Wallet(privateKey, provider);
    const familyId = 0;
    const secondarySpIds = [2, 3, 4, 5, 6, 7];
    const deposit = {
      amount: '1000000000000000000',
      denom: 'azkme',
    };

    const virtualGroup = new ethers.Contract(virtualGroupAddress, abi, wallet);
    const tx = await virtualGroup.createGlobalVirtualGroup(
      familyId,
      secondarySpIds,
      deposit,
    );
    const receipt = await tx.wait();
    console.log('create global virtual group success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
