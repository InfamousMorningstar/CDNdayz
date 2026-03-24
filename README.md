# CDN DayZ - Official Website (BETA)

> **⚠️ WORK IN PROGRESS / BETA**  
> This website is currently in **BETA**. It is not a finished product.  
> This project is being actively developed to serve as the companion web portal for the **CDN DayZ Discord Community**. Features, designs, and content are subject to change.

## 🔗 Repository
[https://github.com/InfamousMorningstar/CDNdayz](https://github.com/InfamousMorningstar/CDNdayz)

## 📋 Overview
This generic web portal is designed to provide players with real-time information and resources for the CDN DayZ servers.

### Key Features

#### 🌐 Core Experience
-   **Live Server Monitoring**: Real-time Gamedig integration displaying status (Online/Offline), player counts, and map details for all CDN servers.
-   **Quick Intel Dashboard**: Centralized homepage hub providing immediate access to critical server rules, upcoming events, and the donation store.
-   **Official DayZ News Feed**: Automated integration with Steam Community announcements, delivering real-time game updates, patch notes, and official status reports directly to the dashboard.
-   **Immersive Cinematic UI**: Dynamic, page-specific video and high-resolution image backgrounds creating a tactical, atmospheric user experience.

#### 📜 Rules & Governance
-   **Comprehensive Rules Hub**: Multi-tab interface clearly separating **General Conduct** from **Discord Etiquette**.
-   **Base Building Regulations**: Dedicated section detailing building tiers, raid schedules, territory radiuses, and prohibited zones.
-   **Ticket System Integration**: Direct guidance linking users to the `#support` channel for effective issue resolution.

#### 🎮 Gameplay & Events
-   **Event Scheduling**: Tracking for both automated daily events (Convoys, Keycard Bunkers) and staff-hosted special events (Weekend Boss Fights).
-   **New Player Guide**: Step-by-step "Join the Operation" workflow simplifying modpack installation and server connection.
-   **Survival Manual**: Beginner-friendly breakdown of server mechanics, economy, and starting strategies.

#### 💰 Store & Support
-   **Donation Transparency**: Clear breakdown of donor perks (Priority Queue, Custom Bases, Loadout Kits).
-   **Wipe Protection Policy**: Explicit explanation of the "Roll Over" policy for donations made prior to server wipes.
-   **Payment Flexibility**: Information on supported payment methods (PayPal F&F, CashApp, etc.) via the ticket system.

#### ⚙️ Technical Highlights
-   **Performance Optimized**: Server-side caching for external APIs (Steam News) to ensure fast load times.
-   **Mobile-First Design**: Fully responsive layout optimized for access on phones and tablets.
-   **Real-time Data Fetching**: Auto-refreshing server status components.

## 🛠️ Tech Stack
-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom "Tactical/Apocalyptic" theme.
-   **Fonts**: Rajdhani (Headings), Inter (Body), JetBrains Mono (Data).
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Server Query**: [Gamedig](https://github.com/gamedig/node-gamedig)

## 🚀 Getting Started

### Prerequisites
-   Node.js 18.17 or later
-   npm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/InfamousMorningstar/CDNdayz.git
    cd CDNdayz
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the site**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing
Contributions are welcome! If you find a bug or have a suggestion, please open an issue or submit a pull request on the GitHub repository.

---
*Built for the CDN DayZ Community.*
