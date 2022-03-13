import React, { useState } from 'react'
import PlugConnect from '@psychedelic/plug-connect';
import { whitelistCanisters, canisterId } from '../lib/utils'
type Props = {
    loginCallback: () => {};
    authOpenhandler: () => void;
    isAuthOpen: boolean;
}

const Login = ({ loginCallback, authOpenhandler, isAuthOpen }: Props) => {

    return <div className='loginComp' id="connectPlugBtnId" onClick={authOpenhandler}>
        {isAuthOpen ? <div className='loginpage'>
            <h1>Waiting for plug authorization approval</h1>
            <p>Please click on allow in the plug authorization window</p>
        </div>
            : <div className='loginpage'>
                <p>Welcome to Outoken, Here you can mint the existing resources or create a custom resources.
                    Along with you can also transfer tokens.</p>

                <PlugConnect
                    whitelist={whitelistCanisters}
                    onConnectCallback={loginCallback}
                    title={"Login with Plug"}
                    key={"connectPlugBtn"}
                /></div>}
    </div>
}

export default Login


// Not required as PlugConnect will request Connection and creates an agent. 
const connectPlug = async () => {
    const whitelistCanisters = [String(canisterId)];
    // Make a plug request to connect
    const isConnected = await (window as any).ic.plug.requestConnect({
        whitelist: whitelistCanisters
    });
    (window as any).ic.plug.createAgent({ whitelist: whitelistCanisters })
    console.log((window as any).ic.plug.agent)
    const principalId = String(await (window as any).ic.plug.agent.getPrincipal())
    console.log(`Plug's user principal Id is ${principalId}`);;
}

