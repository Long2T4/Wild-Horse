# Wild Horses 🐎

A static website for the Wild Horses gaming squad featuring a TFT leaderboard, member profiles, and networking concepts documentation.

## Features

- **Home Page**: Hero banner, top 5 snapshot, and member grid
- **Games Page**: List of games (currently TFT)
- **TFT Leaderboard**: Searchable, sorted by tier/division/LP
- **Member Profiles**: Individual pages with stats screenshots
- **Networking Concepts**: Educational page explaining DNS, IP, HTTPS

## Tech Stack

- Pure HTML5, CSS3, JavaScript (no frameworks)
- Responsive design with CSS Grid/Flexbox
- Dark esports theme with accessible contrast
- Works offline (no external dependencies)

## Folder Structure

```
/
├── index.html          # Home page
├── games.html          # Games list
├── tft.html            # TFT Leaderboard
├── member.html         # Member profile (uses ?name= parameter)
├── networking.html     # Networking concepts
├── assets/
│   ├── group.jpg       # Hero banner image
│   └── stats/          # Member stats screenshots
│       ├── default.png # Fallback placeholder
│       ├── yun.png
│       ├── su.png
│       └── ...         # One PNG per member (by slug)
├── styles/
│   └── main.css        # All styles
└── scripts/
    ├── data.js         # Member data and ranking logic
    └── main.js         # Page interactivity
```

## Deployment

### Option 1: Vercel (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Import Project" → Select your repo
4. Keep default settings (Framework: Other, Build: None)
5. Click "Deploy"
6. Your site is live at `https://your-project.vercel.app`

### Option 2: GitHub Pages

1. Push this repo to GitHub
2. Go to repo Settings → Pages
3. Under "Source", select `main` branch and `/ (root)` folder
4. Click "Save"
5. Your site is live at `https://username.github.io/repo-name`

## Local Development

Just open `index.html` in your browser. No server required!

Or use a simple local server:
```bash
# Python 3
python -m http.server 8000

# Node.js (if you have npx)
npx serve
```

## Adding Stats Screenshots

1. Get a screenshot of your TFT stats (from tracker.gg, lolchess.gg, etc.)
2. Save as PNG with the member's slug name (see mapping below)
3. Place in `assets/stats/` folder
4. The member profile page will automatically load it

### Slug Mapping

| Display Name | Filename |
|-------------|----------|
| Su | su.png |
| Yun | yun.png |
| Xệ | xe.png |
| a Tứn | a-tun.png |
| Đại Tá | dai-ta.png |
| Zibi | zibi.png |
| Kua | kua.png |
| Đồng Nai | dong-nai.png |
| Hycan | hycan.png |
| Bun | bun.png |
| Cupid | cupid.png |
| bánh mỳ | banh-my.png |
| Gà | ga.png |

## Updating Rankings

Edit `scripts/data.js` and update the `MEMBERS` array with new tier/division/LP values. The leaderboard will automatically re-sort.

## License

Made for Computer Networking class project.
