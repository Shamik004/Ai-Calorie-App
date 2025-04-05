# Calorie Tracker AI 🍎

A web application that uses AI to analyze food images and estimate nutritional values with a modern UI.

## Features

- 📷 Upload food photos or capture using camera
- 🤖 AI-powered nutritional analysis
- 🎯 Circular visualizations for protein, carbs, and fats
- 📱 Responsive design
- ⚡ Real-time results

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Shamik004/Ai-Calorie-App.git
```
2. Open `index.html` in a modern browser

## Usage

1. Click "Upload Photo" or "Take Picture"
2. Select/capture food image
3. Wait for AI analysis (5-10 seconds)
4. View nutritional information:
   - Total calories
   - Protein (blue circle)
   - Carbs (green circle)
   - Fats (red circle)

## API Keys Required

1. **ImgBB API Key**:
   - Get from: [https://imgbb.com](https://imgbb.com)
   - Replace in `processImage()` function

2. **Groq API Key**:
   - Get from: [https://groq.com](https://groq.com)
   - Replace in authorization header

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **APIs**: 
  - ImgBB (Image hosting)
  - Groq (AI processing)
- **AI Model**: LLaMA-3.2-90B Vision

## Contributing

Contributions are welcome! Please open an issue first to discuss changes.

## License

[MIT](https://choosealicense.com/licenses/mit/)
