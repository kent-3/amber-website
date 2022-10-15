import { SecretNetworkClient } from "secretjs";
// import { setupClaim } from './claim';
import { setupConnectKeplr } from "./connect-keplr";
import { setupConnectWallet } from "./connect-wallet";

setupConnectKeplr(document.querySelector<HTMLButtonElement>('#connect-keplr')!)
setupConnectWallet(document.querySelector<HTMLButtonElement>('#connect-wallet')!)

// const grpcWebUrl = import.meta.env.VITE_GRPC_URL

// const secretjs = await SecretNetworkClient.create({
//   grpcWebUrl,
//   chainId: "secret-4",
// });

// const { validator: validatorResponse } = await secretjs.query.staking.validator({validatorAddr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6'})
// let scrt = Math.round(parseInt(validatorResponse.tokens) / 1000000 )
// console.log(`AmberDAO has ${scrt} SCRT staked.`)
// document.querySelector<HTMLElement>('#stake-value').innerHTML=`${scrt}`

// const { delegationResponses: delegationResponse } = await secretjs.query.staking.validatorDelegations({validatorAddr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6', pagination: {limit:'1000000'}})
// let total: number = delegationResponse.length
// console.log(`AmberDAO has ${total} delegations.`)

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("start-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
// @ts-ignore
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 