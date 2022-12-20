const axios = require("axios");
const ethers = require("ethers");
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
  const logs = await provider.getLogs({
    ...indexToken.filters.MethodologySet(),
    fromBlock: (await provider.getBlockNumber()) - 1000000,
    toBlock: "latest",
  });
  // TODO replace me with an assert
  if (logs.length === 0) {
    throw new Error("shouldn't happen");
  }
  const blockNumber = logs[logs.length - 1].blockNumber;
  return await withTimestamp(blockNumber);
};

const getLatestMintToFeeReceiverInfo = async (indexToken, fromBlock) => {
  const mintToFeeReceiverLogs = await provider.getLogs({
    ...indexToken.filters.MintFeeToReceiver(),
    fromBlock,
    toBlock: "latest",
  });

  const blockNumber =
    mintToFeeReceiverLogs.length === 0
      ? fromBlock
      : mintToFeeReceiverLogs[mintToFeeReceiverLogs.length - 1].blockNumber;
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

const inflationInterval = (feeRate, fromTimestamp, toTimestamp) =>
  (1 / (1 + feeRate)) ** ((toTimestamp - fromTimestamp) / (60 * 60 * 24));

const calculateInflation = (
  latestMethodologySetTimestamp,
  feeWhenMethodologySet,
  intervals
) => {
  let inflation = 1;
  let lastTimestamp = latestMethodologySetTimestamp;
  let lastFeeRate = feeWhenMethodologySet;
  for (const [timestamp, feeRate] of intervals) {
    inflation *= inflationInterval(lastFeeRate, lastTimestamp, timestamp);
    lastFeeRate = feeRate;
    lastTimestamp = timestamp;
  }
  return inflation;
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

  const inflation = calculateInflation(
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

const readIPFS = async (path) => {
  const newPath = path.replace("ipfs://", "");
  const baseURL = "https://alongside.mypinata.cloud/ipfs";
  const ipfsUrl = `${baseURL}/${newPath}`;

  try {
    const res = await axios.get(ipfsUrl);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const fetchMethodology = async () =>
  (await readIPFS(await IndexToken.methodology())).assets;

const getAssetWeights = async () => {
  const indexToken = IndexToken;
  const from = await getLatestMethodologySetInfo(indexToken);

  const to = await getLatestMintToFeeReceiverInfo(indexToken, from.blockNumber);

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

  return calcAssetWeights(
    feeWhenMethodologySet,
    feeChanges,
    from,
    to,
    await fetchMethodology()
  );
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

// Fetch units adjusted for inflation
const fetchUnits = async () => {
  //
  return new Promise((resolve, reject) => {
    resolve({
      XTZ: 0.102462081734838726473586225204317618145514450160847163249476263,
      FIL: 0.03692594597857479521394050812127810270116471664564530662134463054,
      DOGE: 12.93647516121104989601928832876528132798985695550890070509790667,
      ETC: 0.01540945982100818387927043614325059437202454662562763287126506927,
      APE: 0.03638144608451396202689654782886859188393309571045805037245185893,
      SHIB: 61339.90624442342537006953863655264703930090255694165689458396016,
      DOT: 0.1278349822596167652527034348501670800266227365487120802837174071,
      SOL: 0.04053265881158314258688591521042919021306830835045565666377115903,
      MANA: 0.2091019798878953,
      CHZ: 0.7446659639486283626703438615594107872154077361935964923680610147,
      CRO: 2.866154798260456,
      XLM: 2.921840550368708977041379738824454892767359471849614459030295518,
      ICP: 0.02992663903462281186534275002642706989325105350250727847175295142,
      BCH: 0.002186256565692139287512561668331812196020528256029338220433442484,
      ETH: 0.01302909034192222291772891330056464209298722551659412284732776156,
      ATOM: 0.03124489804031879290041377856110940970001689065237672139048694001,
      QNT: 0.001295748939905592451393104694762050597141409372653423880815405142,
      LTC: 0.007789019552576781125392125988476931372969719886574585399503547705,
      ADA: 3.901817830489415204166343876621118898597533099446492030927913827,
      AVAX: 0.03370097235944921695007583743787906267940360854246307185513725463,
      UNI: 0.08164778829795171199153836711049077337254543261273359644831143271,
      MATIC: 0.9168163895108131448448283328001865555794899888288736786133937051,
      LINK: 0.052381312823562905,
      ALGO: 0.8029551031553515066537927191150343992147321100985276367485834144,
      BTC: 0.002128577644435817063252116750985505670820544199540843988586572224,
    });
  });
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
