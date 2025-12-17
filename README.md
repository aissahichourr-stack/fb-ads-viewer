# 👁️ Facebook Ads Spy Viewer

**A powerful web application to browse and search competitor ads from Facebook's Ad Library with automated daily updates.**

## 📋 Features

✅ **Browse Competitor Ads** - View ads from your competitors directly from Facebook Ad Library
✅ **Full-Text Search** - Search ads by keywords or page names in real-time
✅ **Country Filtering** - Filter ads by country (extensible)
✅ **Automated Updates** - GitHub Actions runs daily to fetch latest ads from Apify
✅ **XSS Protected** - HTML escaping to prevent injection attacks
✅ **Error Handling** - Comprehensive error handling and validation
✅ **Deployed on GitHub Pages** - Free hosting with automatic deployments

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Apify account with API token
- GitHub account

### Installation

```bash
# Clone the repository
git clone https://github.com/aissahichourr-stack/fb-ads-viewer.git
cd fb-ads-viewer

# Install dependencies
npm install
```

### Local Development

1. Create an `ads.json` file in the root directory with sample data:
```json
[
  {
    "pageName": "Example Page",
    "adBody": "Your ad text here",
    "adSnapshotUrl": "https://facebook.com/ads/library/...",
    "startDate": "2025-01-01T00:00:00Z",
    "publisherPlatforms": ["Facebook", "Instagram"]
  }
]
```

2. Open `index.html` in your browser or use a local server:
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

## 🔧 Configuration

### Setting up GitHub Actions

1. Go to repository Settings → Secrets and variables → Actions
2. Add `APIFY_TOKEN` secret with your Apify API token
3. The workflow will run automatically at 8 AM UTC daily

Or trigger manually:
- Go to Actions tab
- Select "Update Ads Daily"
- Click "Run workflow"

### Customizing the Apify Script

Edit `update_script.js` to:
- Change the `actorId` to your Apify Actor
- Modify the `startUrls` and `resultsLimit`
- Adjust input parameters for your needs

## 📁 Project Structure

```
fb-ads-viewer/
├── index.html                  # Main webpage
├── script.js                   # Frontend logic with XSS protection
├── ads.json                    # Ads database (auto-updated)
├── package.json                # Node.js configuration
├── update_script.js            # Apify integration script
└── .github/
    └── workflows/
        └── update_ads.yml      # GitHub Actions workflow
```

## 🐛 Fixes Applied

### Version 2.0 (Latest)

✅ **Fixed XSS Vulnerability** - Added `escapeHtml()` function to sanitize all user-facing content
✅ **Improved Error Handling** - Try-catch blocks with detailed error messages
✅ **String Conversion** - Ensured all data is converted to string before processing
✅ **Null Safety** - Proper null checks for array operations
✅ **Text Truncation** - Smart truncation that doesn't add ellipsis to short text
✅ **Workflow Improvements** - Added Node.js setup, validation steps, and failure notifications
✅ **Environment Validation** - Check for APIFY_TOKEN before execution

### What Was Fixed

| Issue | Before | After |
|-------|--------|-------|
| XSS Attacks | No protection | HTML escaping implemented |
| Missing Data | Crashes | Proper null/undefined handling |
| Text Truncation | Always adds "..." | Smart truncation logic |
| Workflow Errors | Silent failures | Detailed error reporting |
| APIFY_TOKEN | Not validated | Pre-execution validation |

## 📊 Usage

### Viewing Ads
- Open the app in your browser
- Browse loaded ads in the grid
- Click "👁 مشاهدة الإعلان الأصلي" to view on Facebook

### Searching
- Type in the search box to filter by ad content or page name
- Results update in real-time
- Clear the search to see all ads

### Filtering
- Use the country dropdown to filter by region (future enhancement)

## 🔐 Security

- **XSS Protection**: All HTML characters are escaped
- **No Sensitive Data**: Tokens stored only in GitHub Secrets
- **Input Validation**: All inputs validated before processing
- **Error Logging**: Detailed logs for debugging without exposing sensitive info

## 📝 Tech Stack

- **Frontend**: HTML, CSS (Tailwind), JavaScript (Vanilla)
- **Backend**: Node.js, Apify Client
- **Hosting**: GitHub Pages + GitHub Actions
- **Language Support**: Arabic & English

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - Feel free to use this project for your business.

## ⚠️ Disclaimer

This tool is for competitive research and educational purposes only. Ensure you comply with Facebook's Terms of Service and local regulations when using this tool.

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review the error logs in GitHub Actions

---

**Made with ❤️ for e-commerce entrepreneurs in Africa**
