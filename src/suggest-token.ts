import { bech32ToBytes } from "./bech32-to-bytes"
import { snapshot } from "./snap";
import { setupClaim } from './claim';

export function setupSuggestToken(element: HTMLElement) {

    const CHAIN_ID = "secret-4"
    const amberContractAddress: string = "secret1s09x2xvfd2lp2skgzm29w2xtena7s8fq98v852"

    element.addEventListener("click", async function(event: Event){
        event.preventDefault()
        element.style.cursor = "default"
        await window.keplr.suggestToken(CHAIN_ID, amberContractAddress);

        const keplrOfflineSigner = window.keplr.getOfflineSignerOnlyAmino(CHAIN_ID)
        const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts()

        const myBytes = bech32ToBytes(myAddress);
        //@ts-ignore
        try {var myIndex = snapshot.claims[myBytes].index}
        catch {
            alert("Your address was not found in the snapshot!")
            document.getElementById("airdrop-amount").style.fontSize = "16px"
            document.getElementById("airdrop-amount").innerHTML = `0 AMBER 😢`
            document.getElementById("status-bubble-3").style.color = "#121E34"
            document.getElementById("status-bubble-3").style.backgroundColor = "#FFBF00"
            document.getElementById("status-bubble-3-label").style.color = "#FFBF00"
        }
        //@ts-ignore
        const myAmount = (parseInt(snapshot.claims[myBytes].amount) / 1000000).toString() + " AMBER"

        document.getElementById("airdrop-amount").style.fontSize = "16px"
        document.getElementById("airdrop-amount").innerHTML = `${myAmount}`

        document.getElementById("status-bubble-3").style.color = "#121E34"
        document.getElementById("status-bubble-3").style.backgroundColor = "#FFBF00"
        document.getElementById("status-bubble-3-label").style.color = "#FFBF00"
        document.getElementById("status-bubble-4").style.border = "2px solid #FFBF00"
        document.getElementById("status-line-5").innerHTML = `<img src="/line-5-yellow.svg" alt="">`

        document.getElementById("airdrop-amount").style.color = "#F0F1F5"
        document.getElementById("airdrop-amount").style.fontWeight = "400"
        
        setupClaim(document.querySelector<HTMLButtonElement>('#claim-button')!)
        document.querySelector<HTMLButtonElement>('#claim-button').style.cursor = "pointer"
        document.querySelector<HTMLButtonElement>('#claim-button').style.opacity = "100%"
        document.querySelector<HTMLButtonElement>('#claim-button').style.color = "#F0F1F5"
    })
}
