# My Totally Rad Review Site! 🌟

A 90s-style review website built with React, featuring a nostalgic design with Comic Sans MS font, bright colors, and retro styling.

## Features

- 📚 Book reviews
- 🎮 Game reviews  
- 🎬 Film reviews
- 🌈 Filterable content by category
- ✨ 90s-style animations and design
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
geocities/
├── public/
│   └── index.html          # HTML entry point
├── App.jsx                 # Main React component
├── index.js               # React entry point
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Technologies Used

- React 18
- React Hooks (useState, useEffect)
- CSS-in-JS styling
- Modern JavaScript (ES6+)

## Customization

To add new reviews, modify the `sampleReviews` string in `App.jsx`. The format is:

```markdown
# Review Title
**Type:** Category (Film/Game/Book)
**Rating:** ★★★★★

Your review text here...
```

## License

This project is open source and available under the [MIT License](LICENSE). 