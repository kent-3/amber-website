import { SecretNetworkClient } from "secretjs";

export function setupConnectWallet(element: HTMLButtonElement) {
    element.disabled = false
    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    const grpcWebUrl = import.meta.env.VITE_GRPC_URL

    element.onpointerdown = ()=> {
        element.style.backgroundImage = `url(/next-button-pressed.svg)`
    }
    element.onpointerup = ()=> {
        element.style.backgroundImage = `url(/next-button.svg)`
    }

    element.addEventListener("click", async function(event: Event){
        event.preventDefault()
        element.disabled = true

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

        console.log(secretjs.address)

        var bubble = document.getElementById("status-bubble-2")
        bubble.style.color = "#121E34"
        bubble.style.backgroundColor = "#FFBF00"

        document.getElementById("status-line-4").innerHTML = `<img src="/line-4-yellow.svg" alt="">`
        document.getElementById("connect-container").style.display = "none"
        document.getElementById("connect-wallet").style.display = "none"
        document.getElementById("status-bubble-3").style.border = "2px solid #FFBF00"
        document.getElementById("step3-container").style.display = "grid"
        document.getElementById("secret-account").innerHTML = 
            `Connected account: ${myAddress.substring(0,13)}...${myAddress.substring(39)}`

        element.disabled = false
    })
}