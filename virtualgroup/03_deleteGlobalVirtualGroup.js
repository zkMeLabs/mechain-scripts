import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, virtualGroupAddress } =
      await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(
      path.join(contracts, 'virtualgroup/IVirtualGroup.sol/IVirtualGroup.json'),
    );
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey =
      'ebbeb28b89bc7ec5da6441ed70452cc413f96ea33a7c790aba06810ae441b776';
    const wallet = new ethers.Wallet(privateKey, provider);
    const gvgId = 1;

    const virtualGroup = new ethers.Contract(virtualGroupAddress, abi, wallet);
    const tx = await virtualGroup.deleteGlobalVirtualGroup(
      gvgId,
    );
    const receipt = await tx.wait();
    console.log('delete global virtual group success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
