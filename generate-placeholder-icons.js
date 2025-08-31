#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// SVG template for iParental logo placeholder
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#4285F4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Shield background -->
  <path d="M${size/8} ${size/6} 
           Q${size/8} ${size/8} ${size/4} ${size/8}
           L${size*3/4} ${size/8}
           Q${size*7/8} ${size/8} ${size*7/8} ${size/6}
           L${size*7/8} ${size/2}
           Q${size*7/8} ${size*5/6} ${size/2} ${size*7/8}
           Q${size/8} ${size*5/6} ${size/8} ${size/2}
           Z" 
        fill="url(#shieldGradient)" 
        stroke="none"/>
  
  <!-- Inner shield -->
  <path d="M${size/6} ${size/4} 
           Q${size/6} ${size/5} ${size/3} ${size/5}
           L${size*2/3} ${size/5}
           Q${size*5/6} ${size/5} ${size*5/6} ${size/4}
           L${size*5/6} ${size/2}
           Q${size*5/6} ${size*3/4} ${size/2} ${size*4/5}
           Q${size/6} ${size*3/4} ${size/6} ${size/2}
           Z" 
        fill="#E8E8E8" 
        opacity="0.9"/>
  
  <!-- Family silhouettes -->
  <!-- Parent figure -->
  <circle cx="${size*0.4}" cy="${size*0.45}" r="${size/20}" fill="#4285F4"/>
  <ellipse cx="${size*0.4}" cy="${size*0.6}" rx="${size/12}" ry="${size/8}" fill="#4285F4"/>
  
  <!-- Child figure -->
  <circle cx="${size*0.6}" cy="${size*0.5}" r="${size/25}" fill="#0EA5E9"/>
  <ellipse cx="${size*0.6}" cy="${size*0.62}" rx="${size/15}" ry="${size/10}" fill="#0EA5E9"/>
  
  <!-- Check mark (bottom right) -->
  <circle cx="${size*0.8}" cy="${size*0.8}" r="${size/8}" fill="#34A853"/>
  <path d="M${size*0.75} ${size*0.8} L${size*0.78} ${size*0.83} L${size*0.85} ${size*0.77}" 
        stroke="white" 
        stroke-width="${size/80}" 
        fill="none" 
        stroke-linecap="round"/>
</svg>
`;

// Icon sizes for different platforms
const iconSizes = {
  ios: [
    { name: 'icon-20.png', size: 20 },
    { name: 'icon-20@2x.png', size: 40 },
    { name: 'icon-20@3x.png', size: 60 },
    { name: 'icon-29.png', size: 29 },
    { name: 'icon-29@2x.png', size: 58 },
    { name: 'icon-29@3x.png', size: 87 },
    { name: 'icon-40.png', size: 40 },
    { name: 'icon-40@2x.png', size: 80 },
    { name: 'icon-40@3x.png', size: 120 },
    { name: 'icon-60@2x.png', size: 120 },
    { name: 'icon-60@3x.png', size: 180 },
    { name: 'icon-76.png', size: 76 },
    { name: 'icon-76@2x.png', size: 152 },
    { name: 'icon-83.5@2x.png', size: 167 },
    { name: 'icon-1024.png', size: 1024 },
  ],
  android: [
    { name: 'ic_launcher.png', size: 48, folder: 'mipmap-mdpi' },
    { name: 'ic_launcher.png', size: 72, folder: 'mipmap-hdpi' },
    { name: 'ic_launcher.png', size: 96, folder: 'mipmap-xhdpi' },
    { name: 'ic_launcher.png', size: 144, folder: 'mipmap-xxhdpi' },
    { name: 'ic_launcher.png', size: 192, folder: 'mipmap-xxxhdpi' },
  ]
};

// Function to convert SVG to PNG (placeholder - you'd need a proper SVG to PNG converter)
const generatePlaceholderIcon = (size, outputPath) => {
  const svgContent = createIconSVG(size);
  
  // For now, just save as SVG (you can convert to PNG using tools like sharp, canvas, or online converters)
  const svgPath = outputPath.replace('.png', '.svg');
  
  try {
    fs.writeFileSync(svgPath, svgContent);
    console.log(`Generated placeholder: ${svgPath}`);
    
    // Instructions for PNG conversion
    console.log(`To convert to PNG: Use an online SVG to PNG converter or install sharp/canvas`);
    console.log(`Then convert ${svgPath} to ${outputPath}`);
    
  } catch (error) {
    console.error(`Error generating ${svgPath}:`, error);
  }
};

// Generate iOS icons
console.log('Generating iOS placeholder icons...');
const iosIconDir = 'ios/iParental/Images.xcassets/AppIcon.appiconset';
if (!fs.existsSync(iosIconDir)) {
  fs.mkdirSync(iosIconDir, { recursive: true });
}

iconSizes.ios.forEach(icon => {
  const outputPath = path.join(iosIconDir, icon.name);
  generatePlaceholderIcon(icon.size, outputPath);
});

// Generate Android icons
console.log('\nGenerating Android placeholder icons...');
iconSizes.android.forEach(icon => {
  const androidIconDir = `android/app/src/main/res/${icon.folder}`;
  if (!fs.existsSync(androidIconDir)) {
    fs.mkdirSync(androidIconDir, { recursive: true });
  }
  
  const outputPath = path.join(androidIconDir, icon.name);
  generatePlaceholderIcon(icon.size, outputPath);
  
  // Also generate round version
  const roundOutputPath = path.join(androidIconDir, 'ic_launcher_round.png');
  generatePlaceholderIcon(icon.size, roundOutputPath);
  
  // Generate adaptive icon components
  const foregroundPath = path.join(androidIconDir, 'ic_launcher_foreground.png');
  const backgroundPath = path.join(androidIconDir, 'ic_launcher_background.png');
  generatePlaceholderIcon(icon.size, foregroundPath);
  generatePlaceholderIcon(icon.size, backgroundPath);
});

console.log('\n✅ Placeholder icons generated!');
console.log('\n📝 Next steps:');
console.log('1. Convert SVG files to PNG using your preferred tool');
console.log('2. Replace placeholder icons with your actual iParental logo');
console.log('3. Follow the ICON_GENERATION_GUIDE.md for detailed instructions');
console.log('4. Test icons on actual devices');
console.log('\n🎨 Recommended tools for SVG to PNG conversion:');
console.log('- Online: https://svgtopng.com/ or https://cloudconvert.com/');
console.log('- Command line: npm install -g svgexport, then: svgexport input.svg output.png');
console.log('- Figma/Sketch: Import SVG and export as PNG at required sizes');
