# CDN Admin Panel Setup Guide

## Overview
The admin panel allows you to manage HQ Feed messages without directly editing JSON files. You can add, edit, and delete news items through a simple web interface.

## Setup Steps

### 1. Add Environment Variables
Edit `.env.local` in your project root with:

```
ADMIN_PASSWORD=your_secure_admin_password_here
GITHUB_TOKEN=your_github_personal_access_token_here
```

### 2. Create GitHub Personal Access Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Set Token name: `cdn-dayz-admin` or similar
4. Select scopes: Check only **`gist`**
5. Generate and copy the token
6. Paste it in `.env.local` as `GITHUB_TOKEN`

### 3. Access the Admin Panel
- Navigate to `http://localhost:3000/admin` (or your production URL + `/admin`)
- Enter your admin password set in `.env.local`
- You'll see the news editor dashboard

## Features

### Add News Items
- **Message**: The announcement text
- **Type**: Choose from Info, Alert, Event, or Update (determines icon color)
- **Date**: Optional date/time label (e.g., "Today", "Sat, 8PM", "Wed 4AM")
- Click "Add News Item" to push the update to GitHub Gist

### Delete News Items
- Click the trash icon on any news item to remove it
- Changes are saved immediately to the Gist

### Live Updates
- The HQ Feed ticker on the homepage refreshes every 60 seconds
- Changes appear within 1 minute on the public site

## Security Notes

⚠️ **Important for Production:**
- In production, use a strong admin password (20+ characters recommended)
- Consider implementing additional layers:
  - IP whitelist
  - Rate limiting
  - Two-factor authentication
  - Proper JWT token validation with expiration

The current implementation uses basic bearer token authentication. For enterprise use, upgrade to proper session management or OAuth.

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `ADMIN_PASSWORD` | Login password for admin panel | `MySecurePass123!` |
| `GITHUB_TOKEN` | GitHub token for Gist updates | `ghp_xxxxxxxxxxxx` |

## Troubleshooting

**"GitHub token not configured"**: 
- Make sure you added `GITHUB_TOKEN` to `.env.local`
- Restart the dev server or redeploy after adding env vars

**"Failed to update news ticker"**:
- Check that your GitHub token has `gist` scope
- Verify the Gist ID is correct (should be in `/api/news-ticker` route)

**"Invalid password"**:
- Double-check the `ADMIN_PASSWORD` in `.env.local`
- Make sure there are no extra spaces or quotes
