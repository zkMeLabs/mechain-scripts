import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, bankAddress, denom } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'bank/IBank.sol/IBank.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
    const wallet = new ethers.Wallet(privateKey, provider);

    // input params: case2
    const outputs = [
      {
        toAddress: '0x1111102Dd32160B064F2A512CDEf74bFdB6a9F96',
        amount: [{ denom, amount: '10' }],
      },
      {
        toAddress: '0xbf657D0ef7b48167657A703Ed8Fd063F075246D7',
        amount: [{ denom, amount: '20' }],
      },
    ];
    const bank = new ethers.Contract(bankAddress, abi, wallet);
    const tx = await bank.multiSend(outputs);
    const receipt = await tx.wait();
    console.log('multiSend success, receipt2: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
