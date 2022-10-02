// import { SecretNetworkClient } from "secretjs";
import { setupClaim } from './claim';

setupClaim(document.querySelector<HTMLButtonElement>('#claim-button')!)

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