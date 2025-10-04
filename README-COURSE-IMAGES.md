# Guide for Adding Course Images

To ensure that course images display correctly in the Learning Management System, please follow these guidelines:

## Image URL Requirements

When adding or editing a course, you need to provide a valid image URL in the "Image Link" field. The URL must:

1. Be accessible publicly (not behind authentication)
2. Point directly to an image file (typically ending with .jpg, .png, .jpeg, .gif)
3. Use HTTPS protocol for security (starts with https://)
4. Allow cross-origin resource sharing (CORS)

## Recommended Image Sources

We recommend using these image hosting services:

1. **Imgur**: https://imgur.com/ (free, easy to use)
2. **Cloudinary**: https://cloudinary.com/ (free tier available)
3. **ImgBB**: https://imgbb.com/ (free)

## Steps to Get a Proper Image URL

### Using Imgur:

1. Go to https://imgur.com/
2. Upload your image (you don't need an account)
3. Right-click on the uploaded image
4. Select "Copy image address" or "Copy image link"
5. Paste this URL in the "Image Link" field when adding or editing a course

### Standard Image Dimensions

For best results:
- **Course cards**: 300px × 180px
- **Course learning cards**: 210px × 120px

## Troubleshooting Image Issues

If your images are not displaying:

1. **Check the URL** by pasting it directly in a browser address bar to verify it loads
2. **Ensure the URL is direct** to the image (not a page containing the image)
3. **Verify HTTPS** is used in the URL
4. Try uploading to a different image hosting service
5. Check the browser console for CORS-related errors

## Example Valid URLs

```
https://i.imgur.com/abcdefg.jpg
https://res.cloudinary.com/yourname/image/upload/v1234567/example.png
https://i.ibb.co/abcdefg/course-image.jpg
```

## Setting Up Test Images for Development

For testing purposes, you can use placeholder images from services like:

- https://placeholder.com/
- https://picsum.photos/
- https://placehold.jp/

Example: `https://picsum.photos/300/180` 