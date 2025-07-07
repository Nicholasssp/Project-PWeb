const fs = require('fs');
const path = require('path');

// Function to convert SVG to base64
function svgToBase64(svg) {
  return Buffer.from(svg).toString('base64');
}

// Function to create base64 data URL
function createBase64DataUrl(base64, color = null) {
  const svg = Buffer.from(base64, 'base64').toString('utf-8');
  const coloredSvg = color ? svg.replace(/<path/g, `<path fill="${color}"`) : svg;
  const coloredBase64 = Buffer.from(coloredSvg).toString('base64');
  return `data:image/svg+xml;base64,${coloredBase64}`;
}

// Map of FontAwesome class names to their corresponding SVG paths
const iconMap = {
  'fa-star': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18.7c-5.3-11-16.5-18.7-28.9-18.7s-23.6 7.7-28.9 18.7L214.1 119c-3.2 6.6-9.4 11.2-16.6 12.2l-111.7 16.2c-11.7 1.7-21 9.9-23.9 21.2s-.2 23.2 8.9 31.3l80.9 78.9c.5 2.9.8 5.9.8 8.9s-.3 6-.8 8.9L118.7 422.1c-1.7 11.7 2.8 23.5 11.7 30.6s21.3 8.4 31.8 2.8l99.9-52.6c2.6-1.4 5.5-2.1 8.4-2.1s5.8.7 8.4 2.1l99.9 52.6c10.5 5.6 22.9 4.3 31.8-2.8s13.4-18.9 11.7-30.6L382.6 297.3c-.5-2.9-.8-5.9-.8-8.9s0.3-6 0.8-8.9l80.9-78.9c9.1-8.1 11.8-20 8.9-31.3s-12.2-19.5-23.9-21.2l-111.7-16.2c-7.2-1-13.4-5.6-16.6-12.2L316.9 18.7z"/></svg>',
  'fa-heart': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 125.1c-51.4 51.4-51.4 134.8 0 186.3L256 520l208.4-208.6c51.4-51.4 51.4-134.8 0-186.3s-134.8-51.4-186.3 0L256 147.3l-22.1-22.2C182.4 73.7 99 73.7 47.6 125.1z"/></svg>',
  'fa-comment': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V32C0 14.3 14.3 0 32 0h448c17.7 0 32 14.3 32 32v32zM0 160v288c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V160H0z"/></svg>',
  'fa-map-marker-alt': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435.9 384 279.4 384 192C384 86.02 297.9 0 192 0S0 86.02 0 192c0 87.4 117 243.9 168.3 307.2c7.6 9.3 22.1 9.3 29.5 0h.1zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/></svg>',
  'fa-chart-line': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 64c0-17.7-14.3-32-32-32S0 30.3 0 48V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zM128 208c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v192c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32V208zm224-32h64c17.7 0 32 14.3 32 32v192c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32V208c0-17.7 14.3-32 32-32z"/></svg>',
  'fa-coffee': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112v64c0 26.5 21.5 48 48 48h32V64H48zm392 84.3c0-42.6-30.3-82.4-71.3-92.7C362.1 27.3 312.6 0 256 0c-77.1 0-140.2 63.1-140.2 140.2V224h272c35.3 0 64-28.7 64-64c0-2.6-.2-5.2-.5-7.7zM256 448c56.6 0 106.1-27.3 136.9-69.6C434.3 368.2 464 328.4 464 285.8c0 2.6.2 5.2.5 7.7H48v118.5C48 438.6 69.5 460 96 460h160zM48 464V448H96c0-17.7-14.3-32-32-32H48z"/></svg>',
  'fa-plus': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H80c-17.7 0-32 14.3-32 32s14.3 32 32 32h112v144c0 17.7 14.3 32 32 32c0 0 0 0 0 0c17.7 0 32-14.3 32-32V288h112c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>',
  'fa-search': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 64.5 64 144S128.5 352 208 352z"/></svg>',
  'fa-times': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>',
  'fa-paper-plane': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg>',
  // Add more icons as needed
};

// Generate base64 data URLs for each icon
const iconDataUrls = {};
for (const [className, svg] of Object.entries(iconMap)) {
  const base64 = svgToBase64(svg);
  const name = className.replace('fa-', '');
  iconDataUrls[name] = createBase64DataUrl(base64);
  
  // Generate colored versions if needed
  if (['star', 'heart', 'map-marker-alt', 'chart-line', 'coffee'].includes(name)) {
    iconDataUrls[`${name}Colored`] = createBase64DataUrl(base64, '#C69C6D');
  }
}

// Generate the icons.js file content
const fileContent = `// Base64 encoded icons
export const icons = ${JSON.stringify(iconDataUrls, null, 2)};`;

// Write to file
fs.writeFileSync(path.join(__dirname, '../src/utils/base64Icons.js'), fileContent);
console.log('Icons generated successfully!'); 