const uniABI = require(".IUniswapV2Pair.json");
const getBig = require("big.js");
const wssSetup = require("./wss_setup");

//insert the name of the swap EX: WETH/USDC
const swapID = "";
//insert the address of the pair that you wish to swap
const address = "";

//web3 contract 
const HTTP = new wssSetup.web3http.eth.Contract(
    uniABI.abi,
    address
);

//call the getreserves function from Uniswap
const getReserves = async (ContractObj) => {
    const values = await ContractObj.methods.getReserves().call();

    return [getBig(values.reserve0), getBig(values.reserve1)];
};

const sleep = (timeInMs) =>
    new Promise((resolve) => setTimeout(resolve, timeInMs));

async function showPrice() {
    //keep getting the price at given instance
    while (true) {
        //call getReserves
        const [token1, token2] = await getReserves(HTTP);

        //display price at instant
        console.log(
            `${token1.div(token2).toString()}`
        );

        //decide how long to wait before retrieving and updating the price
        //need to set an integer in sleep function
        await sleep();
        //here we can set the stop price to executeSwap
        if (token1.div(token2) <= 100) {
            executeSwap();
          }
    }
}

//now that we have price, create functions to execute trades

//use ethers.js
const ethers = require('ethers');
//personal file will hold sensitive info like wallet priv key and endpoint url
const personal = require('./personal.json');
//include the router contract of the swap being used. Example: Uniswap's router contract (which is found in their docs).
const router = "";
//insert addresses of the tokens being swapped (example wETH and USDC)
const wETH = ""; 
const USDC = "";
//here we create our wallet and signer, which accesses and signs (verifies) transactions from our wallet
const wallet = new ethers.Wallet(secrets.privatekey);
const provider = new ethers.providers.JsonRpcProvider(personal.provider);
const signer = wallet.connect(provider);

//create the functions that belong to the DEX being accessed.
const routerContract = new ethers.Contract(
    router,
    [
        'function getAmountsOut(uint amountIn, address[] memory path) public view returns(uint[] memory amounts)',
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    signer
);

const USDCContract = new ethers.Contract(
    USDC,
    [
        'function approve(address spender, uint256 amount) external returns (bool)'
    ],
    signer
)
//executeSwap will be called within showPrice
async function executeSwap() {

    const USDCamountIn = ethers.utils.parseUnits('100', 18);
    let values = await routerContract.getAmountsOut(USDCamountIn, [USDC, wETH]);
    const wETHamountOutMin = values[1].sub(values[1].div(10));

    const approveTransaction = await USDCContract.approve(
        router,
        USDCamountIn
    );
    
    let output = await approveTransaction.wait();
    console.log(output);

    const swapTx = await routerContract.swapExactTokensForTokens(
        USDCamountIn,
        wETHamountOutMin,
        [USDC, wETH],
        wallet.address,
        Date.now() + 5 * 60000,
        {gasLimit: 300000}
    )

    result = await swapTx.wait();
    console.log(result);
}

showPrice();

