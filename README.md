# WishPool ✦ — Fund Dreams on Stellar (Soroban)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Soroban](https://img.shields.io/badge/Soroban-Smart_Contract-7D00FF?style=flat-square&logo=stellar)
![Stellar](https://img.shields.io/badge/Stellar-Testnet-7D00FF?style=flat-square&logo=stellar)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

WishPool is a decentralized crowdfunding platform built on the **Stellar Testnet** using **Soroban Smart Contracts**. It allows users to create "Wishes" (crowdfunding campaigns) and receive contributions in XLM through secure on-chain logic.

## 🌐 Live Demo
[https://wishpool-stellar.vercel.app]((https://wishpool-eight.vercel.app/))

## 🎥 Demo Video
[Watch the 1-minute demo video](./video/demo.mov)

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### Create a Wish
![Create Wish](./screenshots/create.png)

### User Dashboard
![Dashboard](./screenshots/dashboard.png)

## 📸 Test Output
✅ **4 Soroban Contract Tests Passing**
![Test Results](./screenshots/tests.png)

## ✨ Features
- **Soroban Smart Contract**: Core logic (pledge, withdraw, refund) moved to a Rust-based smart contract for maximum security.
- **Wallet Integration**: Seamless connection with the Freighter wallet.
- **Loading States**: Comprehensive use of `LoadingSpinner` and `SkeletonCard` for a premium user experience.
- **Basic Caching**: Optimized API performance with in-memory caching for wish details.
- **Wish Management Dashboard**: A secure hub for creators to track funding and manage payouts.

## ⛓️ Smart Contract (Soroban)
The project includes a Soroban smart contract located in the `contracts/` directory.

### Contract Functions:
- `create_wish`: Initializes a new crowdfunding campaign on-chain.
- `pledge`: Securely records contributions from backers.
- `withdraw`: Allows creators to claim funds only if the goal is met.
- `get_wish`: Retrieves live campaign data directly from the ledger.

## 🗂️ Project Structure
```text
wishpool/
├── contracts/              # Soroban Smart Contract (Rust)
│   ├── src/
│   │   ├── lib.rs          # Contract logic
│   │   └── test.rs         # 4 Unit tests
│   └── Cargo.toml          # Rust configuration
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # UI Components (LoadingSpinner, ProgressBar, etc.)
│   ├── lib/                # Caching & Stellar logic
│   ├── models/             # Database Schemas
│   └── types/              # TypeScript Interfaces
├── tests/                  # Frontend Test Suites
├── screenshots/            # Project Screenshots
└── README.md
```

## 🧪 Running Tests

### Smart Contract Tests
```bash
cd contracts
cargo test
```

### Frontend Tests
```bash
npm test
```

## 🚀 Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   Create a `.env.local` based on `.env.local.example`.

3. **Run development server**
   ```bash
   npm run dev
   ```

## 📄 License
MIT
