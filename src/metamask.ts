import { SecretNetworkClient, MetaMaskWallet } from "secretjs";
import { bech32ToBytes } from "./bech32-to-bytes";
import { snapshot } from "./snap";

export function setupMetaMask(element: HTMLButtonElement) {
    element.disabled = false
    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    const grpcWebUrl = import.meta.env.VITE_GRPC_URL

    const distributorContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
    const distributorContractHash = import.meta.env.VITE_CONTRACT_CODE_HASH

    element.addEventListener("click", async function(event: Event){
        event.preventDefault()
        element.disabled = true

        if (!window.getOfflineSigner || !window.keplr) {
            alert("Please install Keplr extension");
        }
        //@ts-ignore
        const [ethAddress] = await window.ethereum.request({
        method: "eth_requestAccounts",
        });

        //@ts-ignore
        const wallet = await MetaMaskWallet.create(window.ethereum, ethAddress);
  
        const secretjs = await SecretNetworkClient.create({
            grpcWebUrl: grpcWebUrl,
            chainId: CHAIN_ID,
            wallet: wallet,
            walletAddress: wallet.address,
        });

        console.log(secretjs.address)
        
        document.getElementById("status-bubble-1").style.color = "#121E34"
        document.getElementById("status-bubble-1").style.backgroundColor = "#FFBF00"
        document.getElementById("status-bubble-1-label").style.color = "#FFBF00"
        document.getElementById("status-line-3").innerHTML = `<img src="/line-3-yellow.svg" alt="">`
        document.getElementById("status-bubble-2").style.border = "2px solid #FFBF00"
        
        document.getElementById("status-bubble-2").style.color = "#121E34"
        document.getElementById("status-bubble-2").style.backgroundColor = "#FFBF00"
        document.getElementById("status-bubble-2-label").style.color = "#FFBF00"
        document.getElementById("status-bubble-3").style.border = "2px solid #FFBF00"
        document.getElementById("status-line-4").innerHTML = `<img src="/line-4-yellow.svg" alt="">`

        document.getElementById("connect-container").style.display = "none"
        document.getElementById("connect-mm-container").style.display = "none"
        document.getElementById("connect-wallet").style.display = "none"
        document.getElementById("step3-container").style.display = "grid"
        document.getElementById("secret-address").innerHTML = 
            `${wallet.address}`
        element.style.cursor = "default"

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
        console.log('hmmm?')
        const tx = await secretjs.tx.compute.executeContract(
            {
            sender: secretjs.address,
            contractAddress: distributorContractAddress,
            codeHash: distributorContractHash,
            msg: claimMsg,
            sentFunds: [],
            },
            {
            gasLimit: 300000,
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
        }
    })
}