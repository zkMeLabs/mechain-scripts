import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, distributionAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'distribution/IDistribution.sol/IDistribution.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  const delegatorAddress = '0x00000Be6819f41400225702D32d3dd23663Dd690';

  const distribution = new ethers.Contract(distributionAddress, abi, provider);
  const validatorAddrs = await distribution.delegatorValidators(delegatorAddress);
  for (let i = 0; i < validatorAddrs.length; i++) {
    const validatorAddr = validatorAddrs[i];
    console.log(`validatorAddr ${i + 1}:`, validatorAddr);
  }
};

main();
