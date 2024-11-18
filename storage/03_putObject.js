import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';
import { joinSignature } from '@ethersproject/bytes';
import { SigningKey } from '@ethersproject/signing-key';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { utf8ToBytes } from 'ethereum-cryptography/utils.js';

export const main = async () => {
  try {
    const { bucketName, objectName, privateKey, rpc, contracts, storageAddress, spAddress, virtualGroupAddress } = await fs.readJSON('../cfg.json');

    const { abi: storageAbi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
    const { abi: virtualGroupAbi } = await fs.readJSON(path.join(contracts, 'virtualgroup/IVirtualGroup.sol/IVirtualGroup.json'));
    const { abi: abiSp } = await fs.readJSON(path.join(contracts, 'storageprovider/IStorageProvider.sol/IStorageProvider.json'));

    const provider = new ethers.JsonRpcProvider(rpc);
    const virtualGroup = new ethers.Contract(virtualGroupAddress, virtualGroupAbi, provider);
    const storage = new ethers.Contract(storageAddress, storageAbi, provider);
    const sp = new ethers.Contract(spAddress, abiSp, provider);

    const [bucketInfo, extraInfo] = await storage.headBucket(bucketName);
    const gvgFamily = await virtualGroup.globalVirtualGroupFamily(bucketInfo.globalVirtualGroupFamilyId);
    const [spList, _] = await sp.storageProviders({
      key: '0x00',
      offset: 0,
      limit: 100,
      countTotal: true,
      reverse: false,
    });
    const spEndpoint = spList.filter((sp) => sp.id === gvgFamily.primarySpId)[0].endpoint;
    const parsedUrl = new URL(spEndpoint);
    const spHost = parsedUrl.hostname;
    console.log('spEndpoint, spHost', spEndpoint, spHost);

    // input params
    const filePath = path.join('.', 'uploadObject', objectName);
    const fileBuffer = fs.readFileSync(filePath);
    const payloadSize = fileBuffer.length;
    const contentType = 'application/octet-stream';
    const currentDate = new Date().toISOString();
    const expiryTimestamp = new Date(Date.now() + 1000 * 1000).toISOString();

    const canonicalRequest = [
      'PUT',
      '/' + bucketName + '/' + objectName,
      '',
      'content-type:' + contentType,
      'x-gnfd-content-sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      'x-gnfd-date:' + currentDate,
      'x-gnfd-expiry-timestamp:' + expiryTimestamp,
      spHost,
      '',
      'content-type;x-gnfd-content-sha256;x-gnfd-date;x-gnfd-expiry-timestamp',
    ].join('\n');
    console.log(`bucketName = ${bucketName}, objectName = ${objectName}, data = ${fileBuffer.toString()}`);
    // console.log(canonicalRequest);

    const canonicalRequestBytes = utf8ToBytes(canonicalRequest);
    const unsignedMsg = keccak256(canonicalRequestBytes);
    const signingKey = new SigningKey('0x' + privateKey);
    const signature = signingKey.signDigest(unsignedMsg);
    let sig = joinSignature(signature);
    const v = sig.slice(-2);
    if (v === '1c') sig = sig.slice(0, -2) + '01';
    if (v === '1b') sig = sig.slice(0, -2) + '00';
    const authorization = `GNFD1-ECDSA, Signature=${sig.slice(2)}`;

    const options = {
      url: spEndpoint + '/' + bucketName + '/' + objectName,
      method: 'PUT',
      path: '/' + bucketName + '/' + objectName,
      httpVersion: 1.1,
      headers: {
        HOST: spHost,
        'User-Agent': 'Greenfield (linux; amd64) greenfield-go-sdk/v0.1.0',
        'Content-Length': payloadSize,
        Authorization: authorization,
        'Content-Type': contentType,
        'X-Gnfd-Content-Sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'X-Gnfd-Date': currentDate,
        'X-Gnfd-Expiry-Timestamp': expiryTimestamp,
        'Accept-Encoding': 'gzip',
      },
      body: fileBuffer,
    };

    fetch(spEndpoint + '/' + bucketName + '/' + objectName, options)
      .then((response) => {
        if (response.ok) {
          console.log('File data sent successfully!');
        } else {
          console.error('Failed to send file data:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } catch (error) {
    console.log('error', error);
  }
};

main();
