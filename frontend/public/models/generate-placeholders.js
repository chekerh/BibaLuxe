// Script to generate simple GLB placeholder files
// Run with: node generate-placeholders.js

const fs = require('fs');
const path = require('path');

// Note: This is a simplified approach. For actual GLB files, you would need
// to use Three.js GLTFExporter or a library like gltf-pipeline.
// For now, we'll create empty placeholder files and provide instructions.

const models = [
  { path: 'mattress/mattress.glb', name: 'Mattress' },
  { path: 'mattress/mattress-pillow.glb', name: 'Mattress with Pillow' },
  { path: 'furniture/sofa-modern.glb', name: 'Modern Sofa' },
  { path: 'furniture/chair-modern.glb', name: 'Modern Chair' },
  { path: 'furniture/table-dining.glb', name: 'Dining Table' },
];

console.log('Creating placeholder files...\n');

models.forEach(({ path: filePath, name }) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create a placeholder file (empty for now - will be replaced with actual models)
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, '');
    console.log(`✓ Created placeholder: ${filePath}`);
  } else {
    console.log(`⚠ Already exists: ${filePath}`);
  }
});

console.log('\n✅ Placeholder files created!');
console.log('\n📥 Next steps:');
console.log('1. Download actual GLB models from the sources in MODEL_SOURCES.md');
console.log('2. Replace the placeholder files with the downloaded models');
console.log('3. Refresh your browser to see the 3D models');

