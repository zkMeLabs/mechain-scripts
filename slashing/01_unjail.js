import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, slashingAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'slashing/ISlashing.sol/ISlashing.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    const privateKey = '6634053a1085cd9a12e7834f44d6d7767b5aa959b78739ba5910e9ac179245c1';
    const wallet = new ethers.Wallet(privateKey, provider);

    const slashing = new ethers.Contract(slashingAddress, abi, wallet);
    const tx = await slashing.unjail();
    const receipt = await tx.wait();
    console.log('unjail receipt', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
