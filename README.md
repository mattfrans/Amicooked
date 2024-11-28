# AmiCooked

AmiCooked is a modern, anonymous social media platform inspired by imageboards. Users can create threads, share images, and engage in discussions while maintaining anonymity through randomly generated user tags.

## Features

- 📝 Create anonymous posts with optional custom user tags
- 🖼️ Support for image uploads (JPG/PNG, up to 5 images per post)
- 💬 Threaded comments on posts
- 🔥 Vote on posts (Cooked/GMI)
- 📊 Multiple view modes:
  - List view for detailed reading
  - Catalog view for browsing
- 🔄 Sort posts by:
  - Newest
  - Top Cooked
  - Top GMI
  - Trending
- ⏰ Timestamp tracking for all posts and comments

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/amicooked.git
cd amicooked
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (for icons)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
