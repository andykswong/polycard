import Web3 from 'web3';
import { Button } from '../components/Button';
import { useAppState, useDispatch } from '../state/State';
import { connectWallet } from '../state/web3';

export type WalletButtonProps = {
};

export function WalletButton({ }: WalletButtonProps) {
  const dispatch = useDispatch();
  const { walletAddress } = useAppState();
  const connected = walletAddress.length > 0;

  if (!Web3.givenProvider) {
    return (
      <div style={{ margin: '0.5rem' }}>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          Install MetaMask to Play
        </a>
      </div>
    );
  };

  return (
    <Button wide
      onClick={async () => {
        await connectWallet(dispatch);
      }}
    >
      {connected ? (
        'Wallet: ' +
        String(walletAddress).substring(0, 6) +
        '...' +
        String(walletAddress).substring(38)
      ) : (
        'Connect Wallet To Play'
      )}
    </Button>
  )
}
