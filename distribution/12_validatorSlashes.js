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

  const validatorAddress = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';
  const startingHeight = 0;
  const endingHeight = 303;
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const distribution = new ethers.Contract(distributionAddress, abi, provider);
  const [validatorSlashEvents, pageResponse] = await distribution.validatorSlashes(validatorAddress, startingHeight, endingHeight, pageRequest);
  for (let i = 0; i < validatorSlashEvents.length; i++) {
    const validatorSlashEvent = validatorSlashEvents[i];
    console.log(`validatorSlashEvent ${i + 1}:`, JSON.stringify(validatorSlashEvent.toObject(true), undefined, 2));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
