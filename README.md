# WishPool ✦ — Fund Dreams on Stellar

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Stellar](https://img.shields.io/badge/Stellar-Testnet-7D00FF?style=flat-square&logo=stellar)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

WishPool is a decentralized crowdfunding platform built on the **Stellar Testnet**. It allows users to create "Wishes" (crowdfunding campaigns) and receive contributions in XLM. The platform leverages Stellar's speed and low fees to provide a transparent and efficient fundraising experience.

## 🌐 Live Demo
[https://wishpool-stellar.vercel.app](https://wishpool-stellar.vercel.app)

## 🎥 Demo Video
[Watch 1-minute demo](https://youtu.be/PLACEHOLDER)

## 📸 Screenshots
*(Add screenshots here)*

## 📸 Test Output
*(Add screenshot of jest --coverage output here)*

## ✨ Features
- **Wallet Integration**: Seamless connection with the Freighter wallet.
- **Wish Creation**: 3-step intuitive form to launch crowdfunding campaigns with set targets and deadlines.
- **Direct Contributions**: Fund wishes directly using XLM on the Stellar Testnet.
- **Stellar Explorer Integration**: Links to stellar.expert for transparent transaction verification.
- **Live Tracking**: Real-time progress bars and countdown timers for every wish.
- **In-memory Caching**: Fast data retrieval for wish listings using a custom TTL-based cache.
- **Responsive Design**: Premium dark mode UI built with TailwindCSS, optimized for all devices.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Blockchain**: Stellar (Testnet)
- **Wallet**: @stellar/freighter-api
- **Database**: MongoDB Atlas with Mongoose
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **Testing**: Jest & React Testing Library
- **Authentication**: Wallet-based (Stellar Address)

## ⛓️ How Stellar Integration Works
1. **Contributions**: When a user funds a wish, a payment transaction is built using the `@stellar/stellar-sdk` and signed via the **Freighter wallet**.
2. **Escrow**: Funds are sent to a secure escrow account on the Stellar Testnet.
3. **Memo-based Tracking**: Each wish has a unique `stellarMemo` (8-character nanoid). This memo is attached to every contribution transaction, allowing the backend to associate incoming payments with specific wishes via the Stellar Horizon API.
4. **Verification**: The backend verifies the transaction hash on the blockchain before updating the `raisedAmount` in the database, ensuring zero-fraud contributions.

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas Account
- Freighter Wallet Extension

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/wishpool.git
   cd wishpool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env.local` file based on `.env.local.example`.

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🧪 Running Tests
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test -- --coverage
```

## 🗂️ Project Structure
```text
wishpool/
├── src/
│   ├── app/                # Next.js App Router (Pages & APIs)
│   ├── components/         # Reusable UI Components
│   ├── lib/                # Shared Utilities & SDK Logic
│   ├── models/             # Mongoose Database Schemas
│   ├── types/              # TypeScript Interfaces
│   └── globals.css         # Global Styles
├── tests/                  # Jest Test Suites
├── tailwind.config.ts      # Tailwind Configuration
├── tsconfig.json           # TypeScript Configuration
└── jest.config.js          # Jest Configuration
```

## 📄 License
MIT
