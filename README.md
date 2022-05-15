# Solana Fair Trade Coffee dApp
Dapp for Tracking coffee items through the Supply Chain and improving traceability of a coffee bean, from farm to consumer
Coffee items are monitored by their status (harvested, processed, for sale, sold, packed, shipped). User's rights depend on their role (Farmer, Retailer and Consumer).

Coffee Item Status | User
------------------ | ------------------
harvested          | farmer
processed          | farmer
for sale           | retailer
sold               | customer
packed.            | retailer
shipped            | retailer



## Run the client

First, run the development server:
```bash
cd app
```

```bash
yarn & yarn dev
#or
npm install && npm run dev
```

## Generate account key

```bash
yarn run keygen
```
