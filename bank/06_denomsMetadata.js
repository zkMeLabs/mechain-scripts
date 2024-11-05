import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description denomsMetadata
 * queries the client metadata for all registered coin denominations.
 */
export const main = async () => {
  const { rpc, contracts, bankAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'bank/IBank.sol/IBank.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const bank = new ethers.Contract(bankAddress, abi, provider);
  const [metaDatas, pageResponse] = await bank.denomsMetadata(pageRequest);
  for (let i = 0; i < metaDatas.length; i++) {
    const metaData = metaDatas[i];
    console.log(`metaData ${i + 1}:`, JSON.stringify(metaData.toObject(true), undefined, 2));
  }

  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
