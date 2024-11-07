// Tart Testnet
// const CROWDSALE_ADDRESS = "0x96DA27a21057B93Ef804Ec8c1F81941A38842089"
// const TOKEN_ADDRESS = "0xc5Bf49e4022203aaf8c78b25BBb97553bDfB8519"
// const PROVIDER_URL = "https://tart.defimix.io" // Tart Provider
// const TARGET_CHAIN_ID = 31338; // Tart Testnet

// BSC Mainnet 
const CROWDSALE_ADDRESS = "0x3624FEa85BCED3f7C5926B6f9d766B3BBCC067c6"
const TOKEN_ADDRESS = "0x95eda7e54220c6ebf5a8a0d40672849ff029ca6e"
const PROVIDER_URL = "https://bsc.blockpi.network/v1/rpc/public"
const TARGET_CHAIN_ID = 56;

const connectToMetamask = async () => {
    if (window.ethereum) {
        try {
            // Metamask 연결 요청
            await ethereum.request({ method: 'eth_requestAccounts' });
            signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
            console.log("signer", signer);
            // alert('Metamask connected!');
            console.log("networkId", await signer.getChainId());
            if (await signer.getChainId() != TARGET_CHAIN_ID) {
                try {
                    await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: ethers.utils.hexValue(TARGET_CHAIN_ID) }] });
                } catch (e) {
                    alert('Please connect to Binance Smart Chain Mainnet!');
                    return;
                }
            };
            // modify Connect Wallet button text only
            document.getElementById("connect-wallet-btn-text").textContent = "Connected";
        } catch (error) {
            console.error(error);
        }
    } else {
        alert('Metamask not found!');
    }
}

const callContractFunction = async () => {
    if (!signer) {
        alert('Please connect to Metamask first!');
        return;
    }
    try {
        // 컨트랙트에 Token 구입 함수 호출
        const crowdPrivate = crowdsaleContract.connect(signer);
        const myAddress = await signer.getAddress();
        console.log("myAddress", myAddress);
        const rate = await crowdPrivate.rate();
        const nSarm = 1; // 이 부분은 화면에서 입력받아야 함
        const nWei = 1e18 / Number(rate);
        const tx = await crowdPrivate.buyTokens(myAddress, { value: nWei });
        console.log("Transaction sent:", tx);
        const txRet = await tx.wait();
        console.log("Transaction confirmed:", txRet);
        alert("Transaction successful!");
        updatePresaleStatusUsingContract();
    } catch (error) {
        console.error("Error calling contract function:", error);
    }
}

const web3Main = () => {
    let provider;
    let signer;
    let crowdsaleContract;
    let tokenContract;
    let rate;

    // 화면에 표시할 정보를 가져오는 함수
    const updatePresaleStatusUsingContract = async () => {
        // Provider
        provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);

        // ERC20 Contract
        const erc20Ret = await fetch('./abi/SarmToken.json');
        const erc20Abi = await erc20Ret.json();
        console.log("erc20Abi", erc20Abi);
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, provider);

        // Crowdsale Contract
        const crowdRet = await fetch('./abi/Crowdsale.json');
        const crowdAbi = await crowdRet.json();
        console.log("crowdAbi", crowdAbi);
        crowdsaleContract = new ethers.Contract(CROWDSALE_ADDRESS, crowdAbi, provider);

        // Remaining Tokens
        const tokenBalance = await tokenContract.balanceOf(CROWDSALE_ADDRESS);
        const tokenBalanceHuman = Number(ethers.utils.formatEther(tokenBalance)).toFixed(2);
        console.log("token balance in crowdsale", tokenBalanceHuman);
        document.getElementById("remaining-tokens").textContent = Number(tokenBalanceHuman).toLocaleString();

        // Total Supply
        // const totalSupply = await tokenContract.totalSupply();
        // const totalSupplyHuman = ethers.utils.formatEther(totalSupply);

        // Token Price
        const rate = await crowdsaleContract.rate();
        const rateNumber = Number(rate);
        document.getElementById("token-price").textContent = `${Number(rate).toLocaleString()}`;

        // Token Decimals
        const decimals = await tokenContract.decimals();
        console.log("decimals", decimals);
        const weiRaised = await crowdsaleContract.weiRaised();
        console.log("weiRaised", weiRaised);
        const tokenSold = Number(weiRaised) * rateNumber / 10 ** decimals;
        console.log("tokenSold", tokenSold);
        document.getElementById("sold-tokens").textContent = Number(tokenSold).toLocaleString();


        // Progress
        const totalCrowded = Number(tokenBalanceHuman) + Number(tokenSold);
        const soldPercentage = (tokenSold / totalCrowded) * 100;
        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = soldPercentage + "%";
        progressBar.textContent = Math.round(soldPercentage) + "%";

        // Total Crowdsale
        document.getElementById("total-tokens").textContent = Number(totalCrowded).toLocaleString();
    }

    document.addEventListener("click", function (e) {
        if (e.target.id == "connect-wallet-btn") {
            connectToMetamask();
        } else if (e.target.id == "get-sarm") {
            // callContractFunction();
        }
    });

    updatePresaleStatusUsingContract();
    connectToMetamask();
}

const getSarmMain = async () => {
    console.log("Hello Get Sarm");

    document.addEventListener("click", function (e) {
        if (e.target.id == "connect-wallet-btn") {
            connectToMetamask();
        } else if (e.target.id == "get-sarm-now-btn") {
            // callContractFunction();
            console.log("get-sarm-now-btn clicked");
            connectToMetamask();
        }
    });

}