import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { v2 as cloudinary } from 'cloudinary'
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryUrl,
  ImageTransformations,
  getResponsiveUrls,
  type CloudinaryUploadOptions,
  type CloudinaryUploadResult
} from '@/integrations/cloudinary/cloudinaryClient'

// Mock Cloudinary
vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload: vi.fn(),
      destroy: vi.fn()
    },
    url: vi.fn()
  }
}))

describe('Cloudinary Integration', () => {
  let mockCloudinary: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockCloudinary = {
      config: vi.fn(),
      uploader: {
        upload: vi.fn(),
        destroy: vi.fn()
      },
      url: vi.fn()
    }

    vi.mocked(cloudinary).config = mockCloudinary.config
    vi.mocked(cloudinary).uploader = mockCloudinary.uploader
    vi.mocked(cloudinary).url = mockCloudinary.url
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Configuration', () => {
    it('should configure Cloudinary with environment variables', () => {
      // Import the client to trigger configuration
      require('@/integrations/cloudinary/cloudinaryClient')

      expect(mockCloudinary.config).toHaveBeenCalledWith({
        cloud_name: 'test-cloud',
        api_key: 'test-api-key',
        api_secret: 'test-api-secret',
        secure: true
      })
    })
  })

  describe('uploadToCloudinary', () => {
    let mockFile: File
    let mockUploadResult: CloudinaryUploadResult

    beforeEach(() => {
      mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
      mockUploadResult = {
        public_id: 'photosync/test-123',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/photosync/test-123.jpg',
        url: 'http://res.cloudinary.com/test-cloud/image/upload/v1234567890/photosync/test-123.jpg',
        width: 1920,
        height: 1080,
        format: 'jpg',
        resource_type: 'image',
        bytes: 1024000,
        created_at: '2024-01-01T00:00:00Z',
        tags: ['photosync', 'upload'],
        context: {
          original_filename: 'test.jpg',
          uploaded_by: 'test@example.com',
          uploaded_at: '2024-01-01T00:00:00Z'
        }
      }
    })

    it('should upload file with default options successfully', async () => {
      mockCloudinary.uploader.upload.mockResolvedValue(mockUploadResult)

      const result = await uploadToCloudinary(mockFile)

      expect(mockCloudinary.uploader.upload).toHaveBeenCalledWith(
        'data:image/jpeg;base64,test-base64-data',
        {
          resource_type: 'auto',
          quality: 'auto',
          format: 'auto',
          folder: 'photosync',
          tags: [],
          context: {}
        }
      )

      expect(result).toEqual(mockUploadResult)
    })

    it('should upload file with custom options', async () => {
      const customOptions: CloudinaryUploadOptions = {
        folder: 'custom-folder',
        publicId: 'custom-id',
        resourceType: 'image',
        quality: 80,
        format: 'webp',
        tags: ['custom', 'tag'],
        context: { custom_field: 'value' },
        transformation: { width: 800, height: 600, crop: 'fill' }
      }

      mockCloudinary.uploader.upload.mockResolvedValue(mockUploadResult)

      const result = await uploadToCloudinary(mockFile, customOptions)

      expect(mockCloudinary.uploader.upload).toHaveBeenCalledWith(
        'data:image/jpeg;base64,test-base64-data',
        {
          resource_type: 'image',
          quality: 80,
          format: 'webp',
          folder: 'custom-folder',
          tags: ['custom', 'tag'],
          context: { custom_field: 'value' },
          public_id: 'custom-id',
          transformation: { width: 800, height: 600, crop: 'fill' }
        }
      )

      expect(result).toEqual(mockUploadResult)
    })

    it('should handle video uploads', async () => {
      const videoFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
      const videoResult = {
        ...mockUploadResult,
        resource_type: 'video',
        format: 'mp4',
        duration: 120.5
      }

      mockCloudinary.uploader.upload.mockResolvedValue(videoResult)

      const result = await uploadToCloudinary(videoFile, {
        resourceType: 'video',
        folder: 'videos'
      })

      expect(mockCloudinary.uploader.upload).toHaveBeenCalledWith(
        'data:video/mp4;base64,test-base64-data',
        {
          resource_type: 'video',
          quality: 'auto',
          format: 'auto',
          folder: 'videos',
          tags: [],
          context: {}
        }
      )

      expect(result.resource_type).toBe('video')
    })

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed: Invalid file format')
      mockCloudinary.uploader.upload.mockRejectedValue(error)

      await expect(uploadToCloudinary(mockFile)).rejects.toThrow('Failed to upload file: Upload failed: Invalid file format')
    })

    it('should handle FileReader errors', async () => {
      // Mock FileReader to throw an error
      const originalFileReader = global.FileReader
      global.FileReader = class FileReader {
        readAsDataURL() {
          throw new Error('FileReader error')
        }
      } as any

      await expect(uploadToCloudinary(mockFile)).rejects.toThrow('FileReader error')

      // Restore original FileReader
      global.FileReader = originalFileReader
    })
  })

  describe('deleteFromCloudinary', () => {
    it('should delete image successfully', async () => {
      const mockDeleteResult = {
        result: 'ok',
        public_id: 'photosync/test-123'
      }

      mockCloudinary.uploader.destroy.mockResolvedValue(mockDeleteResult)

      const result = await deleteFromCloudinary('photosync/test-123')

      expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith('photosync/test-123', {
        resource_type: 'image'
      })

      expect(result).toEqual(mockDeleteResult)
    })

    it('should delete video successfully', async () => {
      const mockDeleteResult = {
        result: 'ok',
        public_id: 'videos/test-video'
      }

      mockCloudinary.uploader.destroy.mockResolvedValue(mockDeleteResult)

      const result = await deleteFromCloudinary('videos/test-video', 'video')

      expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith('videos/test-video', {
        resource_type: 'video'
      })

      expect(result).toEqual(mockDeleteResult)
    })

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed: File not found')
      mockCloudinary.uploader.destroy.mockRejectedValue(error)

      await expect(deleteFromCloudinary('nonexistent-file')).rejects.toThrow('Failed to delete file: Delete failed: File not found')
    })
  })

  describe('getCloudinaryUrl', () => {
    it('should generate URL with default options', () => {
      const mockUrl = 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/test-image.jpg'
      mockCloudinary.url.mockReturnValue(mockUrl)

      const result = getCloudinaryUrl('test-image')

      expect(mockCloudinary.url).toHaveBeenCalledWith('test-image', {
        secure: true
      })

      expect(result).toBe(mockUrl)
    })

    it('should generate URL with transformations', () => {
      const mockUrl = 'https://res.cloudinary.com/test-cloud/image/upload/w_800,h_600,c_fill/test-image.jpg'
      mockCloudinary.url.mockReturnValue(mockUrl)

      const transformations = {
        width: 800,
        height: 600,
        crop: 'fill',
        quality: 'auto'
      }

      const result = getCloudinaryUrl('test-image', transformations)

      expect(mockCloudinary.url).toHaveBeenCalledWith('test-image', {
        secure: true,
        ...transformations
      })

      expect(result).toBe(mockUrl)
    })
  })

  describe('ImageTransformations', () => {
    it('should have correct thumbnail transformation', () => {
      expect(ImageTransformations.thumbnail).toEqual({
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
      })
    })

    it('should have correct medium transformation', () => {
      expect(ImageTransformations.medium).toEqual({
        width: 800,
        height: 600,
        crop: 'limit',
        quality: 'auto',
        format: 'auto'
      })
    })

    it('should have correct large transformation', () => {
      expect(ImageTransformations.large).toEqual({
        width: 1200,
        height: 800,
        crop: 'limit',
        quality: 'auto',
        format: 'auto'
      })
    })

    it('should have correct square transformation', () => {
      expect(ImageTransformations.square).toEqual({
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto',
        format: 'auto'
      })
    })

    it('should have correct webp transformation', () => {
      expect(ImageTransformations.webp).toEqual({
        format: 'webp',
        quality: 'auto'
      })
    })

    it('should have correct blur transformation', () => {
      expect(ImageTransformations.blur).toEqual({
        effect: 'blur:1000',
        quality: 1,
        format: 'auto'
      })
    })

    it('should have correct autoCrop transformation', () => {
      expect(ImageTransformations.autoCrop).toEqual({
        crop: 'thumb',
        gravity: 'auto',
        quality: 'auto',
        format: 'auto'
      })
    })
  })

  describe('getResponsiveUrls', () => {
    beforeEach(() => {
      mockCloudinary.url
        .mockReturnValueOnce('https://res.cloudinary.com/test-cloud/image/upload/w_400,h_300,c_fill/test-image.jpg')
        .mockReturnValueOnce('https://res.cloudinary.com/test-cloud/image/upload/w_800,h_600,c_limit/test-image.jpg')
        .mockReturnValueOnce('https://res.cloudinary.com/test-cloud/image/upload/w_1200,h_800,c_limit/test-image.jpg')
        .mockReturnValueOnce('https://res.cloudinary.com/test-cloud/image/upload/test-image.jpg')
    })

    it('should generate responsive URLs for different breakpoints', () => {
      const baseTransformations = { quality: 'auto' }
      const result = getResponsiveUrls('test-image', baseTransformations)

      expect(result).toEqual({
        mobile: 'https://res.cloudinary.com/test-cloud/image/upload/w_400,h_300,c_fill/test-image.jpg',
        tablet: 'https://res.cloudinary.com/test-cloud/image/upload/w_800,h_600,c_limit/test-image.jpg',
        desktop: 'https://res.cloudinary.com/test-cloud/image/upload/w_1200,h_800,c_limit/test-image.jpg',
        original: 'https://res.cloudinary.com/test-cloud/image/upload/test-image.jpg'
      })

      expect(mockCloudinary.url).toHaveBeenCalledTimes(4)
    })

    it('should generate responsive URLs without base transformations', () => {
      const result = getResponsiveUrls('test-image')

      expect(result).toEqual({
        mobile: 'https://res.cloudinary.com/test-cloud/image/upload/w_400,h_300,c_fill/test-image.jpg',
        tablet: 'https://res.cloudinary.com/test-cloud/image/upload/w_800,h_600,c_limit/test-image.jpg',
        desktop: 'https://res.cloudinary.com/test-cloud/image/upload/w_1200,h_800,c_limit/test-image.jpg',
        original: 'https://res.cloudinary.com/test-cloud/image/upload/test-image.jpg'
      })
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty file', async () => {
      const emptyFile = new File([], 'empty.txt', { type: 'text/plain' })
      
      mockCloudinary.uploader.upload.mockResolvedValue({
        public_id: 'photosync/empty',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/photosync/empty.txt',
        url: 'http://res.cloudinary.com/test-cloud/image/upload/v1234567890/photosync/empty.txt',
        width: 0,
        height: 0,
        format: 'txt',
        resource_type: 'raw',
        bytes: 0,
        created_at: '2024-01-01T00:00:00Z'
      })

      const result = await uploadToCloudinary(emptyFile, { resourceType: 'raw' })

      expect(result.bytes).toBe(0)
      expect(result.resource_type).toBe('raw')
    })

    it('should handle large file uploads', async () => {
      // Create a large file (simulate with a large string)
      const largeContent = 'x'.repeat(10 * 1024 * 1024) // 10MB
      const largeFile = new File([largeContent], 'large.jpg', { type: 'image/jpeg' })

      mockCloudinary.uploader.upload.mockResolvedValue({
        public_id: 'photosync/large-file',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/photosync/large-file.jpg',
        url: 'http://res.cloudinary.com/test-cloud/image/upload/v1234567890/photosync/large-file.jpg',
        width: 4000,
        height: 3000,
        format: 'jpg',
        resource_type: 'image',
        bytes: 10 * 1024 * 1024,
        created_at: '2024-01-01T00:00:00Z'
      })

      const result = await uploadToCloudinary(largeFile)

      expect(result.bytes).toBe(10 * 1024 * 1024)
      expect(result.width).toBe(4000)
      expect(result.height).toBe(3000)
    })

    it('should handle special characters in public ID', async () => {
      const specialId = 'test-image-with-special-chars!@#$%^&*()'
      
      mockCloudinary.uploader.destroy.mockResolvedValue({
        result: 'ok',
        public_id: specialId
      })

      const result = await deleteFromCloudinary(specialId)

      expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith(specialId, {
        resource_type: 'image'
      })

      expect(result.public_id).toBe(specialId)
    })

    it('should handle network timeout errors', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
      const timeoutError = new Error('Request timeout')
      mockCloudinary.uploader.upload.mockRejectedValue(timeoutError)

      await expect(uploadToCloudinary(mockFile)).rejects.toThrow('Failed to upload file: Request timeout')
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle complete upload and delete workflow', async () => {
      const mockFile = new File(['test content'], 'workflow-test.jpg', { type: 'image/jpeg' })
      
      // Mock successful upload
      const uploadResult = {
        public_id: 'photosync/workflow-test',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/photosync/workflow-test.jpg',
        url: 'http://res.cloudinary.com/test-cloud/image/upload/v1234567890/photosync/workflow-test.jpg',
        width: 1920,
        height: 1080,
        format: 'jpg',
        resource_type: 'image',
        bytes: 1024000,
        created_at: '2024-01-01T00:00:00Z'
      }

      mockCloudinary.uploader.upload.mockResolvedValue(uploadResult)

      // Upload file
      const uploadResponse = await uploadToCloudinary(mockFile, {
        folder: 'workflow-test',
        tags: ['test', 'workflow']
      })

      expect(uploadResponse.public_id).toBe('photosync/workflow-test')

      // Mock successful deletion
      const deleteResult = {
        result: 'ok',
        public_id: 'photosync/workflow-test'
      }

      mockCloudinary.uploader.destroy.mockResolvedValue(deleteResult)

      // Delete file
      const deleteResponse = await deleteFromCloudinary('photosync/workflow-test')

      expect(deleteResponse.result).toBe('ok')
      expect(deleteResponse.public_id).toBe('photosync/workflow-test')
    })

    it('should handle batch operations', async () => {
      const files = [
        new File(['content1'], 'file1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'file2.jpg', { type: 'image/jpeg' }),
        new File(['content3'], 'file3.jpg', { type: 'image/jpeg' })
      ]

      const uploadPromises = files.map(file => uploadToCloudinary(file, { folder: 'batch-test' }))
      
      // Mock successful uploads
      mockCloudinary.uploader.upload
        .mockResolvedValueOnce({
          public_id: 'batch-test/file1',
          secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/batch-test/file1.jpg',
          url: 'http://res.cloudinary.com/test-cloud/image/upload/v1234567890/batch-test/file1.jpg',
          width: 1920,
          height: 1080,
          format: 'jpg',
          resource_type: 'image',
          bytes: 1024000,
          created_at: '2024-01-01T00:00:00Z'
        })
        .mockResolvedValueOnce({
          public_id: 'batch-test/file2',
          secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/batch-test/file2.jpg',
          url: 'http://res.cloudinary.com/test-cloud/image/upload/v1234567890/batch-test/file2.jpg',
          width: 1920,
          height: 1080,
          format: 'jpg',
          resource_type: 'image',
          bytes: 1024000,
          created_at: '2024-01-01T00:00:00Z'
        })
        .mockResolvedValueOnce({
          public_id: 'batch-test/file3',
          secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1234567890/batch-test/file3.jpg',
          url: 'http://res.cloudinary.com/test-cloud/image/upload/v1234567890/batch-test/file3.jpg',
          width: 1920,
          height: 1080,
          format: 'jpg',
          resource_type: 'image',
          bytes: 1024000,
          created_at: '2024-01-01T00:00:00Z'
        })

      const results = await Promise.all(uploadPromises)

      expect(results).toHaveLength(3)
      expect(results[0].public_id).toBe('batch-test/file1')
      expect(results[1].public_id).toBe('batch-test/file2')
      expect(results[2].public_id).toBe('batch-test/file3')
    })
  })
})
