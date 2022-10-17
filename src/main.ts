import { SecretNetworkClient } from "secretjs";
import { setupClaim } from './claim';
import { setupConnectKeplr } from "./connect-keplr";
import { setupConnectWallet } from "./connect-wallet";

setupConnectKeplr(document.querySelector<HTMLButtonElement>('#connect-keplr')!)
setupConnectWallet(document.querySelector<HTMLButtonElement>('#connect-wallet')!)
setupClaim(document.querySelector<HTMLButtonElement>('#claim-button')!)

// Get the modal
var modal = document.querySelector<HTMLElement>('#myModal')
// var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.querySelector<HTMLButtonElement>('#start-button')

var help = document.querySelector<HTMLButtonElement>('#help')
var helpText = document.querySelector<HTMLElement>('#helptext')
help.onclick = () => {
  if (helpText.style.visibility == "hidden") {
    helpText.style.visibility = "visible"
  } else {
    helpText.style.visibility = "hidden"
  }
}

// Get the <span> element that closes the modal
var span = document.querySelector<HTMLButtonElement>('#close')

// When the user clicks on the button, open the modal
btn.onclick = () => {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 

const grpcWebUrl = import.meta.env.VITE_MAINNET_GRPC_URL
const chainId = import.meta.env.VITE_MAINNET_CHAIN_ID

const secretjs = await SecretNetworkClient.create({
  grpcWebUrl,
  chainId: chainId,
});

const { validator: validatorResponse } = await secretjs.query.staking.validator({validatorAddr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6'})
let scrt = Math.round(parseInt(validatorResponse.tokens) / 1000000 )
console.log(`AmberDAO has ${scrt} SCRT staked.`)
document.querySelector<HTMLElement>('#stake-value').innerHTML=`${scrt}`
document.querySelector<HTMLElement>('#voting-power').innerHTML=`${scrt}`

const { delegationResponses: delegationResponse } = await secretjs.query.staking.validatorDelegations({validatorAddr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6', pagination: {limit:'10000'}})
let total: number = delegationResponse.length
console.log(`AmberDAO has ${total} delegations.`)
document.querySelector<HTMLElement>('#delegators').innerHTML=`${total}`


