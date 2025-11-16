# Image Placement Instructions

## Promotional Card Image

To add the Robotic Knee Resurfacing promotional card image:

1. **Image Location**: Place your image file in the `Frontend/public/` folder

2. **Image Name**: Name the file as `robotic-knee-resurfacing.jpg` (or `.png` if it's a PNG file)

3. **Supported Formats**: 
   - `.jpg` / `.jpeg`
   - `.png`
   - `.webp`

4. **File Path**: 
   ```
   Frontend/public/robotic-knee-resurfacing.jpg
   ```

5. **If using different name**: If your image has a different name, update the path in `Frontend/src/components/PromotionalCard.jsx` line 81:
   ```jsx
   src="/your-image-name.jpg"
   ```

## Current Image Path in Code
The component is looking for: `/robotic-knee-resurfacing.jpg` in the public folder.

## How to Add Your Image

1. Copy your image file (from WhatsApp or wherever it is)
2. Paste it into: `Frontend/public/` folder
3. Rename it to: `robotic-knee-resurfacing.jpg` (or update the code to match your filename)
4. The image will automatically appear in the promotional card popup

