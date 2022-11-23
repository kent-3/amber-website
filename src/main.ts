// import { SecretNetworkClient } from "secretjs";
import { setupConnectKeplr } from "./connect-keplr";
import { setupConnectWallet } from "./connect-wallet";
// import { setupMetaMask } from "./metamask";
import { setupSuggestToken } from "./suggest-token";
// import axios from "axios";

setupConnectKeplr(document.querySelector<HTMLButtonElement>('#connect-keplr')!)
setupConnectKeplr(document.querySelector<HTMLButtonElement>('#connect-fina')!)
// setupMetaMask(document.querySelector<HTMLButtonElement>('#connect-metamask')!)
setupConnectWallet(document.querySelector<HTMLButtonElement>('#connect-wallet')!)
setupSuggestToken(document.querySelector<HTMLElement>('#airdrop-box')!)

var modal = document.querySelector<HTMLElement>('#myModal')
var open = document.querySelector<HTMLButtonElement>('#start-button')
var close = document.querySelector<HTMLButtonElement>('#close')
var help = document.querySelector<HTMLButtonElement>('#help')
var helpText = document.querySelector<HTMLElement>('#helptext')
var logo = document.querySelector<HTMLImageElement>('#amber')
var rocket = document.querySelector<HTMLImageElement>('#rocket')

logo.onclick = () => {
  logo.classList.toggle('spin')
}

rocket.onclick = () => {
  rocket.style.transform = "translateY(-5000px)"

  setTimeout( () => rocket.style.transform = "translateY(0)", 5000)
}

open.onclick = () => {
  modal.style.display = "block"
  document.body.style.overflowY = "hidden"
  document.querySelector<HTMLElement>('.content').classList.toggle('modal--active')
}
close.onclick = function() {
  modal.style.display = "none"
  document.body.style.overflowY = "scroll"
  document.querySelector<HTMLElement>('.content').classList.toggle('modal--active')
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
    document.querySelector<HTMLElement>('.content').classList.toggle('modal--active')
    document.body.style.overflowY = "scroll"
  }
} 

// window.onload = async ()=>{
//   const formatter = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     maximumFractionDigits: 0
//   });
  
//   const grpcWebUrl = import.meta.env.VITE_MAINNET_GRPC_URL
//   const chainId = import.meta.env.VITE_MAINNET_CHAIN_ID
//   const secretjs = await SecretNetworkClient.create({
//     grpcWebUrl,
//     chainId,
//   });

//   const { validator: validatorResponse } = await secretjs.query.staking.validator({validatorAddr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6'})
//   const scrt = Math.round(parseInt(validatorResponse.tokens) / 1000000 )
//   document.querySelector<HTMLElement>('#voting-power').innerHTML=`${scrt.toLocaleString()}`

//   axios.get('https://api.coingecko.com/api/v3/simple/price?ids=secret&vs_currencies=usd')
//   .then(res => {
//     document.querySelector<HTMLElement>('#stake-value').innerHTML=`${formatter.format(scrt * res.data.secret.usd)}`
//   })
//   .catch(error => {
//     console.log(error)
//   })

//   const { pagination: {total: delegators} } = await secretjs.query.staking.validatorDelegations({validatorAddr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6', pagination: {limit:'1', countTotal: true}})
//   const delegatorsNum = parseInt(delegators)
//   document.querySelector<HTMLElement>('#delegators').innerHTML=`${delegatorsNum.toLocaleString()}`
// }