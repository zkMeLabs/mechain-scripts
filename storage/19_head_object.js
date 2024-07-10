import { ethers } from "ethers";
import fs from "fs-extra";
import path from "path";

export const main = async () => {
  const { rpc, contracts, storageAddress, privateKey } = await fs.readJSON(
    "../cfg.json"
  );
  const { abi } = await fs.readJSON(
    path.join(contracts, "storage/IStorage.sol/IStorage.json")
  );
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const bucketName = "mechain";
  const objectName = "random_file";

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const objectInfo = await storage.headObject(bucketName, objectName);
  console.log("objectInfo:", objectInfo);
};

main();
