import { bech32ToBytes } from "./bech32-to-bytes"
import { snapshot } from "./snap";
import { setupClaim } from './claim';

export function setupSuggestToken(element: HTMLElement) {

    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    const amberContractAddress: string = import.meta.env.VITE_SNIP20_ADDRESS

    element.addEventListener("click", async function(event: Event){
        event.preventDefault()
        element.style.cursor = "default"
        await window.keplr.suggestToken(CHAIN_ID, amberContractAddress);

        const testAddresses = [
            "secret1pt90mfv6hldemdn9alk2j93uxuhte3gdr0uh52",
            "secret1ptjagldmj03ssxx7yyreyczzzdhcnc7gzv5kp2",
            "secret1p6jwgslfu6wz6df57exh4s5anqn2yrq6m68yjp",
            "secret1zpsx3sum9rxpuhjc98a5wl5t2c57ydwfvjg4qa",
            "secret1zssfyc2upw2rrvzem257j6tnsucxc2nuques06",
            "secret1qzxyvdtdxxannddszsye4my56rqjkamguz3030",
            "secret1q9d6ngwkrc4lz2qev6sl4rcprhhpl3nqnphu2r",
            "secret1q9akppvtnvllernmk63v83y4w9d2z8wyamgw5k",
            "secret1qf57ag69epy0qnzz9cv3trs8ge62dxs90jktzv",
            "secret1q2yjru58ap4l67g3w6ngtyspkk5edrz9xr69tk"
        ]

        const testAddress = testAddresses[Math.floor(Math.random()*testAddresses.length)]

        const myBytes = bech32ToBytes(testAddress);
        //@ts-ignore
        try {var myIndex = snapshot.claims[myBytes].index}
        catch {alert("Your address was not found in the snapshot!")}
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
