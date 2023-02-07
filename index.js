const axios = require("axios");
const ethers = require("ethers");
const { bignumber, number } = require("mathjs");
const { Requester, Validator } = require("@chainlink/external-adapter");
var CryptoJS = require("crypto-js");

const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`
);

const IndexToken = new ethers.Contract(
  "0xF17A3fE536F8F7847F1385ec1bC967b2Ca9caE8D",
  [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "feeRatePerDayScaled",
          type: "uint256",
        },
      ],
      name: "FeeRateSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "feeReceiver",
          type: "address",
        },
      ],
      name: "FeeReceiverSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "methodologist",
          type: "address",
        },
      ],
      name: "MethodologistSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "methodology",
          type: "string",
        },
      ],
      name: "MethodologySet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "feeReceiver",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalSupply",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "MintFeeToReceiver",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "minter",
          type: "address",
        },
      ],
      name: "MinterSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Paused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "supplyCeiling",
          type: "uint256",
        },
      ],
      name: "SupplyCeilingSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isRestricted",
          type: "bool",
        },
      ],
      name: "ToggledRestricted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Unpaused",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "feeRatePerDayScaled",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "feeReceiver",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "feeTimestamp",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "tokenName",
          type: "string",
        },
        {
          internalType: "string",
          name: "tokenSymbol",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_feeRatePerDayScaled",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_feeReceiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_supplyCeiling",
          type: "uint256",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "methodologist",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "methodology",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "mintToFeeReceiver",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "minter",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_proposedOwner",
          type: "address",
        },
      ],
      name: "proposeOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "proposedOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_feeRatePerDayScaled",
          type: "uint256",
        },
      ],
      name: "setFeeRate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_feeReceiver",
          type: "address",
        },
      ],
      name: "setFeeReceiver",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_methodologist",
          type: "address",
        },
      ],
      name: "setMethodologist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_methodology",
          type: "string",
        },
      ],
      name: "setMethodology",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_minter",
          type: "address",
        },
      ],
      name: "setMinter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_supplyCeiling",
          type: "uint256",
        },
      ],
      name: "setSupplyCeiling",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "supplyCeiling",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "who",
          type: "address",
        },
      ],
      name: "toggleRestriction",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "unpause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  provider
);

const getTimestamp = async (blockNumber) =>
  (await provider.getBlock(blockNumber)).timestamp;

const withTimestamp = async (blockNumber) => ({
  blockNumber,
  timestamp: await getTimestamp(blockNumber),
});

const getLatestMethodologySetInfo = async (indexToken) => {
  const latestBlock = await provider.getBlock("latest");
  const logs = await provider.getLogs({
    ...indexToken.filters.MethodologySet(),
    fromBlock: latestBlock.number - 1_000_000,
    toBlock: latestBlock.number,
  });
  // TODO replace me with an assert
  if (logs.length === 0) {
    throw new Error("shouldn't happen");
  }
  const blockNumber = logs[logs.length - 1].blockNumber;
  return await withTimestamp(blockNumber);
};

const getFeeChanges = async (indexToken, fromBlock, toBlock) => {
  return await Promise.all(
    (
      await provider.getLogs({
        ...indexToken.filters.FeeRateSet(),
        // TODO test that this won't mess up when they're the same number
        // TODO test we exclude the fee change when
        // it's _before_ the methodology set in the same block
        fromBlock,
        toBlock,
      })
    ).map(async (feeChange) => [
      await getTimestamp(feeChange.blockNumber),
      parseInt(feeChange.topics[1]) / Math.pow(10, 20),
    ])
  );
};

const calcMultiRateInflation = (startTimestamp, startFee, intervals) => {
  let inflation = 1;
  let lastTimestamp = startTimestamp;
  let lastFeeRate = startFee;
  for (const [timestamp, feeRate] of intervals) {
    inflation *= calcInflation(lastFeeRate, lastTimestamp, timestamp);
    lastFeeRate = feeRate;
    lastTimestamp = timestamp;
  }
  return inflation;
};

const calcInflation = (feeRate, fromTimestamp, toTimestamp) => {
  const bigNumResult = bignumber(1)
    .div(bignumber(1).plus(feeRate))
    .pow(
      bignumber(toTimestamp)
        .sub(bignumber(fromTimestamp))
        .div(60 * 60 * 24)
    );
  return number(bigNumResult);
};

const fetchIPFSFromPinata = async (path) => {
  const newPath = path.replace("ipfs://", "");
  const baseURL = "dxas";
  const ipfsUrl = `${baseURL}/${newPath}`;
  const res = await axios.get(ipfsUrl, {
    headers: {
      Accept: "Accept: text/plain",
    },
  });
  return res?.data;
};

const fetchIPFSFromInfura = async (path) => {
  const newPath = path.replace("ipfs://", "");
  const baseURL = "https://amkt.infura-ipfs.io/ipfs";
  const ipfsUrl = `${baseURL}/${newPath}`;

  const res = await axios.get(ipfsUrl, {
    headers: {
      Accept: "Accept: text/plain",
    },
  });
  return res?.data;
};

const fetchIPFS = async (path, pinataFirst = true) => {
  try {
    if (pinataFirst) {
      const data = await fetchIPFSFromPinata(path);
      return data;
    } else {
      const data = await fetchIPFSFromInfura(path);
      return data;
    }
  } catch (error) {
    Logger.log(
      `failed to fetch from ${pinataFirst ? "Pinata" : "Infura"}, trying ${
        pinataFirst ? "Infura" : "Pinata"
      }"}`
    );
    if (pinataFirst) {
      const data = await fetchIPFSFromInfura(path);
      return data;
    } else {
      const data = await fetchIPFSFromPinata(path);
      return data;
    }
  }
};

const fetchMethodology = async () =>
  (
    await fetchIPFS(
      await IndexToken.methodology({
        blockTag: (await provider.getBlock("latest")).number,
      }),
      false
    )
  ).assets;

const getAssetWeights = async () => {
  const input = await getAssetWeightsInput();
  return calcAssetWeights(
    input.feeWhenMethodologySet,
    input.feeChanges,
    input.from,
    input.to,
    input.initialMethodology
  );
};

const calcAssetWeights = (
  feeWhenMethodologySet,
  feeChanges,
  from,
  to,
  initialMethodology
) => {
  const intervals = [
    ...feeChanges,
    // and add the timestamp of the last mint/redeem
    [to.timestamp, NaN],
  ];

  const inflation = calcMultiRateInflation(
    from.timestamp,
    feeWhenMethodologySet,
    intervals
  );

  return Object.fromEntries(
    Object.entries(initialMethodology).map(([symbol, weight]) => [
      symbol,
      weight * inflation,
    ])
  );
};

const getAssetWeightsInput = async () => {
  const indexToken = IndexToken;
  const from = await getLatestMethodologySetInfo(indexToken);
  const latestBlock = await provider.getBlock("latest");

  const to = {
    timestamp: latestBlock.timestamp,
    blockNumber: latestBlock.number,
  };

  // fee at the time the methodology was set
  const feeWhenMethodologySet =
    (await indexToken.feeRatePerDayScaled({
      blockTag: from.blockNumber,
    })) / Math.pow(10, 20);

  // get all intervening fee changes
  const feeChanges = await getFeeChanges(
    indexToken,
    from.blockNumber,
    to.blockNumber
  );
  const initialMethodology = await fetchMethodology();

  return {
    feeWhenMethodologySet,
    feeChanges,
    from,
    to,
    initialMethodology,
  };
};

function sign(str, secret) {
  const hash = CryptoJS.HmacSHA256(str, secret);
  return hash.toString(CryptoJS.enc.Base64);
}

const fetchBalances = async (type) => {
  const primeUrl = "https://api.prime.coinbase.com/v1";
  const url = `${primeUrl}/portfolios/${process.env.PORTFOLIO_ID}/balances?balance_type=${type}_BALANCES`;
  const timestamp = Math.floor(Date.now() / 1000);
  const method = "GET";
  const path = url.replace(primeUrl, "/v1").split("?")[0];
  const message = `${timestamp}${method}${path}`;
  const signature = sign(message, process.env.SIGNING_KEY);
  const headers = {
    "X-CB-ACCESS-KEY": process.env.ACCESS_KEY,
    "X-CB-ACCESS-PASSPHRASE": process.env.PASSPHRASE,
    "X-CB-ACCESS-SIGNATURE": signature,
    "X-CB-ACCESS-TIMESTAMP": timestamp,
    "Content-Type": "application/json",
  };
  const config = {
    url,
    headers,
  };
  const result = await Requester.request(config, {});
  return result;
};

const calcMinCollateral = (tradingBalances, vaultBalances, units) => {
  console.log({
    tradingBalances,
    vaultBalances,
    units,
  });
  let min = Number.MAX_SAFE_INTEGER;
  let balances = {};
  for (let key of Object.keys(units)) {
    for (let i = 0; i < tradingBalances.length; i++) {
      if (tradingBalances[i].symbol.toUpperCase() === key) {
        balances[key] = tradingBalances[i].amount / units[key];
      }
    }
    for (let i = 0; i < vaultBalances.length; i++) {
      if (vaultBalances[i].symbol.toUpperCase() === key) {
        if (Object.keys(balances).includes(key)) {
          balances[key] += vaultBalances[i].amount / units[key];
        } else {
          balances[key] = vaultBalances[i].amount / units[key];
        }
      }
    }
  }
  if (
    Object.keys(balances).sort().join(",") !==
    Object.keys(units).sort().join(",")
  ) {
    throw "Balances not found for all units";
  }
  for (let key of Object.keys(balances)) {
    if (balances[key] < min) {
      min = balances[key];
    }
  }
  return min;
};

const calculateCollateral = async () => {
  const tradingBalances = (await fetchBalances("TRADING")).data.balances;
  const vaultBalances = (await fetchBalances("VAULT")).data.balances;
  const units = await getAssetWeights();
  const collateral = calcMinCollateral(tradingBalances, vaultBalances, units);
  return collateral;
};

const createRequest = async (input, callback) => {
  const validator = new Validator(callback, input, {});
  const jobRunID = validator.validated.id;
  try {
    const collateral = await calculateCollateral();
    const result = Requester.validateResultNumber(collateral, []);
    callback(
      200,
      Requester.success(jobRunID, {
        data: {
          result,
        },
      })
    );
  } catch (err) {
    callback(500, Requester.errored(jobRunID, err));
  }
};
// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data);
  });
};

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false,
    });
  });
};

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest;
