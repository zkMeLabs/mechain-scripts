import fs from 'fs-extra';
import { joinSignature } from '@ethersproject/bytes';
import { SigningKey } from '@ethersproject/signing-key';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { utf8ToBytes } from 'ethereum-cryptography/utils.js';

export const main = async () => {
  try {
    const filePath = './uploadObject/temp.txt';
    const fileBuffer = fs.readFileSync(filePath);
    const { bucketName, objectName, privateKey } =
      await fs.readJSON('../cfg.json');

    // input params
    const payloadSize = fileBuffer.length;
    const contentType = 'application/octet-stream';
    const currentDate = new Date().toISOString();
    const expiryTimestamp = new Date(Date.now() + 1000 * 1000).toISOString();
    const sphost = '154.48.244.45:9036'; //sphost ip:port
    const canonicalRequest = [
      'PUT',
      '/' + bucketName + '/' + objectName,
      '',
      'content-type:' + contentType,
      'x-gnfd-content-sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      'x-gnfd-date:' + currentDate,
      'x-gnfd-expiry-timestamp:' + expiryTimestamp,
      sphost,
      '',
      'content-type;x-gnfd-content-sha256;x-gnfd-date;x-gnfd-expiry-timestamp',
    ].join('\n');
    console.log(
      `bucketName = ${bucketName}, objectName = ${objectName}, data = ${fileBuffer.toString()}`,
    );
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
      url: 'http://' + sphost + '/' + bucketName + '/' + objectName,
      method: 'PUT',
      path: '/' + bucketName + '/' + objectName,
      httpVersion: 1.1,
      headers: {
        'HOST': sphost,
        'User-Agent': 'Greenfield (linux; amd64) greenfield-go-sdk/v0.1.0',
        'Content-Length': payloadSize,
        'Authorization': authorization,
        'Content-Type': contentType,
        'X-Gnfd-Content-Sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'X-Gnfd-Date': currentDate,
        'X-Gnfd-Expiry-Timestamp': expiryTimestamp,
        'Accept-Encoding': 'gzip'
      },
      body: fileBuffer
    };

    fetch('http://' + sphost + '/' + bucketName + '/' + objectName, options)
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
