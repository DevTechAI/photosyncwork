import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

// Mock the Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn()
}))

describe('Supabase Integration', () => {
  let mockSupabaseClient: any
  let mockQuery: any
  let mockFrom: any
  let mockSelect: any
  let mockInsert: any
  let mockUpdate: any
  let mockDelete: any
  let mockEq: any
  let mockAuth: any

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Create mock functions
    mockEq = vi.fn().mockReturnThis()
    mockSelect = vi.fn().mockReturnThis()
    mockInsert = vi.fn().mockReturnThis()
    mockUpdate = vi.fn().mockReturnThis()
    mockDelete = vi.fn().mockReturnThis()
    mockFrom = vi.fn().mockReturnThis()
    
    mockQuery = {
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
      single: vi.fn(),
      maybeSingle: vi.fn(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis()
    }

    mockAuth = {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      getSession: vi.fn()
    }

    mockSupabaseClient = {
      from: mockFrom,
      auth: mockAuth,
      storage: {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn(),
        download: vi.fn(),
        remove: vi.fn(),
        getPublicUrl: vi.fn()
      },
      functions: {
        invoke: vi.fn()
      }
    }

    // Mock the createClient function
    vi.mocked(createClient).mockReturnValue(mockSupabaseClient)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Client Initialization', () => {
    it('should create Supabase client with correct configuration', () => {
      const SUPABASE_URL = 'https://qozhzuekdwxvnrqxyxsr.supabase.co'
      const SUPABASE_PUBLISHABLE_KEY = 'test-key'

      // Import the client to trigger initialization
      require('@/integrations/supabase/client')

      expect(createClient).toHaveBeenCalledWith(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        expect.any(Object)
      )
    })

    it('should export supabase client instance', () => {
      const { supabase } = require('@/integrations/supabase/client')
      
      expect(supabase).toBeDefined()
      expect(supabase).toBe(mockSupabaseClient)
    })
  })

  describe('Database Operations', () => {
    beforeEach(() => {
      // Import the client
      require('@/integrations/supabase/client')
    })

    describe('Profiles Table', () => {
      it('should fetch user profile successfully', async () => {
        const mockProfile = {
          id: 'user-123',
          email: 'test@example.com',
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg',
          storage_used: 1024,
          storage_limit: 10240,
          plan_type: 'premium',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }

        mockQuery.single.mockResolvedValue({ data: mockProfile, error: null })

        const { supabase } = require('@/integrations/supabase/client')
        
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', 'user-123')
          .single()

        expect(mockFrom).toHaveBeenCalledWith('profiles')
        expect(mockSelect).toHaveBeenCalledWith('*')
        expect(mockEq).toHaveBeenCalledWith('id', 'user-123')
        expect(result.data).toEqual(mockProfile)
        expect(result.error).toBeNull()
      })

      it('should handle profile fetch error', async () => {
        const mockError = { message: 'Profile not found', code: 'PGRST116' }
        mockQuery.single.mockResolvedValue({ data: null, error: mockError })

        const { supabase } = require('@/integrations/supabase/client')
        
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', 'nonexistent-user')
          .single()

        expect(result.data).toBeNull()
        expect(result.error).toEqual(mockError)
      })

      it('should update user profile successfully', async () => {
        const updateData = {
          full_name: 'Updated Name',
          avatar_url: 'https://example.com/new-avatar.jpg'
        }

        mockQuery.eq.mockResolvedValue({ data: null, error: null })

        const { supabase } = require('@/integrations/supabase/client')
        
        const result = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', 'user-123')

        expect(mockFrom).toHaveBeenCalledWith('profiles')
        expect(mockUpdate).toHaveBeenCalledWith(updateData)
        expect(mockEq).toHaveBeenCalledWith('id', 'user-123')
        expect(result.error).toBeNull()
      })
    })

    describe('Clients Table', () => {
      it('should fetch clients list successfully', async () => {
        const mockClients = [
          {
            id: 'client-1',
            name: 'Client One',
            email: 'client1@example.com',
            phone: '+1234567890',
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 'client-2',
            name: 'Client Two',
            email: 'client2@example.com',
            phone: '+1234567891',
            created_at: '2024-01-02T00:00:00Z'
          }
        ]

        mockQuery.order.mockResolvedValue({ data: mockClients, error: null })

        const { supabase } = require('@/integrations/supabase/client')
        
        const result = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        expect(mockFrom).toHaveBeenCalledWith('clients')
        expect(mockSelect).toHaveBeenCalledWith('*')
        expect(result.data).toEqual(mockClients)
        expect(result.error).toBeNull()
      })

      it('should create new client successfully', async () => {
        const newClient = {
          name: 'New Client',
          email: 'newclient@example.com',
          phone: '+1234567892'
        }

        mockQuery.select.mockResolvedValue({ 
          data: [{ id: 'client-3', ...newClient }], 
          error: null 
        })

        const { supabase } = require('@/integrations/supabase/client')
        
        const result = await supabase
          .from('clients')
          .insert(newClient)
          .select()

        expect(mockFrom).toHaveBeenCalledWith('clients')
        expect(mockInsert).toHaveBeenCalledWith(newClient)
        expect(result.data).toHaveLength(1)
        expect(result.data[0]).toMatchObject(newClient)
        expect(result.error).toBeNull()
      })
    })

    describe('Events Table', () => {
      it('should fetch events with pagination', async () => {
        const mockEvents = [
          {
            id: 'event-1',
            name: 'Wedding Photography',
            client_id: 'client-1',
            event_date: '2024-06-15',
            status: 'confirmed'
          }
        ]

        mockQuery.range.mockResolvedValue({ data: mockEvents, error: null })

        const { supabase } = require('@/integrations/supabase/client')
        
        const result = await supabase
          .from('events')
          .select('*')
          .range(0, 9)

        expect(mockFrom).toHaveBeenCalledWith('events')
        expect(mockRange).toHaveBeenCalledWith(0, 9)
        expect(result.data).toEqual(mockEvents)
        expect(result.error).toBeNull()
      })
    })
  })

  describe('Authentication', () => {
    beforeEach(() => {
      require('@/integrations/supabase/client')
    })

    it('should sign up user successfully', async () => {
      const signUpData = {
        email: 'newuser@example.com',
        password: 'password123'
      }

      const mockResponse = {
        data: {
          user: { id: 'user-123', email: signUpData.email },
          session: { access_token: 'token123' }
        },
        error: null
      }

      mockAuth.signUp.mockResolvedValue(mockResponse)

      const { supabase } = require('@/integrations/supabase/client')
      
      const result = await supabase.auth.signUp(signUpData)

      expect(mockAuth.signUp).toHaveBeenCalledWith(signUpData)
      expect(result.data.user.email).toBe(signUpData.email)
      expect(result.error).toBeNull()
    })

    it('should sign in user successfully', async () => {
      const signInData = {
        email: 'user@example.com',
        password: 'password123'
      }

      const mockResponse = {
        data: {
          user: { id: 'user-123', email: signInData.email },
          session: { access_token: 'token123' }
        },
        error: null
      }

      mockAuth.signInWithPassword.mockResolvedValue(mockResponse)

      const { supabase } = require('@/integrations/supabase/client')
      
      const result = await supabase.auth.signInWithPassword(signInData)

      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith(signInData)
      expect(result.data.user.email).toBe(signInData.email)
      expect(result.error).toBeNull()
    })

    it('should handle authentication errors', async () => {
      const signInData = {
        email: 'user@example.com',
        password: 'wrongpassword'
      }

      const mockError = {
        message: 'Invalid login credentials',
        status: 400
      }

      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      })

      const { supabase } = require('@/integrations/supabase/client')
      
      const result = await supabase.auth.signInWithPassword(signInData)

      expect(result.data.user).toBeNull()
      expect(result.error).toEqual(mockError)
    })

    it('should sign out user successfully', async () => {
      mockAuth.signOut.mockResolvedValue({ error: null })

      const { supabase } = require('@/integrations/supabase/client')
      
      const result = await supabase.auth.signOut()

      expect(mockAuth.signOut).toHaveBeenCalled()
      expect(result.error).toBeNull()
    })
  })

  describe('Storage Operations', () => {
    beforeEach(() => {
      require('@/integrations/supabase/client')
    })

    it('should upload file to storage successfully', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
      const mockUploadResponse = {
        data: { path: 'uploads/test.jpg' },
        error: null
      }

      mockSupabaseClient.storage.upload.mockResolvedValue(mockUploadResponse)

      const { supabase } = require('@/integrations/supabase/client')
      
      const result = await supabase.storage
        .from('photos')
        .upload('test.jpg', mockFile)

      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('photos')
      expect(mockSupabaseClient.storage.upload).toHaveBeenCalledWith('test.jpg', mockFile)
      expect(result.data.path).toBe('uploads/test.jpg')
      expect(result.error).toBeNull()
    })

    it('should get public URL for uploaded file', async () => {
      const mockPublicUrl = 'https://supabase.co/storage/v1/object/public/photos/test.jpg'
      
      mockSupabaseClient.storage.getPublicUrl.mockReturnValue({
        data: { publicUrl: mockPublicUrl }
      })

      const { supabase } = require('@/integrations/supabase/client')
      
      const result = supabase.storage
        .from('photos')
        .getPublicUrl('test.jpg')

      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('photos')
      expect(mockSupabaseClient.storage.getPublicUrl).toHaveBeenCalledWith('test.jpg')
      expect(result.data.publicUrl).toBe(mockPublicUrl)
    })

    it('should delete file from storage successfully', async () => {
      const mockDeleteResponse = {
        data: [{ name: 'test.jpg' }],
        error: null
      }

      mockSupabaseClient.storage.remove.mockResolvedValue(mockDeleteResponse)

      const { supabase } = require('@/integrations/supabase/client')
      
      const result = await supabase.storage
        .from('photos')
        .remove(['test.jpg'])

      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('photos')
      expect(mockSupabaseClient.storage.remove).toHaveBeenCalledWith(['test.jpg'])
      expect(result.data).toHaveLength(1)
      expect(result.error).toBeNull()
    })
  })

  describe('Edge Functions', () => {
    beforeEach(() => {
      require('@/integrations/supabase/client')
    })

    it('should invoke edge function successfully', async () => {
      const functionName = 'send-estimate-email'
      const payload = {
        clientEmail: 'client@example.com',
        estimateId: 'estimate-123'
      }

      const mockResponse = {
        data: { success: true, messageId: 'msg-123' },
        error: null
      }

      mockSupabaseClient.functions.invoke.mockResolvedValue(mockResponse)

      const { supabase } = require('@/integrations/supabase/client')
      
      const result = await supabase.functions.invoke(functionName, {
        body: payload
      })

      expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith(
        functionName,
        { body: payload }
      )
      expect(result.data.success).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should handle edge function errors', async () => {
      const functionName = 'invalid-function'
      const payload = {}

      const mockError = {
        message: 'Function not found',
        status: 404
      }

      mockSupabaseClient.functions.invoke.mockResolvedValue({
        data: null,
        error: mockError
      })

      const { supabase } = require('@/integrations/supabase/client')
      
      const result = await supabase.functions.invoke(functionName, {
        body: payload
      })

      expect(result.data).toBeNull()
      expect(result.error).toEqual(mockError)
    })
  })

  describe('Real-time Subscriptions', () => {
    beforeEach(() => {
      require('@/integrations/supabase/client')
    })

    it('should subscribe to real-time changes', () => {
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
        unsubscribe: vi.fn()
      }

      mockSupabaseClient.channel = vi.fn().mockReturnValue(mockChannel)

      const { supabase } = require('@/integrations/supabase/client')
      
      const channel = supabase
        .channel('profiles-changes')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        }, (payload) => {
          console.log('Profile updated:', payload)
        })
        .subscribe()

      expect(mockSupabaseClient.channel).toHaveBeenCalledWith('profiles-changes')
      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        expect.any(Function)
      )
      expect(mockChannel.subscribe).toHaveBeenCalled()
    })
  })
})
