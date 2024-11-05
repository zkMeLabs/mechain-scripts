import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  try {
    const { rpc, contracts, bankAddress, denom } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'bank/IBank.sol/IBank.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
    const wallet = new ethers.Wallet(privateKey, provider);

    const bank = new ethers.Contract(bankAddress, abi, wallet);
    const address = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';
    const amount = [
      {
        amount: '50000000000000000000',
        denom,
      },
    ];
    const tx = await bank.send(address, amount);
    const receipt = await tx.wait();
    console.log('receipt: ', JSON.stringify(receipt, undefined, 2));
  } catch (error) {
    console.log('error', error);
  }
};

main();
