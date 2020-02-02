# Tender Submission Registry
Tender Submission Registry (TSR) is a Blockchain powered (Ethereum DApp) procurement platform for tracing tender document submissions.
TSR is used to Digitally sign tender documents (in zip format) at submission time and Verify authenticity of submissions during tender vetting process.

## Overview
TSR has 3 main use cases:

- Confirm timely submission of required tender documents

Confirm Tender Documents are submitted before bid close datetime. Track 


- Track submission of tender documents

Easily track who submitted a Tender Document pack (ZIP file). Details include Name, Surname and ID of individual of submitted the documents on behalf of the supplier company.


- Confirm authenticity of Tender Document pack (ZIP file).

At the time of vetting/reviewing tender applications and corresponding document packs (ZIP files), TSR can be used to confirm that the ZIP files that the tender issuiing company has on record have not been tampered with post online submission.

## Documentation
- N/A

## Installation (Development Environment)
In order to run TSR, an environment with the following is required:

- Node.js
- Truffle Framework
- Web3.js
- Bootstrap
- MySQL
- MetaMask (MetaMask is an extension for accessing Ethereum enabled distributed applications, or "Dapps" in your browser! The extension injects the Ethereum web3 API into every website's javascript context, so that dapps can read from the blockchain.)

1. Install Truffle globally. Truffle is the most popular smart contract development, testing, and deployment framework. 
```
$npm install -g truffle 
```

2. Install node dependencies.
```
$npm install
```

3. Start Ganache and Create a Workspace (or open an existing one). 

4. Confirm FoodPrint smart contract compiles successfully.
```
$truffle compile
```

5. Run tests for FoodPrint smart contract.
```
$truffe test
$truffle test --network development
```

4. Deploy FoodPrint smart contract to Ganache (assumes Ganache is running).

`truffle migrate` will run all migrations located within your project's migrations directory. If your migrations were previously run successfully, truffle migrate will start execution from the last migration that was run, running only newly created migrations. If no new migrations exists, `truffle migrate` won't perform any action at all. 
```
$truffle migrate
```

The --reset flag will force to run all your migrations scripts again. Compiling if some of the contracts have changed. You have to pay gas for the whole migration again. 
```
$truffle migrate --reset
```

The --all flag will force to recompile all your contracts. Even if they didn't change. It is more time compiling all your contracts, and after that it will have to run all your deploying scripts again.
```
$truffle migrate --compile-all --reset
```

If for some reason truffle fails to acknowledge a contract was modified and will not compile it again, delete the build/ directory. This will force a recompilation of all your contracts and running all your deploy scripts again.

5. Update `truffle-config.js` development network with NetworkID, Host and Port values from your local Blockchain in Ganache.

6. Create a .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE. For example

```
APP_ENV=staging
APP_NAME=custom environment app
DB_HOST=localhost
DB_USER=root
DB_PASS=s1mpl3
```

You can then access the variables in your code using process.env e.g. `console.log(process.env.APP_ENV)`
    
7. Start the web server (Express) and navigate to http://localhost:3000/ in your browser.
```
$npm run dev
```

## Other
1. Access deployed contract from CLI
```
$ truffle console
$ CONTRACTNAME.deployed().then(function(instance) { app = instance })
$ app.CONTRACTFUNCTION()
```

2. Add a new migration
```
$touch 2_deploy_contract.js
```

3. Create infura project  at https://infura.io (Infura gives you access to test network).
This project will give you an ID that you will use in `truffle-config.js`
infura means you do not have to sync an ether node or rinkeby node to deploy directly.

4. Get test ether from https://faucet.rinkeby.io/ (you will need to create an Ethereum rinkeby wallet on MetaMask then use the address on twitter).
e.g. 0x4B67D20a4F27d248aF0462C23F8C193f073517FB

5. Update `truffle-config.js` with rinkeby. This will deploy from the metamask accounts, by default account 0 so specify which one you want.

6. Deploy to rinkeby. 
```
$truffle migrate --network rinkeby --compile-all --reset
```

7. Check contract on rinkeby etherscan https://rinkeby.etherscan.io


## Production Deployment
1. To deploy to a production server, first bundle and uglify then deploy
```
$npm run build
$npm run start
```

## Supported Browsers

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Samsung | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| Supported| Supported| Supported| Supported| Supported| Supported
