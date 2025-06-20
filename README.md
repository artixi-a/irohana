# IroHana - Color Palette Extractor

A beautiful, fast, and privacy-first web application for extracting dominant colors from any image. Built with React, TypeScript, and Tailwind CSS.

## Live Demo

Visit the live application: [https://artixi-a.github.io/irohana/](https://artixi-a.github.io/irohana/)

## Features

- **Image Upload**: Drag and drop or click to upload images (up to 10MB)
- **Color Extraction**: Advanced algorithm to extract the most dominant colors from any image
- **Interactive Color Picker**: Click anywhere on the image to pick specific colors with magnified preview
- **Instant Copy**: Click any color to copy its hex value to clipboard
- **Dark/Light Theme**: Automatic system theme detection with manual toggle
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Privacy-First**: All processing happens in your browser - no data is sent to servers
- **Modern UI**: Beautiful animations and smooth transitions powered by Framer Motion

## Technology Stack

- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations and transitions
- **Heroicons** for consistent iconography
- **Canvas API** for image processing and color extraction

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/artixi-a/irohana.git
cd irohana
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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run deploy` - Deploy to GitHub Pages

## How It Works

1. **Upload an Image**: Choose an image file or drag and drop it into the upload area
2. **Color Extraction**: The app analyzes the image using advanced color quantization algorithms
3. **View Results**: See the dominant colors displayed as a beautiful palette
4. **Pick Colors**: Use the interactive color picker to select specific colors from the image
5. **Copy Colors**: Click any color to instantly copy its hex value to your clipboard

## Browser Support

IroHana works in all modern browsers that support:
- ES2017+ features
- Canvas API
- File API
- Clipboard API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Color extraction algorithms inspired by modern quantization techniques
- UI/UX design principles from contemporary design systems
- Built with modern web technologies for optimal performance

---

**IroHana** - Extract beautiful colors from any image, instantly and privately.