# Vibecheck - Frontend

![Vibecheck Preview](https://via.placeholder.com/1200x600?text=Vibecheck+Itinerary+Planner) 

Welcome to the frontend repository of **Vibecheck**, a modern, intuitive, and dynamic travel itinerary planner. Vibecheck allows users to discover, create, and share travel itineraries that perfectly match their desired "vibe".

## 🚀 Features

- **Discover Itineraries:** Browse and search through a curated list of travel itineraries tailored to different vibes and destinations.
- **Custom Itinerary Creation:** An interactive builder to plan your trips day-by-day, including locations, activities, and notes.
- **User Dashboard:** Manage your created and saved itineraries from a centralized dashboard.
- **Responsive Design:** A beautiful, mobile-first design built with Material UI that looks great on all screen sizes.
- **Authentication:** Secure user authentication (Login/Signup) to save personal preferences and itineraries.
- **Modern UI/UX:** Smooth animations, rich color palettes, and interactive elements for a premium user experience.

## 🛠️ Technology Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **UI Library:** [Material UI (MUI) v9](https://mui.com/)
- **Styling:** Emotion, standard CSS (`App.css`, `index.css`)
- **State Management:** React Context API

## 📂 Folder Structure

```text
frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components (Navbar, Cards, etc.)
│   ├── context/          # React Context providers (AppContext)
│   ├── data/             # Mock data or constant variables
│   ├── pages/            # Application pages (Home, Search, Dashboard, etc.)
│   ├── App.jsx           # Main application shell and routing
│   ├── main.jsx          # Entry point
│   └── theme.js          # Material UI custom theme configuration
├── eslint.config.js      # ESLint configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/your-username/vibecheck.git
   cd vibecheck/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

### Running the Application

To start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

### Building for Production

To create a production-ready build:

```bash
npm run build
```
This will generate a `dist/` folder containing the optimized assets.

To preview the production build locally:

```bash
npm run preview
```

## 🧹 Code Quality

This project uses ESLint for code quality and consistency. To run the linter:

```bash
npm run lint
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
