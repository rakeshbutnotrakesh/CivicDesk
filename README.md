# CivicDesk – Local Issue Management System

CivicDesk is an offline-capable, local community issue management web application designed to help neighborhood coordinators, resident welfare associations, and active citizens record, organize, track, and resolve local civic problems.

## 🌟 Problems Handled
- Damaged roads & potholes
- Water supply disruptions & pipe leaks
- Broken streetlights & dark corridors
- Garbage accumulation & sanitation issues
- Drainage & stormwater clogging
- Public safety hazards & damaged guardrails
- Other local neighborhood maintenance problems

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📦 Pushing Directly to GitHub

### Option A: Standard Git Push
To push this entire project to your GitHub repository:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "Initial commit: CivicDesk Local Issue Management System"

# 4. Set main branch
git branch -M main

# 5. Connect to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/civicdesk.git

# 6. Push to GitHub
git push -u origin main
```

---

### Option B: Using the `civicdesk-repository.json` File
The root of this project includes `civicdesk-repository.json` — a complete JSON bundle of all codebase source files, styles, configs, and components.

#### To Unpack into Any New Folder:
1. Copy `civicdesk-repository.json` and `unpack.js` into your new folder.
2. Run:
   ```bash
   node unpack.js
   ```
3. Run `npm install && npm run dev`.

#### To Re-bundle after making changes:
```bash
npm run bundle
```

---

## 🔒 100% Privacy & Local Storage
- **Zero External Server Reliance**: Runs 100% client-side in React + TypeScript + Tailwind CSS.
- **Persistent LocalStorage**: All records, categories, priorities, field notes, and timelines are stored securely in browser LocalStorage.
- **Browser File API**: Photo evidence is processed and stored locally via FileReader data URLs.
- **Export & Backup**: Full database backups can be downloaded as JSON or CSV anytime from the Settings and Reports pages.

---

## 📄 License
Apache-2.0
