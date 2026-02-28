import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {File|Buffer} file - File to upload
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadToCloudinary(file, folder = 'matrimonial') {
  try {
    // Validate Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
    }

    let fileType = 'image/jpeg';
    let fileName = 'upload';
    let buffer;

    // Handle File, Blob, or FormData file object from Next.js
    if (file instanceof File) {
      fileType = file.type || 'image/jpeg';
      fileName = file.name || 'upload';
      try {
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } catch (e) {
        throw new Error(`Failed to read file: ${e.message}`);
      }
    } else if (file && typeof file === 'object') {
      // Handle FormData file object from Next.js (might be Blob-like or have stream method)
      fileType = file.type || file.contentType || 'image/jpeg';
      fileName = file.name || file.filename || 'upload';
      
      try {
        // Try arrayBuffer first
        if (typeof file.arrayBuffer === 'function') {
          const arrayBuffer = await file.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
        } 
        // Try stream
        else if (typeof file.stream === 'function') {
          const stream = file.stream();
          const chunks = [];
          const reader = stream.getReader();
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(Buffer.from(value));
          }
          
          buffer = Buffer.concat(chunks);
        }
        // Try buffer directly
        else if (Buffer.isBuffer(file)) {
          buffer = file;
        }
        // Try to read as blob
        else if (file instanceof Blob || (file.constructor && file.constructor.name === 'Blob')) {
          const arrayBuffer = await file.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
        }
        else {
          // Last resort: try to convert the entire object
          throw new Error(`Cannot read file - unknown type: ${file.constructor?.name || typeof file}`);
        }
      } catch (e) {
        console.error('File reading error:', e);
        throw new Error(`Failed to read file object: ${e.message}. File type: ${file.constructor?.name || typeof file}`);
      }
    } else if (Buffer.isBuffer(file)) {
      buffer = file;
    } else {
      throw new Error(`Invalid file type: ${typeof file}. Expected File, Blob, or Buffer. Got: ${file?.constructor?.name || 'unknown'}`);
    }

    if (!buffer || buffer.length === 0) {
      throw new Error('File is empty or invalid');
    }

    console.log(`Uploading to Cloudinary: ${fileName} (${fileType}, ${buffer.length} bytes)`);

    // Prepare upload options
    const uploadOptions = {
      folder: folder,
      resource_type: 'auto', // auto-detect image or raw (for PDFs)
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'webp'],
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ],
      use_filename: true,
      unique_filename: true,
    };

    // Upload to Cloudinary - try both methods for compatibility
    let result;
    try {
      // Method 1: Try upload_stream (more efficient for large files)
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, uploadResult) => {
            if (error) {
              console.error('Cloudinary upload_stream error:', error);
              reject(error);
            } else {
              resolve(uploadResult);
            }
          }
        );
        
        // Write buffer to stream
        uploadStream.end(buffer);
      });
    } catch (streamError) {
      console.warn('Stream upload failed, trying base64 method:', streamError.message);
      
      // Method 2: Fallback to base64 upload (more compatible)
      try {
        const base64 = buffer.toString('base64');
        const dataURI = `data:${fileType};base64,${base64}`;
        
        result = await cloudinary.uploader.upload(dataURI, uploadOptions);
      } catch (base64Error) {
        console.error('Base64 upload also failed:', base64Error);
        throw new Error(`Both upload methods failed. Stream: ${streamError.message}, Base64: ${base64Error.message}`);
      }
    }

    // Check for both secure_url and url (Cloudinary may return either)
    const returnedUrl = result.secure_url || result.url;
    
    if (!result || !returnedUrl) {
      console.error('Cloudinary result:', {
        hasResult: !!result,
        hasSecureUrl: !!result?.secure_url,
        hasUrl: !!result?.url,
        keys: result ? Object.keys(result) : 'NO RESULT'
      });
      throw new Error('Cloudinary upload failed - no URL returned');
    }

    console.log(`✅ Upload successful: ${returnedUrl}`);
    console.log(`   Public ID: ${result.public_id}`);

    return {
      url: returnedUrl, // Use secure_url or url, whichever is available
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error details:', {
      message: error.message,
      stack: error.stack,
      fileType: file?.type,
      fileName: file?.name,
    });
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
}

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
export async function deleteFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

