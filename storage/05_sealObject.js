import { ethers } from "ethers";
import fs from "fs-extra";
import path from "path";

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress, privateKey, sealAddress } =
      await fs.readJSON("../cfg.json");
    const { abi } = await fs.readJSON(
      path.join(contracts, "storage/IStorage.sol/IStorage.json")
    );
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const wallet = new ethers.Wallet(privateKey, provider);
    const bucketName = "mechain";
    const objectName = "01_createBucket.js";
    const globalVirtualGroupId = 1;
    const secondarySpBlsAggSignatures = "0x00";

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.sealObject(
      sealAddress,
      bucketName,
      objectName,
      globalVirtualGroupId,
      secondarySpBlsAggSignatures
    );
    const receipt = await tx.wait();
    console.log("seal object success, receipt: ", receipt);
  } catch (error) {
    console.log("error", error);
  }
};

main();
