# SAK Platform

A monorepo containing the SAK Dashboard and Sales Tool applications.

## 📁 Project Structure

```
sak-platform/
├── apps/
│   ├── dashboard/          # Main Dashboard CRM application
│   └── sales/              # Sales Tool for reservations
├── packages/
│   └── shared/             # Shared components and utilities (future use)
└── package.json            # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

Run the Dashboard:

```bash
npm run dev
```

Run the Sales Tool:

```bash
npm run dev:sales
```

Run both apps simultaneously:

```bash
npm run dev:all
```

### Building for Production

Build all apps:

```bash
npm run build
```

Build Dashboard only:

```bash
npm run build:dashboard
```

Build Sales Tool only:

```bash
npm run build:sales
```

### Deployment

Deploy Dashboard to GitHub Pages:

```bash
npm run deploy
```

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + HeroUI v3 (beta)
- **State**: Zustand
- **Routing**: React Router v7
- **Animations**: Framer Motion

## 📱 Applications

### Dashboard (@sak/dashboard)

The main CRM dashboard featuring:

- Integration management
- Payment plans
- Reservation requests
- Reports
- Blocking requests

### Sales Tool (@sak/sales)

A standalone sales tool for:

- Unit details viewing
- Creating reservations
- Payment plan builder
- Managing reservations

## 📄 License

Private - All rights reserved.
