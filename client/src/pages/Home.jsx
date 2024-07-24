import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/apiConfig';
import { formatEther, JsonRpcProvider } from 'ethers';
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser';

export default function Home() {
    const [balance, setBalance] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();
    const getUser = useUser()

    useEffect(() => {
        getUser()
        async function fetchUserData() {
            try {
                setWalletAddress(user.ethereum_wallet_address);

                if (user.ethereum_wallet_address) {
                    const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/55e8f6f803634329867ea9b77ccdc6d8');
                    const balance = await provider.getBalance(user.ethereum_wallet_address);
                    setBalance(formatEther(balance));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/auth/login');
            }
        }

        fetchUserData();
    }, [navigate]);

    return (
        <div className='container'>
            <h2>Homepage</h2>
            {walletAddress && (
                <div>
                    <h3>Ethereum Wallet Address:</h3>
                    <p>{walletAddress}</p>
                    <h3>Balance:</h3>
                    <p>{balance ? `${balance} ETH` : 'Loading...'}</p>
                </div>
            )}
        </div>
    );
}
