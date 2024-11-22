import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, slashingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'slashing/ISlashing.sol/ISlashing.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  const slashing = new ethers.Contract(slashingAddress, abi, provider);
  const params = await slashing.params();
  console.log('params:', params.toObject(true));
};

main();
