import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const main = async () => {
  const { rpc, contracts, govAddress, denom } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'gov/IGov.sol/IGov.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const privateKey = 'e54bff83fc945cba77ca3e45d69adc5b57ad8db6073736c8422692abecfb5fe2';
  const wallet = new ethers.Wallet(privateKey, provider);
  const gov = new ethers.Contract(govAddress, abi, wallet);

  {
    const messages = JSON.stringify([
      {
        '@type': '/cosmos.gov.v1.MsgExecLegacyContent',
        authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
        content: {
          '@type': '/cosmos.params.v1beta1.ParameterChangeProposal',
          title: 'Bank Module Parameter Change: DefaultSendEnabled.',
          description: 'change default_send_enabled from true to false',
          changes: [
            {
              subspace: 'bank',
              key: 'DefaultSendEnabled',
              value: 'false',
            },
          ],
        },
      },
    ]);
    const metadata = 'Just Test Proposal';
    const title = 'update params';
    const summary = 'use proposal test update params';
    const initialDeposit = [
      {
        denom,
        amount: '10000000',
      },
    ];

    const tx = await gov.submitProposal(messages, initialDeposit, metadata, title, summary);
    const receipt = await tx.wait();
    console.log('legacy submit proposal success, receipt: ', receipt);
  }

  console.log('wait 6s to vote the proposal');
  await sleep('6000');

  {
    const status = 0;
    const voter = '0x0000000000000000000000000000000000000000';
    const depositor = '0x0000000000000000000000000000000000000000';
    const pageRequest = {
      key: '0x00',
      offset: 0,
      limit: 100,
      countTotal: true,
      reverse: true,
    };

    const [_, pageResponse] = await gov.proposals(status, voter, depositor, pageRequest);
    const proposalId = pageResponse.toObject(true).total.toString();
    console.log('proposalId = ', proposalId);

    const options = [
      { option: 1, weight: '0.6' },
      { option: 2, weight: '0.1' },
      { option: 3, weight: '0.2' },
      { option: 4, weight: '0.1' },
    ]; // 0:Unspecified, 1:Yes, 2: Abstain, 3: No, 4:NoWithWeto
    const metadata = 'hello, use evm tx voteWeighted gov';
    const tx = await gov.voteWeighted(proposalId, options, metadata);
    const receipt = await tx.wait();
    console.log(`vote proposal success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);
  }
};

main();
