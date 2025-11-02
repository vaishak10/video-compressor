# 🎥 Video Compressor

A modern, user-friendly video compression application built with Vue.js that allows users to compress videos directly in their browser. The application includes a smart compression limit system that restricts users to 3 compressions per file to prevent excessive processing.

## ✨ Features

- **🎬 Drag & Drop Interface**: Easily upload videos by dragging and dropping files
- **📊 Adjustable Quality**: Control compression quality with a slider (10% - 100%)
- **👀 Real-time Preview**: View both original and compressed videos side-by-side
- **📥 One-Click Download**: Download compressed videos instantly
- **🔒 Compression Limit**: Smart tracking system limits each file to 3 compressions
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Beautiful gradient design with smooth animations

## 🛠️ Tech Stack

- **Framework**: [Vue.js 3](https://vuejs.org/) - Progressive JavaScript Framework
- **Build Tool**: [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- **Video Processing**: HTML5 Canvas & MediaRecorder API for client-side video compression
- **Styling**: CSS3 with modern features (Grid, Flexbox, CSS Variables)
- **Module System**: ES Modules

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v7 or higher) or [yarn](https://yarnpkg.com/)

## 🚀 Getting Started

### Installation

1. Clone or download this repository:
```bash
cd video-compressor
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`

### Production Build

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📖 How to Use

1. **Upload a Video**: 
   - Drag and drop a video file onto the drop zone, or
   - Click "Browse Files" to select a video from your computer

2. **Adjust Compression Settings**:
   - Use the quality slider to set your desired compression level
   - Lower quality = smaller file size
   - Higher quality = better video quality but larger file size

3. **Compress the Video**:
   - Click the "Compress Video" button
   - Wait for the compression process to complete
   - View the progress bar for real-time status

4. **Preview and Download**:
   - Compare original and compressed videos side-by-side
   - See the file size reduction percentage
   - Click "Download Compressed Video" to save the compressed file

5. **Compression Limit**:
   - Each file can be compressed up to 3 times
   - After 3 compressions, you'll need to select a different file
   - This prevents excessive processing and ensures optimal performance

## 🎯 Supported Video Formats

- MP4
- WebM
- AVI
- MOV
- And most other common video formats

**Note**: Compressed videos are output in WebM format for optimal compression and browser compatibility.

## 🌐 Browser Compatibility

This application works best in modern browsers that support:
- HTML5 Video API
- MediaRecorder API
- Canvas API
- ES6+ JavaScript

Recommended browsers:
- Chrome/Edge (v85+)
- Firefox (v78+)
- Safari (v14+)

## 📁 Project Structure

```
video-compressor/
├── public/              # Static assets
├── src/
│   ├── components/      # Vue components
│   │   └── VideoCompressor.vue
│   ├── App.vue          # Main application component
│   ├── main.js          # Application entry point
│   └── style.css        # Global styles
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
└── README.md            # Project documentation
```

## 🔧 Configuration

You can customize the Vite configuration in `vite.config.js`:
- Change the development server port
- Add plugins
- Configure build options
- Set up aliases

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Vue.js](https://vuejs.org/)
- Powered by [Vite](https://vitejs.dev/)
- Icons from SVG paths

## 📮 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Enjoy compressing your videos! 🎬✨**

