import { ethers } from "ethers";
import fs from "fs-extra";
import path from "path";

export const main = async () => {
  const { rpc, contracts, storageAddress } = await fs.readJSON("../cfg.json");
  const { abi } = await fs.readJSON(
    path.join(contracts, "storage/IStorage.sol/IStorage.json")
  );
  const provider = new ethers.JsonRpcProvider(rpc);

  const bucketName = "testabc";

  const storage = new ethers.Contract(storageAddress, abi, provider);
  const [bucketInfo, extraInfo] = await storage.headBucket(bucketName);
  console.log("bucket:", bucketInfo.toObject(true));
  console.log("extraInfo:", extraInfo.toObject(true));
};

main();
