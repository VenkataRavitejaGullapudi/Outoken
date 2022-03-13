import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import GridImages from './GridImages';
type Props = {
    principalId: string;
    verifyConnectionAndAgent: () => void;
};
const Home = ({ principalId, verifyConnectionAndAgent }: Props) => {
    const custom: React.MutableRefObject<any> = useRef(null)
    const navigate = useNavigate();
    return <React.Fragment>
        <div className='principalId'>
            <div><b>Your Principal Id:</b></div>
            <div>{principalId}</div>
        </div>
        <br />
        <form onSubmit={(e: any) => {
            e.preventDefault();
            navigate(`/minter/?imageUrl=${custom.current?.value}`);
        }}>
            <div className='resources'>
                <div className='sub-title'>Make your custom tokens</div>
                <p className='line'>Paste a custom image link below and click start</p>
                <input placeholder='Paste a valid image url here' type="url" ref={custom} required />
                <button type='submit'>Start it!</button>
            </div>
        </form>
        {/* <button onClick={mint_nft}>Mint NFT</button> */}
        <br/>
        <div className='resources'>
            <h1 className='sub-title'>Available Resources</h1>
            <p className='line'>Click on any image to start minting</p>
        </div>
        <GridImages />

    </React.Fragment>
}


export default Home