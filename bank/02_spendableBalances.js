import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description spendableBalances
 * queries the spenable balance of all coins for a single account.
 */
export const main = async () => {
  const { rpc, contracts, bankAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'bank/IBank.sol/IBank.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const accountAddress = '0x00000Be6819f41400225702D32d3dd23663Dd690';
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const bank = new ethers.Contract(bankAddress, abi, provider);
  const [balances, pageResponse] = await bank.spendableBalances(accountAddress, pageRequest);
  for (let i = 0; i < balances.length; i++) {
    const balance = balances[i];
    console.log(`balance ${i + 1}:`, JSON.stringify(balance.toObject(true), undefined, 2));
  }

  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
