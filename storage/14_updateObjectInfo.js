import { ethers } from "ethers";
import fs from "fs-extra";
import path from "path";

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress, privateKey } = await fs.readJSON(
      "../cfg.json"
    );
    const { abi } = await fs.readJSON(
      path.join(contracts, "storage/IStorage.sol/IStorage.json")
    );
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const wallet = new ethers.Wallet(privateKey, provider);
    const bucketName = "mechain";
    const objectName = "go.sum";
    const visibility = 2;

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.updateObjectInfo(
      bucketName,
      objectName,
      visibility
    );
    const receipt = await tx.wait();
    console.log("update object visibility success, receipt: ", receipt);
  } catch (error) {
    console.log("error", error);
  }
};

main();
