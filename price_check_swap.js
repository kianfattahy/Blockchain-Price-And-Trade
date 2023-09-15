
const uniABI = require("./IUniswapV2Pair.json");
const getBig = require("big.js");
const wssSetup = require("./wss_setup");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

//command line arguments
const argv = yargs(hideBin(process.argv)).argv;

//use command line arguments or default to empty strings
const swapID = argv.swapID || "";
const address = argv.address || "";
const stopPrice = argv.stopPrice || "";


// Define a data structure for stop orders
let stopOrders = [
    {
        tokenPair: "WETH/USDC",
        stopPrice: 100,
        action: executeSwap
    },
   
];


const nodemailer = require('nodemailer');

//email configuration
const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your-password";
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "recipient-email@gmail.com";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

async function sendNotification(subject, text) {
    const mailOptions = {
        from: EMAIL_USER,
        to: RECIPIENT_EMAIL,
        subject: subject,
        text: text
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        logger.info("Email sent: " + info.response);
    } catch (error) {
        logger.error("Error sending email:", error);
    }
}


async function getGasPrice() {
    //fetch the current gas price
    const currentGasPrice = await wssSetup.web3http.eth.getGasPrice();
    
    const premiumGasPrice = BigInt(currentGasPrice) + BigInt(currentGasPrice * 0.20);
    

    //100 Gwei as the upper limit, but this can be adjusted
    const gasPriceLimit = ethers.utils.parseUnits('100', 'gwei');
    
    return ethers.utils.formatUnits(BigInt(Math.min(premiumGasPrice, gasPriceLimit)), 'gwei');
}


let tradeHistory = [];

function logTrade(transaction) {
    const trade = {
        timestamp: Date.now(),
        transactionHash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value.toString(),
        gasPrice: transaction.gasPrice.toString(),
        gasUsed: transaction.gasUsed.toString(),
    };
    
    tradeHistory.push(trade);
    saveTradeHistory();
}

function saveTradeHistory() {
    const fs = require('fs');
    fs.writeFileSync('trade_history.json', JSON.stringify(tradeHistory, null, 2));
}

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
    try {
        const values = await ContractObj.methods.getReserves().call();
    } catch (error) {
        logger.error('Error fetching reserves:', error);
        throw error;
    }

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
        logger.info(
            `${token1.div(token2).toString()}`
        );

        //decide how long to wait before retrieving and updating the price
        //need to set an integer in sleep function
        await sleep(3000);
        //here we can set the stop price to executeSwap
        for (let order of stopOrders) {
            if (token1.div(token2) <= order.stopPrice) {
                order.action();
            }
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

    try {
        const USDCamountIn = ethers.utils.parseUnits('100', 18);
    let values = await routerContract.getAmountsOut(USDCamountIn, [USDC, wETH]);
    const wETHamountOutMin = values[1].sub(values[1].div(10));

    const approveTransaction = await USDCContract.approve(
        router,
        USDCamountIn
    );
    
    let output = await approveTransaction.wait();
    logger.info(output);

    const swapTx = await routerContract.swapExactTokensForTokens(
        USDCamountIn,
        wETHamountOutMin,
        [USDC, wETH],
        wallet.address,
        Date.now() + 5 * 60000,
        {gasLimit: 300000, gasPrice: await getGasPrice()}
    )

    result = await swapTx.wait();
            logger.info(result);
        logTrade(result);
        sendNotification('Stop Order Executed', 'A stop order has been executed. Check the logs for details.');
    } catch (error) {
        logger.error('Error executing swap:', error);
        throw error;
    }
}

showPrice();


const winston = require('winston');

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in production, log to console too
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
