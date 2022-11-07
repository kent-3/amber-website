import { SecretNetworkClient } from "secretjs";
import { bech32ToBytes } from "./bech32-to-bytes"
import { snapshot } from "./snap";

export function setupClaim(element: HTMLButtonElement) {
    // element.disabled = true
    element.style.color = "#D3D3D3"
    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    const grpcWebUrl = import.meta.env.VITE_GRPC_URL

    const distributorContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
    const distributorContractHash = import.meta.env.VITE_CONTRACT_CODE_HASH

    element.addEventListener("click", async function(event: Event){
        event.preventDefault()
        // element.disabled = true

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

        // const testAddresses = [
        //     "secret1pt90mfv6hldemdn9alk2j93uxuhte3gdr0uh52",
        //     "secret1ptjagldmj03ssxx7yyreyczzzdhcnc7gzv5kp2",
        //     "secret1p6jwgslfu6wz6df57exh4s5anqn2yrq6m68yjp",
        //     "secret1zpsx3sum9rxpuhjc98a5wl5t2c57ydwfvjg4qa",
        //     "secret1zssfyc2upw2rrvzem257j6tnsucxc2nuques06",
        //     "secret1qzxyvdtdxxannddszsye4my56rqjkamguz3030",
        //     "secret1q9d6ngwkrc4lz2qev6sl4rcprhhpl3nqnphu2r",
        //     "secret1q9akppvtnvllernmk63v83y4w9d2z8wyamgw5k",
        //     "secret1qf57ag69epy0qnzz9cv3trs8ge62dxs90jktzv",
        //     "secret1q2yjru58ap4l67g3w6ngtyspkk5edrz9xr69tk"
        // ]

        // const testAddress = testAddresses[Math.floor(Math.random()*testAddresses.length)]

        const myBytes = bech32ToBytes(myAddress);
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
            .map( thing => thing.slice(2))

        const claimMsg = {
            claim: {
            // these are not my values, just test values from the actual merkle tree
            index: myIndex.toString(),
            address: myAddress,
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