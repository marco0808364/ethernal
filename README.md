# Ethernal

> Advanced blockchain explorer and analytics platform for Ethereum and Layer 2 networks

## 🌟 Overview

Ethernal is a comprehensive blockchain explorer and analytics platform that provides deep insights into blockchain data. Built with Vue.js and Node.js, it supports multiple chains including Ethereum, Optimism, Arbitrum, and custom L2 networks. The platform offers real-time transaction tracking, contract analysis, address monitoring, and advanced analytics features.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vue.js 3 with Composition API
- **UI Library**: Vuetify 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Charts**: Chart.js with vue-chartjs
- **Code Editor**: Ace Editor with Solidity support
- **Web3 Integration**: Web3.js, Ethers.js, Wagmi
- **Wallet Support**: Web3-Onboard (MetaMask, WalletConnect, Coinbase, etc.)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Job Queue**: BullMQ with Redis
- **Monitoring**: Sentry
- **Analytics**: PostHog, Datadog
- **Authentication**: JWT, Firebase Auth
- **Payment**: Stripe

### Infrastructure
- **Blockchain Support**: Ethereum, Optimism, Arbitrum, Orbit chains
- **RPC Providers**: Multiple configurable RPC endpoints
- **Caching**: Redis with axios-cache-interceptor
- **WebSocket**: Pusher for real-time updates

## 🚀 Key Features

### Explorer Features
- **Real-time Block Explorer**: Monitor blocks, transactions, and addresses
- **Contract Analysis**: View and interact with smart contracts
- **Transaction Tracing**: Detailed transaction execution analysis
- **Address Analytics**: Token balances, transfer history, and activity tracking
- **NFT Gallery**: ERC-721 and ERC-1155 token visualization
- **Gas Tracker**: Real-time gas price monitoring and optimization

### Advanced Analytics
- **DEX Integration**: Uniswap V2/V3 pool analysis and token pricing
- **Token Transfers**: Comprehensive ERC-20 transfer tracking

### 🧠 Galaxy Brain Features
- **AI-Powered Transaction Analysis**: Machine learning-based transaction pattern detection and risk assessment
- **High-Performance Data Processing**: Parallel processing with Web Workers and intelligent caching for 10,000+ TPS
- **Advanced Security Analysis**: Multi-layered threat detection with real-time intelligence and mitigation recommendations
- **Real-time Analytics**: Interactive dashboards with live performance monitoring and predictive insights
- **Enterprise-Grade Security**: Sophisticated algorithms for detecting reentrancy, front-running, and flash-loan attacks
- **Internal Transactions**: Contract-to-contract interaction analysis
- **Event Monitoring**: Custom event filtering and notifications
- **Performance Metrics**: Transaction success rates and timing analysis

### Enterprise Features
- **Multi-Workspace Support**: Isolated environments for different teams
- **Custom Branding**: White-label explorer solutions
- **API Access**: RESTful API for programmatic access
- **Webhooks**: Real-time notifications for important events
- **Rate Limiting**: Configurable API usage limits
- **Data Retention**: Configurable data retention policies

## 📊 Project Structure

```
ethernal/
├── src/                    # Vue.js frontend
│   ├── components/         # Vue components
│   ├── stores/            # Pinia state stores
│   ├── lib/               # Utility functions
│   ├── plugins/           # Vue plugins
│   └── styles/            # SCSS styles
├── run/                   # Node.js backend
│   ├── api/               # Express API routes
│   ├── models/            # Sequelize models
│   ├── migrations/       # Database migrations
│   ├── jobs/              # Background jobs
│   └── lib/               # Backend utilities
├── blog/                  # Astro blog
├── tests/                 # Test suites
└── docs/                  # Documentation
```

## 🎯 Supported Networks

### Layer 1
- **Ethereum Mainnet**
- **Ethereum Testnets** (Sepolia, Goerli, etc.)

### Layer 2
- **Optimism**
- **Arbitrum One**
- **Arbitrum Orbit** (custom L2 solutions)
- **Custom L2 Networks** (configurable)

## 🔧 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/marco0808364/ethernal.git
   cd ethernal
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd src
   npm install
   
   # Backend
   cd ../run
   npm install
   
   # Blog
   cd ../blog
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   cd run
   npm run migrate
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # Frontend
   cd src
   npm run dev
   
   # Backend
   cd ../run
   npm start
   ```

## 🚀 Deployment

### Production Build
```bash
# Frontend build
cd src
npm run build

# Backend start
cd ../run
npm start
```

### Docker Support
```bash
docker-compose up -d
```

## 📈 API Documentation

The platform provides a comprehensive REST API for programmatic access:

- `GET /api/blocks` - Get blocks with pagination
- `GET /api/transactions` - Get transactions with filters
- `GET /api/addresses/:address` - Get address details
- `GET /api/contracts/:address` - Get contract information
- `GET /api/tokens` - Get token information
- `POST /api/webhooks` - Set up webhook notifications

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Website**: https://ethernal.app
- **Documentation**: https://docs.ethernal.app
- **GitHub Issues**: https://github.com/marco0808364/ethernal/issues
- **Discord**: https://discord.gg/ethernal

## 🙏 Acknowledgments

- Built with Vue.js, Vuetify, and Node.js
- Blockchain data powered by various RPC providers
- UI components inspired by modern design systems

---

*Built with ❤️ for the blockchain community*