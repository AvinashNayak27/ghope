import { ConnectWallet } from '@thirdweb-dev/react'
import { useAddress } from '@thirdweb-dev/react'

function App() {

  const address = useAddress()

  return (
    <>
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
    <ConnectWallet
        btnTitle={"Login"}
        modalSize={"compact"}
        welcomeScreen={{}}
      />
      {address && (
    <div className="text-2xl font-bold">
      {address}
    </div>
  )}
    </>
  )
}

export default App
