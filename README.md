# 🖼️ KaviosPix Frontend

> KaviosPix Frontend is a modern, responsive photo management application built with React. It provides an intuitive interface for organizing photos into albums, managing images, and collaborating with others — delivering a seamless user experience with real-time updates and optimized performance.


![React](https://img.shields.io/badge/React-18+-blue.svg) 
![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg) 
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple.svg) 
![Axios](https://img.shields.io/badge/Axios-0.27.2-lightgrey.svg)
![React Router](https://img.shields.io/badge/React_Router-v6-orange.svg)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.x-green.svg)
![Lucide Icons](https://img.shields.io/badge/Lucide-React-orange.svg)

---
## Demo Link
[Live Demo](https://kavios-pix.vercel.app)

---

## ✨ Features

- **Authentication**: Secure login/register with JWT token management
- **Album Management**: Create, edit, delete, and share albums with multiple users
- **Image Gallery**: Upload single/multiple images with drag-and-drop support
- **Image Operations**: Tag, favorite, comment, and organize photos
- **Trash & Recovery**: Soft delete with 30-day restoration period
- **User Dashboard**: Profile management, storage statistics, and activity tracking
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Instant UI updates after operations
- **Search & Filter**: Advanced filtering by tags, dates, and favorites

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/kavios-pix-frontend.git
cd Kavios_Frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API endpoint

# Run
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview production build
```

## 🛠️ Tech Stack

- **Framework**: React 18 with Hooks
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Context API / Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod / Yup
- **UI Components**: Headless UI / Radix UI
- **Icons**: Lucide React / Heroicons
- **Notifications**: React Hot Toast / Sonner
- **Image Optimization**: React Lazy Load Image

## 📂 Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── context/         # Context providers
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API service functions
│   ├── utils/           # Helper functions
│   ├── assets/          # Images, fonts, icons
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── index.html           # HTML template
```

## 🎨 Key Features

### Authentication
- User registration and login using google OAuth
- Protected routes with authentication guards
- Automatic token refresh
- Persistent sessions

### Album Management
- Create albums with custom names and descriptions
- Share albums via email with multiple users
- View album statistics (image count, storage, favorites)
- Edit and delete albums with confirmation

### Image Gallery
- Upload single or multiple images
- Drag-and-drop interface
- Image preview before upload
- Bulk operations (delete, move, tag)
- Grid and list view options
- Lightbox for full-screen viewing

### User Profile
- Upload and manage profile picture
- View storage usage and statistics
- Activity log with recent actions
- Account deletion with confirmation

### Trash Management
- View deleted items with restoration options
- 30-day retention period indicator
- Restore individual or all items
- Permanent deletion with confirmation
- Empty trash functionality

## 🔒 Security Features

- JWT token storage in HTTP-only cookies
- Protected API routes
- Input sanitization
- CSRF token implementation
- Secure file upload validation

## 📈 Performance Optimizations

- Code splitting with React.lazy
- Image lazy loading
- Debounced search queries
- Memoized components with React.memo
- Virtual scrolling for large galleries
- Optimistic UI updates
- Service worker for offline support

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Smooth animations and transitions
- Loading skeletons
- Error boundaries
- Toast notifications
- Keyboard shortcuts
- Accessibility (ARIA labels, focus management)

## 🤝 API Integration

This frontend connects to the KaviosPix Backend API. Make sure the backend is running and the `VITE_API_URL` is correctly configured.

Backend Repository: [KaviosPix Backend](https://github.com/Jaytun-Kankotiya/Kavios-Backend)

## 📬 Contact

For any questions, suggestions, or feature requests, feel free to reach out:</br>
📧 jaytunkankotiya81@gmail.com</br>
💼 [GitHub Profile](https://github.com/Jaytun-Kankotiya)


