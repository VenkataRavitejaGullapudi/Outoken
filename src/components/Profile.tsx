import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { createAgent, getActor } from '../lib/utils';
import {Principal} from '@dfinity/principal'
import "./GridImages.css";

const Profile = ({ principalId,setBlockscreen }: { principalId: string,setBlockscreen:any }) => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    async function getTokens() {
        setLoading(true);
        await createAgent();
        const plugActor = await getActor();
        let key = (window as any).ic.plug.agent.fetchRootKey();
        const tokens = await plugActor.getCallerTokens();
        tokens.sort((a: any, b: any) => {
            if (a.tokenId < b.tokenId) return 1;
            else return -1;
        })
        setTokens(tokens)
        setLoading(false);
    }

    async function transferHandler(tokenId: any) {
        await setBlockscreen(true)
        const to_principalId:string = String(prompt("Enter Recipient Principal Id"));
        if(to_principalId=="") {
            setBlockscreen(false)
            return
        }
        await createAgent();
        const plugActor = await getActor();
        let key = (window as any).ic.plug.agent.fetchRootKey();
        try {
            await plugActor.transferFrom(Principal.fromText(principalId), Principal.fromText(to_principalId), tokenId);
            alert(`NFT transferred successfully to ${to_principalId} 🟢`)
            setBlockscreen(false)
        } catch (e) {
            console.log(e);
            alert(`Not transferred to ${to_principalId} ⛔`)
            setBlockscreen(false)
        }

    }



    useEffect(() => {
        getTokens();
    }, [])
    return <React.Fragment>
        <div className='principalId'>
            <div><b>Your Principal Id:</b></div>
            <div>{principalId}</div>
        </div>
        <div className='gallery'>
            {
                loading ? <h1>🔃 Gathering your tokens from IC canisters 🔃</h1>
                    : tokens.length > 0 ? tokens.map((token: { tokenId: any, imageUrl: string }) => {
                        token.tokenId = parseInt(token.tokenId)
                        return <div className='main-group'><a className='imgDiv' key={`token-${token.tokenId}`} href={token.imageUrl} target="_blank" rel="noreferer">
                            <img src={token.imageUrl} alt="info"></img></a>
                            <div className='group'>
                                <label>Token:{token.tokenId}</label>
                                <button className='transferbtn' onClick={() => transferHandler(token.tokenId)}>Transfer</button>
                            </div>
                        </div>
                    }) : <h1>Not minted any tokens. <Link to="/">Mint for yourself from available</Link></h1>
            }
        </div>
    </React.Fragment>
}

export default Profile

