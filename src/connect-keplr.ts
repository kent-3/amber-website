export function setupConnectKeplr(element: HTMLButtonElement) {
    element.disabled = false
    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID

    element.addEventListener("click", async function(event: Event){
        event.preventDefault()
        element.disabled = true

        if (!window.getOfflineSigner || !window.keplr) {
            alert("Please install Keplr extension");
        } else {
    ////////////////////////////////////////////////////////////////////////
            if (CHAIN_ID.includes("pulsar") && window.keplr.experimentalSuggestChain) {
            try {
                await window.keplr.experimentalSuggestChain({
                chainId: "pulsar-2",
                chainName: "Secret Testnet",
                rpc: "https://rpc.testnet.secretsaturn.net",
                rest: "https://lcd.testnet.secretsaturn.net",
                stakeCurrency: {
                    coinDenom: "SCRT",
                    coinMinimalDenom: "uscrt",
                    coinDecimals: 6,
                },
                bip44: {
                    coinType: 529,
                },
                bech32Config: {
                    bech32PrefixAccAddr: "secret",
                    bech32PrefixAccPub: "secretpub",
                    bech32PrefixValAddr: "secretvaloper",
                    bech32PrefixValPub: "secretvaloperpub",
                    bech32PrefixConsAddr: "secretvalcons",
                    bech32PrefixConsPub: "secretvalconspub"
                },
                currencies: [{
                    coinDenom: "SCRT",
                    coinMinimalDenom: "uscrt",
                    coinDecimals: 6,
                }],
                feeCurrencies: [{
                    coinDenom: "SCRT",
                    coinMinimalDenom: "uscrt",
                    coinDecimals: 6,
                    coinGeckoId: "secret"
                }],
                coinType: 529,
                features: ["secretwasm", "ibc-go"]
                });
            } catch {
                alert("Failed to suggest the chain");
                }
            } else {
                alert("Please use the recent version of keplr extension"); 
            }
        }
    ////////////////////////////////////////////////////////////////////////
        console.log("pulsar-2 added")
        await window.keplr.enable(CHAIN_ID)
        console.log("keplr enabled")

        var bubble = document.getElementById("status-bubble-1")
        var line = document.getElementById("status-line-3")
        var next = document.getElementById("connect-wallet")

        bubble.style.color = "#121E34"
        bubble.style.backgroundColor = "#FFBF00"
        line.innerHTML = `<img src="/line-3-yellow.svg" alt="">`
        element.style.backgroundImage = "none"

        next.style.display = "block"

        element.disabled = false
    })
}