import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';
import { lookup } from 'mime-types';
import { ReedSolomon } from '@bnb-chain/reed-solomon';

export const randData = (size) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress, privateKey, bucketName, objectName, } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    const filePath = path.join('.', 'uploadObject', objectName);
    const data = randData(16);
    fs.writeFileSync(filePath, data);
    const fileBuffer = fs.readFileSync(filePath);
    const extname = path.extname(filePath);
    const rs = rpc.includes('127.0.0.1')
      ? new ReedSolomon(1, 1)
      : new ReedSolomon(1, 1);

    // input params
    const wallet = new ethers.Wallet(privateKey, provider);
    const payloadSize = fileBuffer.length;
    const visibility = 1;
    const contentType = lookup(extname);
    const approval = {
      expiredHeight: 0,
      globalVirtualGroupFamilyId: 1,
      sig: '0x00',
    };

    console.log(
      `bucketName = ${bucketName}, objectName = ${objectName}, data = ${data}`,
    );

    // const expectChecksums = await rs.encodeInWorker(filePath, Uint8Array.from(fileBuffer));
    const expectChecksums = rs.encode(Uint8Array.from(fileBuffer));
    const redundancyType = 0;

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.createObject(
      bucketName,
      objectName,
      payloadSize,
      visibility,
      contentType,
      approval,
      expectChecksums,
      redundancyType,
    );
    const receipt = await tx.wait();
    console.log('create object success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
