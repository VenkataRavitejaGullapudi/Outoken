
import { backend, canisterId, idlFactory } from '../declarations/backend/index'


export { backend, canisterId, idlFactory }
export let whitelistCanisters = [String(canisterId)]


export const getCurrentPrincipalId = async () => String(await (window as any).ic.plug.agent.getPrincipal())

export const getActor = async () => await (window as any).ic.plug.createActor({
    canisterId: canisterId,
    interfaceFactory: idlFactory,
});

export const createAgent =async () => await (window as any).ic.plug.createAgent({ whitelist: whitelistCanisters, host: String(document.location.origin) })