import { SecretNetworkClient } from "secretjs";
import { bech32ToBytes } from "./bech32-to-bytes"
import { snapshot } from "./snap";

export function setupClaim(element: HTMLButtonElement) {
    element.disabled = true
    element.style.color = "#D3D3D3"
    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    const grpcWebUrl = import.meta.env.VITE_GRPC_URL

    const distributorContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
    const distributorContractHash = import.meta.env.VITE_CONTRACT_CODE_HASH

    element.addEventListener("click", async function(event: Event){
        event.preventDefault()
        element.disabled = true

        document.getElementById("step3-container").style.display = "none"
        document.getElementById("step4-container").style.display = "flex"

        const keplrOfflineSigner = window.keplr.getOfflineSignerOnlyAmino(CHAIN_ID)
        const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts()
        console.log(myAddress)

        const secretjs = await SecretNetworkClient.create({
        grpcWebUrl,
        chainId: CHAIN_ID,
        wallet: keplrOfflineSigner,
        walletAddress: myAddress,
        encryptionUtils: window.keplr.getEnigmaUtils(CHAIN_ID),
        })

        const myBytes = bech32ToBytes("secret1qx5pppsfrqwlnmxj7prpx8rysxm2u5vzx6jm8a");
        console.log(myBytes)
        //@ts-ignore
        console.log(snapshot.claims[myBytes])

        //@ts-ignore
        try {var myIndex = snapshot.claims[myBytes].index}
        catch {alert("Your address was not found in the snapshot!")}
        //@ts-ignore
        const myAmount = parseInt(snapshot.claims[myBytes].amount).toString()
        //@ts-ignore
        const myProof = snapshot.claims[myBytes].proof

        const claimMsg = {
            claim: {
            // these are not my values, just test values from the actual merkle tree
            index: myIndex,
            address: "secret1qx5pppsfrqwlnmxj7prpx8rysxm2u5vzx6jm8a",
            amount: myAmount,
            proof: myProof,
            },
        };
        
        const tx = await secretjs.tx.compute.executeContract(
            {
            sender: secretjs.address,
            contractAddress: distributorContractAddress,
            codeHash: distributorContractHash,
            msg: claimMsg,
            sentFunds: [],
            },
            {
            gasLimit: 200000,
            }
        );

        if (tx.code !== 0) {
            alert(
            `Failed with the following error:\n ${tx.rawLog}`
            );
        } else {
            const response = tx.arrayLog?.find(
            (log) => log.type === "wasm" && log.key === "status"
            )!.value;
            alert(response);
            document.getElementById("status-bubble-4").style.color = "#121E34"
            document.getElementById("status-bubble-4").style.backgroundColor = "#FFBF00"
            document.getElementById("status-bubble-4-label").style.color = "#FFBF00"
            document.getElementById("status-line-5").innerHTML = `<img src="/line-5-yellow.svg" alt="">`

            document.getElementById("step4-container").style.display = "none"
            document.getElementById("success-container").style.display = "flex"
            document.getElementById("modal-content").style.backgroundImage = `url("/heart-illustration.svg")`
        }
    })
}