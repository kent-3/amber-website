import { SecretNetworkClient } from "secretjs";
import { bech32ToBytes } from "./bech32-to-bytes"
import { snapshot } from "./snap";

export function setupClaim(element: HTMLButtonElement) {
    element.style.color = "#D3D3D3"
    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    // const grpcWebUrl = import.meta.env.VITE_GRPC_URL
    const lcdUrl = import.meta.env.VITE_LCD_URL

    const distributorContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
    const distributorContractHash = import.meta.env.VITE_CONTRACT_CODE_HASH

    element.addEventListener("click", async function(event: Event){
        event.preventDefault()

        document.getElementById("step3-container").style.display = "none"
        document.getElementById("step4-container").style.display = "flex"

        const keplrOfflineSigner = window.keplr.getOfflineSignerOnlyAmino(CHAIN_ID)
        const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts()
        console.log(myAddress)

        const secretjs = new SecretNetworkClient({
        url: lcdUrl,
        chainId: CHAIN_ID,
        wallet: keplrOfflineSigner,
        walletAddress: myAddress,
        encryptionUtils: window.keplr.getEnigmaUtils(CHAIN_ID),
        })

        const myBytes = bech32ToBytes(myAddress);

        //@ts-ignore
        try {var myIndex = snapshot.claims[myBytes].index}
        catch {alert("Your address was not found in the snapshot!")}
        //@ts-ignore
        const myAmount = parseInt(snapshot.claims[myBytes].amount).toString()
        //@ts-ignore
        const myProof = snapshot.claims[myBytes].proof
            .map( thing => thing.slice(2))

        const claimMsg = {
            claim: {
            index: myIndex.toString(),
            address: myAddress,
            amount: myAmount,
            proof: myProof,
            },
        };
        
        const tx = await secretjs.tx.compute.executeContract(
            {
            sender: secretjs.address,
            contract_address: distributorContractAddress,
            code_hash: distributorContractHash,
            msg: claimMsg,
            sent_funds: [],
            },
            {
            gasLimit: 350000,
            }
        );

        if (tx.code !== 0) {
            console.log(tx)
            alert(
            `Failed with the following error:\n ${tx.rawLog}`
            )
            document.getElementById("step4-container").style.display = "none"
            document.getElementById("error-container").style.display = "flex"
            document.getElementById("error-message").innerHTML = `${tx.rawLog}`
        } else {
            const response = tx.arrayLog?.find(
            (log) => log.type === "wasm" && log.key === "status"
            )!.value;
            console.log(response);
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