import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/apiConfig';
import { formatEther, JsonRpcProvider } from 'ethers';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';

export default function Home() {
    const [balance, setBalance] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();
    const getUser = useUser();

    useEffect(() => {
        async function fetchUserData() {
            try {
                await getUser();
                setWalletAddress(user.ethereum_wallet_address);

                if (user.ethereum_wallet_address) {
                    const provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`);
                    const balance = await provider.getBalance(user.ethereum_wallet_address);
                    setBalance(formatEther(balance));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/auth/login');
            }
        }

        fetchUserData();
    }, [user, navigate, getUser]);

    return (
        <div className='container'>
            <div className='row'>
                <div className="mb-12">
                    {user?.email ? (
                        walletAddress && (
                            <div>
                                <h3>Ethereum Wallet Address:</h3>
                                <p>{walletAddress}</p>
                                <h3>Balance:</h3>
                                <p>{balance ? `${balance} ETH` : 'Loading...'}</p>
                            </div>
                        )
                    ) : (
                        'Please login first'
                    )}
                </div>
            </div>
        </div>
    );
}
