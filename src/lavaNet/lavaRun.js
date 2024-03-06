const fs = require('fs');
const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const ethers = require('ethers');
const path = require('path');
const createObjectCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');

const walletCSVPath = path.join(__dirname, `./wallet.csv`)


async function createWalletcsv() {
    let data = Array(10).fill('_').map((_, index) => {
        const wallet = ethers.Wallet.createRandom()
        const { privateKey, address } = wallet
        return {
            index: index,
            privateKey: privateKey,
            address: address
        }
    })

    let csvWriter = createObjectCsvWriter({
        path: walletCSVPath,
        header: [
            { id: 'index', title: 'INDEX' },
            { id: 'privateKey', title: 'PRIVATE KEY' },
            { id: 'address', title: 'PUBLIC KEY' },
        ],
    });

    csvWriter.writeRecords(data)
        .then(() => {
            console.log('...Done');
        });
}

async function main() {
    // createWalletcsv()

    // const config = await fs.readFile('../../config/runner.json', 'utf8').then(JSON.parse);
    // const walletcsv = await fs.readFile(walletCSVPath, 'utf8')
    // const addresses = walletcsv.split('\n').filter(line => line);
    // const addresses = []

    // fs.createReadStream(walletCSVPath)
    //     .pipe(csv())
    //     .on('data', (row) => {
    //         addresses.push(row['PUBLIC KEY']);
    //     })
    //     .on('end', () => {
    //         console.log('地址读取完毕');
    //         // resolve(addresses);

    //         setTimeout(() => {
    //             readFromAddress(addresses)
    //         }, 2500)
    //     })

    readFromAddress()
}

async function readFromAddress() {
    const addresses = Array(20).fill('_').map(e => ethers.Wallet.createRandom().address)
    let rpcUrls = fs.readFileSync(path.join(__dirname, './rpc.json'), { encoding: 'utf8' })
    rpcUrls = JSON.parse(rpcUrls)
    const shuffledAddresses = shuffleArray(addresses);

    for (let i = 1; i < shuffledAddresses.length; i++) {
        const address = shuffledAddresses[i].split(',')[0].trim();
        if (!address) continue;

        const rpcUrl = rpcUrls[Math.floor(Math.random() * rpcUrls.length)];
        try {
            const result = await checkBalanceAndAppend(address, rpcUrl/* , config.proxy */);
            console.log(i, result);
        } catch (error) {
            console.error(`Error fetching balance for address ${address}: ${error.message}`);
        }
    }
}

async function fetchWithProxy(url, body, proxyUrl) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    // const agent = new HttpsProxyAgent(proxyUrl);
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        // agent,
        signal: controller.signal
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function checkBalanceAndAppend(address, rpcUrl, proxyUrl) {
    console.log(`Using RPC: ${rpcUrl}`);
    const jsonRpcPayload = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
    };

    const response = await fetchWithProxy(rpcUrl, jsonRpcPayload, proxyUrl);
    if (response.error) {
        throw new Error(response.error.message);
    }

    const balance = ethers.utils.formatUnits(response.result, 'ether');
    return `Address: ${address} - Balance: ${balance} ETH`;
}

function shuffleArray(array) {
    return array.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

main().catch(console.error);
