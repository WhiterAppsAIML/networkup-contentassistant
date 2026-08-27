import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { marked } from 'marked';

const inputPath = join(process.cwd(), '..', 'BACKEND_STATUS_REPORT.md');
const outputDir = join(process.cwd(), 'docs');
const outputPath = join(outputDir, 'backend-status-report.html');

if (!existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const markdown = readFileSync(inputPath, 'utf-8');

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NetworkUp Content Assistant - Backend Status Report</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6; 
      max-width: 900px; 
      margin: 0 auto; 
      padding: 2rem 1rem; 
      color: #1a1a2e;
      background: #fafafa;
    }
    h1 { color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; margin-top: 2.5rem; }
    h2 { color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; margin-top: 2rem; }
    h3 { color: #334155; margin-top: 1.5rem; }
    h4 { color: #475569; margin-top: 1.2rem; }
    code { 
      background: #f1f5f9; 
      padding: 0.2em 0.4em; 
      border-radius: 4px; 
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.9em;
    }
    pre { 
      background: #0f172a; 
      color: #e2e8f0; 
      padding: 1rem; 
      border-radius: 8px; 
      overflow-x: auto; 
      margin: 1rem 0;
    }
    pre code { background: none; padding: 0; color: inherit; }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 1.5rem 0; 
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    th, td { 
      padding: 0.75rem 1rem; 
      border: 1px solid #e2e8f0; 
      text-align: left; 
    }
    th { 
      background: #1e293b; 
      color: white; 
      font-weight: 600;
    }
    tr:nth-child(even) { background: #f8fafc; }
    tr:hover { background: #f1f5f9; }
    blockquote { 
      border-left: 4px solid #3b82f6; 
      padding-left: 1rem; 
      margin: 1.5rem 0; 
      color: #475569;
      font-style: italic;
      background: #f8fafc;
      padding: 1rem 1.5rem;
      border-radius: 0 8px 8px 0;
    }
    ul, ol { padding-left: 1.5rem; }
    li { margin: 0.4rem 0; }
    a { color: #3b82f6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .header { 
      text-align: center; 
      padding: 2rem 0; 
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 2rem;
    }
    .header h1 { margin: 0; border: none; }
    .header .meta { color: #64748b; margin-top: 0.5rem; }
    .badge { 
      display: inline-block; 
      padding: 0.2rem 0.6rem; 
      border-radius: 9999px; 
      font-size: 0.75rem; 
      font-weight: 600;
      margin-right: 0.5rem;
    }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-red { background: #fee2e2; color: #991b1b; }
    .badge-yellow { background: #fef3c7; color: #92400e; }
    .toc { 
      background: white; 
      padding: 1.5rem; 
      border-radius: 8px; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .toc ul { list-style: none; padding: 0; }
    .toc li { margin: 0.5rem 0; }
    .toc a { color: #334155; }
    .toc a:hover { color: #3b82f6; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 2rem 0; }
    .checklist { list-style: none; padding: 0; }
    .checklist li { padding-left: 1.5rem; position: relative; margin: 0.5rem 0; }
    .checklist li::before { 
      content: '✓'; 
      position: absolute; 
      left: 0; 
      color: #16a34a; 
      font-weight: bold;
    }
    .checklist li.unchecked::before { 
      content: '✗'; 
      color: #dc2626; 
    }
    footer { 
      margin-top: 3rem; 
      padding-top: 1.5rem; 
      border-top: 1px solid #e2e8f0; 
      text-align: center; 
      color: #64748b; 
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>NetworkUp Content Assistant — Backend Status Report</h1>
    <div class="meta">August 2026 · NestJS + MySQL + Qdrant + Gemini AI</div>
  </div>

  <div class="toc">
    <h3>📋 Table of Contents</h3>
    <ul>
      <li><a href="#where-we-are">Where We Are</a></li>
      <li><a href="#whats-working-the-green-list">✅ What's Working</a></li>
      <li><a href="#whats-not-done-the-red-list">❌ What's NOT Done</a></li>
      <li><a href="#architecture-at-a-glance">🧭 Architecture</a></li>
      <li><a href="#database-schema">🗄️ Database Schema</a></li>
      <li><a href="#environment-variables">🔑 Environment Variables</a></li>
      <li><a href="#quick-start-local-dev">🚀 Quick Start</a></li>
      <li><a href="#folder-structure">📂 Folder Structure</a></li>
      <li><a href="#common-tasks">🛠️ Common Tasks</a></li>
      <li><a href="#suggested-next-steps">🎯 Suggested Next Steps</a></li>
      <li><a href="#tldr-for-your-first-week">💬 TL;DR for Your First Week</a></li>
    </ul>
  </div>

  ${marked.parse(markdown)}

  <footer>
    Generated from <code>BACKEND_STATUS_REPORT.md</code> · NetworkUp Content Assistant
  </footer>
</body>
</html>
`;

writeFileSync(outputPath, html);
console.log(`✅ HTML generated at: ${outputPath}`);