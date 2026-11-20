// --- Leonida Legend Build/Package Script ---
// This TypeScript script automates the packaging process for distribution.
// It synchronizes the `app/` folder and associated `screenshots/` into a designated
// output directory, and generates a `dossier.json` file crucial for submissions.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Resolve current directory path to ensure reliable file operations
const here = fileURLToPath(new URL('.', import.meta.url));

// Define output directory based on MAKEFUN_OUTPUT_DIR environment variable
// or default to '/output' if not provided
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// --- Preparation Phase ---
// Ensure the output directory structure is ready
mkdirSync(out, { recursive: true });

// Copy essential application files to the distribution directory
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

// Copy project screenshots into the output directory if they are available
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// --- Dossier Generation Phase ---
// Generate the mandatory dossier summary required for submission.
// Configuration constraints:
// - text_max_bytes: Maximum size for summary text content
// - screenshots: Constraints on screenshot quantity and total byte size
// - app_max_files: Maximum allowable files in `app/`
// - app_max_bytes: Maximum cumulative size for `app/` files
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { 
    text_max_bytes: 163840, 
    screenshots: { max: 4, max_bytes: 262144 }, 
    app_max_files: 993, 
    app_max_bytes: 50331648 
  }),
);
