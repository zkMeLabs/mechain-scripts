import fs from 'fs-extra';
import { joinSignature } from '@ethersproject/bytes';
import { SigningKey } from '@ethersproject/signing-key';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { utf8ToBytes } from 'ethereum-cryptography/utils.js';

export const main = async () => {
  try {
    const filePath = './go.sum';
    const fileBuffer = fs.readFileSync(filePath);
    const { privateKey } = await fs.readJSON('../cfg.json');

    // input params
    const payloadSize = fileBuffer.length;
    const contentType = 'application/octet-stream';
    const currentDate = new Date().toISOString();
    const expiryTimestamp = new Date(Date.now() + 1000 * 1000).toISOString();
    const canonicalRequest = [
      'PUT',
      '/mechain/go.sum',
      '',
      'content-type:application/octet-stream',
      'x-gnfd-content-sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      'x-gnfd-date:' + currentDate,
      'x-gnfd-expiry-timestamp:' + expiryTimestamp,
      '192.168.0.99:9033',
      '',
      'content-type;x-gnfd-content-sha256;x-gnfd-date;x-gnfd-expiry-timestamp',
    ].join('\n');
    const canonicalRequestBytes = utf8ToBytes(canonicalRequest);
    const unsignedMsg = keccak256(canonicalRequestBytes);
    const signingKey = new SigningKey(privateKey);
    const signature = signingKey.signDigest(unsignedMsg);
    let sig = joinSignature(signature);
    const v = sig.slice(-2);
    if (v === '1c') sig = sig.slice(0, -2) + '01';
    if (v === '1b') sig = sig.slice(0, -2) + '00';
    const authorization = `GNFD1-ECDSA, Signature=${sig.slice(2)}`;

    const options = {
      url: 'http://192.168.0.99:9033/mechain/go.sum',
      method: 'PUT',
      path: '/mechain/go.sum',
      httpVersion: 1.1,
      headers: {
        HOST: '192.168.0.99:9033',
        'User-Agent': 'Greenfield (linux; amd64) greenfield-go-sdk/v0.1.0',
        'Content-Length': payloadSize,
        Authorization: authorization,
        'Content-Type': contentType,
        'X-Gnfd-Content-Sha256':
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'X-Gnfd-Date': currentDate,
        'X-Gnfd-Expiry-Timestamp': expiryTimestamp,
        'Accept-Encoding': 'gzip',
      },
      body: fileBuffer,
    };

    fetch('http://192.168.0.99:9033/mechain/go.sum', options)
      .then((response) => {
        if (response.ok) {
          console.log('File data sent successfully!');
        } else {
          console.error('Failed to send file data:', response.status);
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
