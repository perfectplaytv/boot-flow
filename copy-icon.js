const fs = require('fs');
const path = require('path');
const os = require('os');

const homedir = os.homedir();
const source = path.join(homedir, '.gemini/antigravity/brain/03b951f9-e4c9-435b-bcf9-d1551919a176/bootflow_icon_1768611426899.png');
const dest = path.join(__dirname, 'public/icon.png');

try {
    fs.copyFileSync(source, dest);
    console.log('Icon copied successfully to:', dest);
} catch (err) {
    console.error('Error copying icon:', err.message);
}
