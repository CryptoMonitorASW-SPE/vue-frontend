
Vue Frontend
====================

This project implements the frontend interface for the CryptoMonitor platform using Vue.js. The application offers comprehensive cryptocurrency monitoring capabilities for both visitors and registered users. Non-authenticated users can access real-time market data and price trends, while registered users gain access to personalized features including customizable watchlists, price alert notifications, and portfolio management.

Table of Contents
-----------------

-   [Features](#features)
-   [Architecture](#architecture)
-   [Getting Started](#getting-started)
-   [Building the Project](#building-the-project)
-   [Running the Application](#running-the-application)
-   [CI/CD](#cicd)
    -   [Automatic Releases](#automatic-releases)
    -   [CI/CD for Docker](#cicd-for-docker)
    -   [Code Quality](#code-quality)
-   [Code Quality](#code-quality)
    -   [ESLint](#eslint)
    -   [Commitlint](#commitlint)
-   [License](#license)

Features
--------

-   **Public Market Data Access**: Non-authenticated users can view real-time cryptocurrency market data and price trends.
-   **User Authentication**: Comprehensive login and registration functionality with secure JWT implementation.
-   **Cryptocurrency Monitoring**: Real-time price updates for cryptocurrencies with detailed market information.
-   **Personalized Watchlist**: Registered users can create and manage custom cryptocurrency watchlists.
-   **Alert Management**: Create, update, and delete price threshold alerts with customizable notification settings.
-   **Portfolio Management**: Track investments through an interactive wallet interface with performance metrics.
-   **Data Visualization**: Interactive charts and graphs providing historical data and trend analysis.
-   **Reporting Tools**: Generate and download detailed PDF reports for financial analysis and record-keeping.
-   **Responsive Design**: Fully responsive interface optimized for desktop, tablet, and mobile devices.
-   **Real-time Notifications**: Receive instant alerts when price thresholds are met via the integrated notification system.

Architecture
------------

The project is a Vue.js application built with Vite. It follows a Single Page Application architecture pattern and communicates with multiple backend microservices through RESTful APIs and WebSockets.

### Frontend Technologies

- **Vue.js 3**: Progressive JavaScript framework for building user interfaces
- **Vite**: Next-generation frontend build tool that significantly improves development experience
- **Pinia**: State management library for Vue applications
- **Vue Router**: Official router for Vue.js applications
- **Axios**: Promise-based HTTP client for API requests
- **Socket.io-client**: Library for real-time bidirectional event-based communication
- **ApexCharts**: Modern charting library for interactive data visualizations
- **Bootstrap**: Responsive CSS framework for consistent UI components
- **SCSS**

### Backend Microservices

The frontend communicates with the following backend microservices:

- **[CryptoMarket Service](https://github.com/CryptoMonitorASW-SPE/crypto-market)**: Provides cryptocurrency market data, price updates, and historical information
- **[User Management Service](https://github.com/CryptoMonitorASW-SPE/user-management)**: Handles user profiles, preferences, and personalized settings
- **[Event Dispatcher Service](https://github.com/CryptoMonitorASW-SPE/event-dispatcher)**: Manages real-time event handling and communication between services
- **[Notification Service](https://github.com/CryptoMonitorASW-SPE/notification)**: Processes price alerts and delivers notifications to users

Getting Started
---------------


### Clone the Repository

```bash
git clone https://github.com/CryptoMonitorASW-SPE/vue-frontend.git
cd vue-frontend
```

Building the Project
--------------------

### Using npm directly

```bash
cd app
npm install
npm run build
```

### Using Gradle wrapper

The project includes Gradle tasks to manage the build process:

```bash
# Build the application
./gradlew buildVite

# Clean and build
./gradlew cleanBuild buildVite
```

This will compile the Vue.js application and generate static files in the `app/dist` directory.

Running the Application
-----------------------

### Development Mode

#### Using npm

```bash
cd app
npm run dev
```

#### Using Gradle

```bash
./gradlew runFrontend
```

The development server will start on port 8080 with hot reloading enabled.


### Production Preview

```bash
cd app
npm run preview
```

This starts a local preview of the production build.


CI/CD
-----------------------

### Automatic Releases

When a push is made to the main branch, an automatic release process is triggered using semantic-release. If a new version is detected based on commit messages, a new release is created.

### CI/CD for Docker

The CI/CD pipeline ensures that every release includes an updated Docker image. When a new release is created:

- A Docker image is built
- The image is pushed to GitHub Container Registry (GHCR)
- The latest tag is updated

### Code Quality

For each pull request, the following checks are performed:

- **ESLint**: JavaScript and Vue code is analyzed for potential errors and style issues

Code Quality
-----------------------

### ESLint

The project uses [ESLint](https://eslint.org/) for JavaScript and Vue code linting, configured in eslint.config.mjs. This ensures consistent code style and helps catch potential issues early in development.

### Commitlint

[Commitlint](https://commitlint.js.org/) is configured to enforce commit message conventions.\
It ensures that all commits follow a standardized format, improving readability and maintainability.

License
-----------------------

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)