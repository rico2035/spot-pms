# Spot - Parking Management System

![Spot PMS Logo](https://img.shields.io/badge/Spot-Parking%20Management-FD593E)
[![Netlify Status](https://api.netlify.com/api/v1/badges/0bfd22/deploy-status)](https://bejewelled-salmiakki-0bfd22.netlify.app)

## 🚗 Live Demo

Check out the live demo: [https://bejewelled-salmiakki-0bfd22.netlify.app](https://bejewelled-salmiakki-0bfd22.netlify.app)

## 📋 Overview

Spot is a comprehensive Parking Management System designed for multi-level parking garages with support for multiple buildings. The system provides real-time monitoring of parking spots, car check-in/out workflows, and detailed analytics for parking facility operators.

## ✨ Features

- **Multi-building Management**: Configure and manage multiple parking facilities
- **Real-time Spot Tracking**: Monitor parking spot status with detailed metadata
- **Car Check-in/out**: Streamlined workflows using license plate tracking
- **Search Functionality**: Quickly find cars by license plate
- **Admin Interfaces**: Manage garage layouts and car operations
- **Dashboard**: Real-time metrics and recent activity visualization
- **RESTful API**: Well-documented API for integrations
- **Responsive Design**: Works on desktop and tablet devices

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **UI Components**: Custom components with Headless UI
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **Charts**: Chart.js with React-Chartjs-2

## 🏗️ Architecture

The application follows a modular architecture with:

- **Contexts**: For state management across components
- **Layouts**: For page structure and navigation
- **Components**: Reusable UI elements
- **Pages**: Main application views
- **Hooks**: Custom React hooks for shared logic

## 📱 Key Modules

1. **Dashboard**: Overview of parking metrics and quick actions
2. **Buildings**: Management of parking facilities
3. **Layout Management**: Configuration of floors, bays, and spots
4. **Car Management**: Check-in, check-out, and search operations
5. **Spot Management**: Real-time monitoring and status updates
6. **API Documentation**: Interactive documentation for the REST API
7. **Reports**: Data visualization and analytics
8. **Settings**: System configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spot-parking-management.git
   cd spot-parking-management
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=your_api_url
```

## 📦 Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## 🧪 Testing

```bash
npm run test
# or
yarn test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎨 UI/UX Design

The application follows a clean, modern design with:

- **Color Palette**: Primary accent color (#FD593E) with neutral tones
- **Typography**: Cairo font family for all text elements
- **Layout**: Clean, spacious grid layout with consistent padding and margins
- **Components**: Card-based UI elements with subtle shadows and rounded corners

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](#license-text) file for details.

## 📞 Contact

For questions, suggestions, or support, contact:

- **Project Lead**: Ric S Kolluri
- **Email**: ricskolluri@gmail.com
- **Developed for**: DAI Companies as a Demo

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Headless UI](https://headlessui.dev/)

---

## License Text

MIT License

Copyright (c) 2025 Ric S Kolluri

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.