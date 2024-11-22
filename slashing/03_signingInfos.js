import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, slashingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'slashing/ISlashing.sol/ISlashing.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const slashing = new ethers.Contract(slashingAddress, abi, provider);
  const [valSigningInfos, pageResponse] = await slashing.signingInfos(pageRequest);
  for (let i = 0; i < valSigningInfos.length; i++) {
    const valSigningInfo = valSigningInfos[i];
    console.log(`valSigningInfo ${i + 1}:`, JSON.stringify(valSigningInfo.toObject(true), undefined, 2));
  }

  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
