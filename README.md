# JBC Bulk Deposit
A simple script for depositing JBC funds to all validators in the deposit data file.

##  Prerequisite
- Generate a `new private key` for the `hot wallet` and transfer `JBC` to this wallet for the deposit of all validators.
- Generate validator keys and `deposit_data-xxxxxx.json` using `deposit-cli` ([read docs](https://docs.jibchain.net/nodes-and-validators/generate-validator-keys)).

## How to run JBC Bulk deposit:
1. Make an environment file
```sh
make env
```

2. Update `.env` file
```sh
# Replace ${PRIVATE_KEY} with private key
PRIVATE_KEY=${PRIVATE_KEY}
# Update deposit data file path
DEPOSIT_DATA_FILE=./deposit_data-xxxxxx.json
# Gas price for all txs (Gwei)
GAS_PRICE=5 
```

3. Install dependencies
```sh
yarn install
``` 

4. Run verify to pre-check the correctness `deposit data file` and `wallet balance`
```sh
yarn verify
``` 

5. Run deposit
```sh
yarn deposit
``` 