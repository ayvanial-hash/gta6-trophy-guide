// --- Leonida Legend Build/Package Script ---
// This script prepares the application for distribution by packaging the
// `app/` directory and existing `screenshots/` into an output folder.
// It also generates a `dossier.json` file, which is required for submission.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.mjs';

// Get current directory path
const here = fileURLToPath(new URL('.', import.meta.url));

// Output directory (default to /output or use environment variable)
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// --- Preparation ---
// Ensure output directory exists
mkdirSync(out, { recursive: true });

// Copy application files
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

// Copy screenshots if they exist
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// --- Dossier Generation ---
// Generate the dossier summary used for scoring
// Constraints:
// - text_max_bytes: Limits size of text content
// - screenshots: Limits number and size of screenshots
// - app_max_files: Limits total files in `app/`
// - app_max_bytes: Limits total size of `app/`
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { 
    text_max_bytes: 163840, 
    screenshots: { max: 4, max_bytes: 262144 }, 
    app_max_files: 993, 
    app_max_bytes: 50331648 
  }),
);
