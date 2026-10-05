import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { getPageMetadata } from './src/lib/pageMetadata.js'

// Give direct contact visits distinct metadata before JavaScript runs.
function contactSearchMetadata() {
  return {
    name: 'contact-search-metadata',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') return;
      const en = getPageMetadata('/contact', 'en');
      const ar = getPageMetadata('/contact', 'ar');
      const title = 'تواصل معنا | Contact Us - MasarPro مسار برو';
      const description = `${ar.description} ${en.description}`;
      const source = String(index.source)
        .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
        .replace(/(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*("\s*\/?>)/g, `$1${description}$2`)
        .replace(/(<meta\s+(?:name|property)="(?:og:title|twitter:title)"\s+content=")[^"]*("\s*\/?>)/g, `$1${title}$2`)
        .replace('</head>', `    <link rel="canonical" href="${en.canonical}" />\n    <meta property="og:url" content="${en.canonical}" />\n  </head>`);
      this.emitFile({ type: 'asset', fileName: 'contact/index.html', source });
    },
  };
}


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), contactSearchMetadata()],
  server: { proxy: { '/api': 'http://localhost:3001' } },
})
