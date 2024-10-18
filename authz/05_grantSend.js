import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, authzAddress, denom } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'authz/IAuthz.sol/IAuthz.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  if (false) {
    // authz send
    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
    const wallet = new ethers.Wallet(privateKey, provider);
    const authz = new ethers.Contract(authzAddress, abi, wallet);

    // input params
    const grantee = '0xbf657D0ef7b48167657A703Ed8Fd063F075246D7';
    const authzType = 'send';
    const authorization = 'allowed:0xbf657D0ef7b48167657A703Ed8Fd063F075246D7';
    const limit = [
      {
        denom,
        amount: ethers.parseEther('10000').toString(),
      },
    ];
    const expiration = 0;
    const tx = await authz.grant(grantee, authzType, authorization, limit, expiration);
    const receipt = await tx.wait();
    console.log(`grant success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);
  }

  {
    // test send
    const privateKey = 'e54bff83fc945cba77ca3e45d69adc5b57ad8db6073736c8422692abecfb5fe2';
    const wallet = new ethers.Wallet(privateKey, provider);
    const authz = new ethers.Contract(authzAddress, abi, wallet);

    const from = '0x00000Be6819f41400225702D32d3dd23663Dd690';
    const to = wallet.address || '0x11111116c89D12Cc984c156adC748F89deecC1da';

    console.log('before send balance ' + ethers.formatEther(await provider.getBalance(wallet.address)));
    console.log('before from balance ' + ethers.formatEther(await provider.getBalance(from)));
    console.log('before  to  balance ' + ethers.formatEther(await provider.getBalance(to)));
    // input params
    const msgs = JSON.stringify([
      {
        '@type': '/cosmos.bank.v1beta1.MsgSend',
        from_address: from,
        to_address: to,
        amount: [
          {
            denom,
            amount: ethers.parseEther('1').toString(),
          },
        ],
      },
    ]);
    const tx = await authz.exec(msgs);
    const receipt = await tx.wait();
    console.log(`msgs success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);

    console.log('after send balance ' + ethers.formatEther(await provider.getBalance(wallet.address)));
    console.log('after from balance ' + ethers.formatEther(await provider.getBalance(from)));
    console.log('after  to  balance ' + ethers.formatEther(await provider.getBalance(to)));
  }
};

main();
