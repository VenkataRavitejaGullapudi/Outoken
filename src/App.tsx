import React, { useEffect, useState } from 'react'
import './App.css'
import Login from './components/Login'
import Home from './components/Home'
import MintComponent from './components/MintComponent'
import { createAgent, getCurrentPrincipalId, whitelistCanisters } from './lib/utils'
import { Routes, Route, Link } from 'react-router-dom'
import Profile from './components/Profile'

function App() {
  const [isPlugConnected, setPlugConnected] = useState(false)
  const [isLoading, setLoading] = useState(true);
  const [principalId, setPrinicpalId] = useState("")
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [blockscreen, setBlockscreen] = useState(false);
  const authOpenhandler = () => {
    setAuthOpen(true);
    setTimeout(() => setAuthOpen(false), 25000)
  }


  const verifyConnectionAndAgent = async () => {
    const connected = await (window as any).ic.plug.isConnected();
    setPlugConnected(connected);
    if (connected && !(window as any).ic.plug.agent) {
      await createAgent()
      setPrinicpalId(await getCurrentPrincipalId());
    }
    setLoading(false)
  };

  const loginCallback = async () => {
    const principalId = await getCurrentPrincipalId()
    setPrinicpalId(principalId);
    setPlugConnected(true);
    setLoading(false);
    setAuthOpen(false);
  }

  useEffect(() => {
    verifyConnectionAndAgent()
  })
  const logoutHandler = async () => {
    setPlugConnected(false);
    await (window as any).ic.plug.disconnect();
    await verifyConnectionAndAgent()
  }
  return <React.Fragment>
    {blockscreen && <div className='blockscreen'><div>✈️ Dont move sit tight... ✈️</div></div>}
    <header>
      <Link to="/"><div className='title'><strong>Outoken</strong></div></Link>
      <div className='menu'>
        {isPlugConnected ? <div><Link style={{ textDecoration: "none", color: "black" }} to="/profile">Profile</Link></div> : ""}
        {isPlugConnected ? <div onClick={logoutHandler}>Logout</div> : ""}
      </div>
    </header>
    <Routes>
      <Route path="/minter" element={<MintComponent />} />
      <Route path="/profile" element={<div className="App"><Profile setBlockscreen={setBlockscreen} principalId={principalId} /></div>} />
      <Route path='/' element={
        <React.Fragment>

          <div className="App">
            {isLoading && <h1 style={{ alignSelf: 'center' }}>Setting things for you...</h1>}
            {isLoading || (isPlugConnected ? <Home principalId={principalId} verifyConnectionAndAgent={verifyConnectionAndAgent} /> : <Login loginCallback={loginCallback} authOpenhandler={authOpenhandler} isAuthOpen={isAuthOpen} />)}
          </div>
        </React.Fragment>} />
    </Routes>
    <div className='footer'>
        <div>© Designed and Developed by <a href='https://venkataravitejagullapudi.github.io/'>Raviteja</a> in IC network ♾️.</div>
    </div>

  </React.Fragment>;
}

export default App
