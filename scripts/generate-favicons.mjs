import { writeFileSync } from 'fs'

// SVG source
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#FF6B2B"/>
  <path d="M18 4L8 18h8l-2 10 10-14h-8l2-10z" fill="white"/>
</svg>`

// Write SVG versions
writeFileSync('public/favicon.svg', svg)

// For the apple touch icon (180x180 version)
const svgLarge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="40" fill="#FF6B2B"/>
  <path d="M100 20L45 100h45l-10 60 55-80h-45l10-60z" fill="white"/>
</svg>`

writeFileSync('public/apple-touch-icon.svg', svgLarge)

console.log('✓ Favicons written to public/')
