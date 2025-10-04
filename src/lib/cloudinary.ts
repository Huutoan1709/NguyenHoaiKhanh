import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm upload file lên Cloudinary
export async function uploadToCloudinary(file: Buffer, folder: string = 'general'): Promise<string> {
  return new Promise((resolve, reject) => {
    // Sử dụng stream để upload
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `nextjs-blog/${folder}`,
        resource_type: 'auto', // Tự động phát hiện loại tài nguyên (hình ảnh/video)
        allowed_formats: ['jpg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm'],
        transformation: [
          { width: 1000, crop: 'limit' }, // Giới hạn kích thước tối đa
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || '');
        }
      }
    );

    // Upload file
    uploadStream.end(file);
  });
}

// Hàm upload avatar
export async function uploadAvatar(buffer: Buffer): Promise<string | null> {
  try {
    // Convert Buffer to base64
    const base64String = buffer.toString('base64');
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64String}`,
      {
        folder: 'avatars',
        overwrite: true,
        resource_type: 'image',
      }
    );
    
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
}

// Hàm xóa file từ Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

// Hàm xóa ảnh từ Cloudinary
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(`avatars/${publicId}`);
    return true;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
}

// Lấy public_id từ URL Cloudinary
export function getPublicIdFromUrl(url: string): string | null {
  try {
    if (!url || !url.includes('cloudinary.com')) return null;
    
    // Tách phần path từ URL
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    
    // Bỏ qua các phần không liên quan
    const uploadIndex = pathSegments.findIndex(segment => segment === 'upload');
    if (uploadIndex === -1) return null;
    
    // Lấy các phần sau 'upload' (bỏ qua phần version)
    const relevantSegments = pathSegments.slice(uploadIndex + 2);
    
    // Loại bỏ phần mở rộng file
    const lastSegment = relevantSegments[relevantSegments.length - 1];
    const extensionIndex = lastSegment.lastIndexOf('.');
    if (extensionIndex !== -1) {
      relevantSegments[relevantSegments.length - 1] = lastSegment.substring(0, extensionIndex);
    }
    
    return relevantSegments.join('/');
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}