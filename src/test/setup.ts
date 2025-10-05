import '@testing-library/jest-dom'

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    VITE_CLOUDINARY_CLOUD_NAME: 'test-cloud',
    VITE_CLOUDINARY_API_KEY: 'test-api-key',
    VITE_CLOUDINARY_API_SECRET: 'test-api-secret',
    VITE_AWS_REGION: 'us-east-1',
    VITE_AWS_ACCESS_KEY_ID: 'test-access-key',
    VITE_AWS_SECRET_ACCESS_KEY: 'test-secret-key',
    VITE_AWS_BUCKET_NAME: 'test-bucket'
  },
  writable: true
})

// Mock FileReader
global.FileReader = class FileReader {
  result: string | null = null
  error: any = null
  readyState: number = 0
  onload: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null

  readAsDataURL(file: File) {
    setTimeout(() => {
      this.result = `data:${file.type};base64,test-base64-data`
      this.readyState = 2
      if (this.onload) {
        this.onload({ target: this })
      }
    }, 0)
  }
} as any

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-object-url')
global.URL.revokeObjectURL = vi.fn()

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return
  }
  originalConsoleError.call(console, ...args)
}
