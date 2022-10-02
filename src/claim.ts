import { SecretNetworkClient } from "secretjs";
// import * as database from './07-merkle-distribution.json';
import { snapshot } from "./snap";
import { bech32 } from 'bech32';
import { Buffer } from 'buffer/';

function bech32ToBytes(address: string): string {
    const bytes = bech32.fromWords(bech32.decode(address).words);
    const buf = Buffer.from(bytes);
    const newKey = "0x" + buf.toString("hex");
    return newKey;
}

export function setupClaim(element: HTMLButtonElement) {
    element.innerHTML = `CLAIM`
    element.disabled = false
    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID
    const grpcWebUrl = import.meta.env.VITE_GRPC_URL

    const distributorContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
    const distributorContractHash = import.meta.env.VITE_CONTRACT_CODE_HASH
    const amberContractAddress: string = import.meta.env.VITE_SNIP20_ADDRESS

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

        await window.keplr.enable(CHAIN_ID)
        const keplrOfflineSigner = window.keplr.getOfflineSignerOnlyAmino(CHAIN_ID)
        const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts()

        const secretjs = await SecretNetworkClient.create({
        grpcWebUrl,
        chainId: CHAIN_ID,
        wallet: keplrOfflineSigner,
        walletAddress: myAddress,
        encryptionUtils: window.keplr.getEnigmaUtils(CHAIN_ID),
        })

        console.log(secretjs.address)

        element.innerHTML = `Connected account: ${myAddress.substring(0,13)}...${myAddress.substring(39)}`

        element.innerHTML = `Add AMBER to Keplr!`
        await window.keplr.suggestToken(CHAIN_ID, amberContractAddress);

        const newKey = bech32ToBytes(myAddress);
        console.log(newKey)
        console.log(snapshot.claims[newKey])
        console.log(snapshot.claims[myAddress])
        try {var myIndex = snapshot.claims[newKey].index}
        catch {alert("Your address was not found in the snapshot!")}
        const myAmount = parseInt(snapshot.claims[newKey].amount).toString()
        const myProof = snapshot.claims[newKey].proof

        const claimMsg = {
            claim: {
            // these are not my values, just test values from the actual merkle tree
            index: myIndex,
            address: myAddress,
            amount: myAmount,
            proof: myProof,
            },
        };
        
        element.innerHTML = `Submit claim!`
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
        }
        element.innerHTML = `Claimed!`
    })
}