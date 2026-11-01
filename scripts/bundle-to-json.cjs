const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const includeFiles = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'index.html',
  'metadata.json',
  '.env.example',
  '.gitignore',
  '.npmrc',
  'vercel.json',
  'README.md',
  'src/main.tsx',
  'src/index.css',
  'src/App.tsx',
  'src/types/index.ts',
  'src/utils/storage.ts',
  'src/utils/helpers.ts',
  'src/components/Charts.tsx',
  'src/components/ConfirmModal.tsx',
  'src/components/IssueDetailModal.tsx',
  'src/components/ReportIssueForm.tsx',
  'src/components/DashboardView.tsx',
  'src/components/IssueManagementPage.tsx',
  'src/components/ComplaintTrackingPage.tsx',
  'src/components/ReportsPage.tsx',
  'src/components/SettingsPage.tsx',
  'src/components/Sidebar.tsx',
  'src/components/TopBar.tsx',
  'src/components/Toast.tsx',
];

const filesData = {};

for (const relPath of includeFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    filesData[relPath] = content;
  }
}

const bundle = {
  name: 'civicdesk',
  description: 'CivicDesk – Local Issue Management System',
  version: '1.0.0',
  exportedAt: new Date().toISOString(),
  filesCount: Object.keys(filesData).length,
  files: filesData,
  instructions: {
    unpackWithNode: 'node unpack.js',
    pushToGitHubWithApi: 'Run the provided github-push script or unpack and git push',
  },
};

const outputPath = path.join(rootDir, 'civicdesk-repository.json');
fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2), 'utf8');
console.log(`Successfully created ${outputPath} with ${Object.keys(filesData).length} files.`);
