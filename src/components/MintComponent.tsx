import React, { useEffect, useState } from 'react'
import { getCurrentPrincipalId, canisterId, idlFactory, backend, getActor } from '../lib/utils';
import { useLocation, useSearchParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";

const MintComponent = () => {
    let query: any = useQuery();
    const [principalId, setPrinicpalId] = useState("")
    const [mintId, setMintId] = useState("")
    const [minting, setMinting] = useState(false)
    async function savePrinicipalId() {
        setPrinicpalId(await getCurrentPrincipalId());
    }
    useEffect(() => {
        savePrinicipalId();
    })

    console.log("Url ", query.get("imageUrl"))

    async function callMinter() {
        setMinting(true)
        try {
            const mint_id = await mint_nft(query.get("imageUrl"), Principal.fromText(principalId));
            setMintId(String(mint_id))
        }
        catch (e) {
            console.log(e)
        }
        setMinting(false)
    }

    return <React.Fragment>
        <div className='mintComponent'>
            <img src={query.get("imageUrl")} alt="image" />
            <button disabled={minting} onClick={callMinter}>{minting ? "Minting your NFT...." : "Generate NFT"}</button>
            <div>Your mint Id: {mintId ? mintId : minting ? "Minting your token..." : "Not yet generated"}</div>
        </div>
    </React.Fragment>
}



const mint_nft = async (imageUrl: string, principalId: Principal) => {

    console.log("Minting Resource: " + imageUrl, canisterId);
    const nft_minter = await getActor();
    console.log(nft_minter);
    // Mint the image by calling the mint_principal function of the minter.
    let key = (window as any).ic.plug.agent.fetchRootKey();
    const mintId = await nft_minter.mint(String(imageUrl));
    console.log("The id is " + Number(mintId));
    return mintId
}

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default MintComponent