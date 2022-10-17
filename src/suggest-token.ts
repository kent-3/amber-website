import { bech32ToBytes } from "./bech32-to-bytes"
import { snapshot } from "./snap";

export function setupSuggestToken(element: HTMLElement) {

    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    const amberContractAddress: string = import.meta.env.VITE_SNIP20_ADDRESS

    element.addEventListener("click", async function(event: Event){
        event.preventDefault()
        element.style.cursor = "default"
        await window.keplr.suggestToken(CHAIN_ID, amberContractAddress);

        const myBytes = bech32ToBytes("secret1qx5pppsfrqwlnmxj7prpx8rysxm2u5vzx6jm8a");
        //@ts-ignore
        try {var myIndex = snapshot.claims[myBytes].index}
        catch {alert("Your address was not found in the snapshot!")}
        //@ts-ignore
        const myAmount = (parseInt(snapshot.claims[myBytes].amount) / 1000000).toString() + " AMBER"

        document.getElementById("airdrop-amount").style.fontSize = "16px"
        document.getElementById("airdrop-amount").innerHTML = `${myAmount}`

        var bubble = document.getElementById("status-bubble-3")
        bubble.style.color = "#121E34"
        bubble.style.backgroundColor = "#FFBF00"
        
        
        document.getElementById("status-line-4").innerHTML = `<img src="/line-4-yellow.svg" alt="">`
        document.getElementById("status-bubble-4").style.border = "2px solid #FFBF00"
        document.getElementById("status-bubble-3-label").style.color = "#FFBF00"
    })
}
