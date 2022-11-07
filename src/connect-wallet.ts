export function setupConnectWallet(element: HTMLButtonElement) {
    element.disabled = false
    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID

    element.onpointerdown = ()=> {
        element.style.boxShadow = `inset -4px -4px 4px rgba(58, 68, 93, 0.5), inset 4px 4px 4px #060C18`
    }
    element.onpointerup = ()=> {
        element.style.boxShadow = `-4px -4px 4px rgba(58, 68, 93, 0.5), 4px 4px 4px #060C18`
    }
    element.addEventListener("click", async function(event: Event){
        event.preventDefault()
        element.disabled = true

        const keplrOfflineSigner = window.keplr.getOfflineSignerOnlyAmino(CHAIN_ID)
        const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts()

        document.getElementById("status-bubble-2").style.color = "#121E34"
        document.getElementById("status-bubble-2").style.backgroundColor = "#FFBF00"
        document.getElementById("status-bubble-2-label").style.color = "#FFBF00"
        document.getElementById("status-bubble-3").style.border = "2px solid #FFBF00"
        document.getElementById("status-line-4").innerHTML = `<img src="/line-4-yellow.svg" alt="">`

        document.getElementById("connect-container").style.display = "none"
        document.getElementById("connect-wallet").style.display = "none"
        document.getElementById("step3-container").style.display = "grid"
        document.getElementById("airdrop-amount").style.fontWeight = "700"
        document.getElementById("secret-address").innerHTML = 
            `${myAddress}`
    })
}