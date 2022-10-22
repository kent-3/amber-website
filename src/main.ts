import { SecretNetworkClient } from "secretjs";
import { setupClaim } from './claim';
import { setupConnectKeplr } from "./connect-keplr";
import { setupConnectWallet } from "./connect-wallet";
// import { setupMetaMask } from "./metamask";
import { setupSuggestToken } from "./suggest-token";

setupConnectKeplr(document.querySelector<HTMLButtonElement>('#connect-keplr')!)
// setupMetaMask(document.querySelector<HTMLButtonElement>('#connect-metamask')!)
setupConnectWallet(document.querySelector<HTMLButtonElement>('#connect-wallet')!)
setupSuggestToken(document.querySelector<HTMLElement>('#airdrop-box')!)
setupClaim(document.querySelector<HTMLButtonElement>('#claim-button')!)

var modal = document.querySelector<HTMLElement>('#myModal')
var open = document.querySelector<HTMLButtonElement>('#start-button')
var close = document.querySelector<HTMLButtonElement>('#close')
var help = document.querySelector<HTMLButtonElement>('#help')
var helpText = document.querySelector<HTMLElement>('#helptext')


open.onclick = () => {
  modal.style.display = "block";
}
close.onclick = function() {
  modal.style.display = "none";
}
help.onclick = () => {
  if (helpText.style.visibility == "hidden") {
    helpText.style.visibility = "visible"
  } else {
    helpText.style.visibility = "hidden"
  }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 

window.onload = async ()=>{
  const grpcWebUrl = import.meta.env.VITE_MAINNET_GRPC_URL
  const chainId = import.meta.env.VITE_MAINNET_CHAIN_ID
  const secretjs = await SecretNetworkClient.create({
    grpcWebUrl,
    chainId,
  });

  const { validator: validatorResponse } = await secretjs.query.staking.validator({validatorAddr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6'})
  const scrt = Math.round(parseInt(validatorResponse.tokens) / 1000000 )
  const { delegationResponses: delegationResponse } = await secretjs.query.staking.validatorDelegations({validatorAddr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6', pagination: {limit:'10000'}})
  const total: number = delegationResponse.length

  document.querySelector<HTMLElement>('#stake-value').innerHTML=`${scrt}`
  document.querySelector<HTMLElement>('#voting-power').innerHTML=`${scrt}`

  document.querySelector<HTMLElement>('#delegators').innerHTML=`${total}`

}
