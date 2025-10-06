import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  fetchPortfolio, 
  createPortfolio, 
  updatePortfolio, 
  fetchPortfolioGallery, 
  addGalleryItem, 
  deleteGalleryItem 
} from '../portfolioApi';
import { supabase } from '@/integrations/supabase/client';
import { Portfolio, PortfolioGalleryItem, PortfolioFormData } from '@/types/portfolio';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(),
          single: vi.fn(),
          order: vi.fn(() => ({
            order: vi.fn()
          }))
        })),
        order: vi.fn(() => ({
          order: vi.fn()
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }
}));

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeEach(() => {
  vi.clearAllMocks();
  console.error = vi.fn();
  console.log = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

describe('Portfolio API', () => {
  const mockUserId = 'test-user-id';
  const mockPortfolioId = 'test-portfolio-id';
  
  const mockPortfolio: Portfolio = {
    id: mockPortfolioId,
    user_id: mockUserId,
    name: 'Test Portfolio',
    tagline: 'Test Tagline',
    about: 'Test About',
    services: ['Portrait', 'Wedding'],
    contact: {
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Test City'
    },
    social_links: {
      instagram: '@test',
      facebook: 'test.facebook',
      website: 'https://test.com'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  const mockPortfolioFormData: PortfolioFormData = {
    name: 'Test Portfolio',
    tagline: 'Test Tagline',
    about: 'Test About',
    services: ['Portrait', 'Wedding'],
    contact: {
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Test City'
    },
    socialLinks: {
      instagram: '@test',
      facebook: 'test.facebook',
      website: 'https://test.com'
    }
  };

  const mockGalleryItem: PortfolioGalleryItem = {
    id: 'gallery-item-id',
    portfolio_id: mockPortfolioId,
    title: 'Test Image',
    description: 'Test Description',
    image_url: 'https://example.com/image.jpg',
    image_alt: 'Test Image Alt',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  describe('fetchPortfolio', () => {
    it('should fetch a portfolio successfully', async () => {
      const mockSupabaseResponse = {
        data: mockPortfolio,
        error: null
      };

      const mockQuery = {
        maybeSingle: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      const result = await fetchPortfolio(mockUserId);

      expect(result).toEqual(mockPortfolio);
      expect(supabase.from).toHaveBeenCalledWith('portfolios');
      expect(mockQuery.maybeSingle).toHaveBeenCalled();
    });

    it('should return null when no portfolio is found', async () => {
      const mockSupabaseResponse = {
        data: null,
        error: null
      };

      const mockQuery = {
        maybeSingle: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      const result = await fetchPortfolio(mockUserId);

      expect(result).toBeNull();
    });

    it('should handle errors gracefully and return null', async () => {
      const mockError = new Error('Database error');
      const mockSupabaseResponse = {
        data: null,
        error: mockError
      };

      const mockQuery = {
        maybeSingle: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      const result = await fetchPortfolio(mockUserId);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error fetching portfolio:', mockError);
    });

    it('should handle exceptions and return null', async () => {
      const mockError = new Error('Network error');
      
      vi.mocked(supabase.from).mockImplementation(() => {
        throw mockError;
      });

      const result = await fetchPortfolio(mockUserId);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error fetching portfolio:', mockError);
    });
  });

  describe('createPortfolio', () => {
    it('should create a portfolio successfully', async () => {
      const mockSupabaseResponse = {
        data: mockPortfolio,
        error: null
      };

      const mockQuery = {
        single: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      const result = await createPortfolio(mockUserId, mockPortfolioFormData);

      expect(result).toEqual(mockPortfolio);
      expect(supabase.from).toHaveBeenCalledWith('portfolios');
      expect(mockQuery.single).toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      const mockError = new Error('Creation failed');
      const mockSupabaseResponse = {
        data: null,
        error: mockError
      };

      const mockQuery = {
        single: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      await expect(createPortfolio(mockUserId, mockPortfolioFormData)).rejects.toThrow(mockError);
    });

    it('should handle exceptions during creation', async () => {
      const mockError = new Error('Network error');
      
      vi.mocked(supabase.from).mockImplementation(() => {
        throw mockError;
      });

      await expect(createPortfolio(mockUserId, mockPortfolioFormData)).rejects.toThrow(mockError);
      expect(console.error).toHaveBeenCalledWith('Error creating portfolio:', mockError);
    });
  });

  describe('updatePortfolio', () => {
    it('should update a portfolio successfully', async () => {
      const updatedPortfolio = { ...mockPortfolio, name: 'Updated Portfolio' };
      const mockSupabaseResponse = {
        data: updatedPortfolio,
        error: null
      };

      const mockQuery = {
        single: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue(mockQuery)
          })
        })
      } as any);

      const result = await updatePortfolio(mockPortfolioId, mockPortfolioFormData);

      expect(result).toEqual(updatedPortfolio);
      expect(supabase.from).toHaveBeenCalledWith('portfolios');
      expect(mockQuery.single).toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      const mockError = new Error('Update failed');
      const mockSupabaseResponse = {
        data: null,
        error: mockError
      };

      const mockQuery = {
        single: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue(mockQuery)
          })
        })
      } as any);

      await expect(updatePortfolio(mockPortfolioId, mockPortfolioFormData)).rejects.toThrow(mockError);
    });

    it('should handle exceptions during update', async () => {
      const mockError = new Error('Network error');
      
      vi.mocked(supabase.from).mockImplementation(() => {
        throw mockError;
      });

      await expect(updatePortfolio(mockPortfolioId, mockPortfolioFormData)).rejects.toThrow(mockError);
      expect(console.error).toHaveBeenCalledWith('Error updating portfolio:', mockError);
    });
  });

  describe('fetchPortfolioGallery', () => {
    it('should fetch gallery items successfully', async () => {
      const mockGalleryItems = [mockGalleryItem];
      const mockSupabaseResponse = {
        data: mockGalleryItems,
        error: null
      };

      const mockQuery = {
        order: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue(mockQuery)
          })
        })
      } as any);

      const result = await fetchPortfolioGallery(mockPortfolioId);

      expect(result).toEqual(mockGalleryItems);
      expect(supabase.from).toHaveBeenCalledWith('portfolio_gallery');
    });

    it('should return empty array when no gallery items found', async () => {
      const mockSupabaseResponse = {
        data: null,
        error: null
      };

      const mockQuery = {
        order: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue(mockQuery)
          })
        })
      } as any);

      const result = await fetchPortfolioGallery(mockPortfolioId);

      expect(result).toEqual([]);
    });

    it('should handle errors and return empty array', async () => {
      const mockError = new Error('Gallery fetch failed');
      const mockSupabaseResponse = {
        data: null,
        error: mockError
      };

      const mockQuery = {
        order: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue(mockQuery)
          })
        })
      } as any);

      const result = await fetchPortfolioGallery(mockPortfolioId);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching portfolio gallery:', mockError);
    });

    it('should handle exceptions and return empty array', async () => {
      const mockError = new Error('Network error');
      
      vi.mocked(supabase.from).mockImplementation(() => {
        throw mockError;
      });

      const result = await fetchPortfolioGallery(mockPortfolioId);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching portfolio gallery:', mockError);
    });
  });

  describe('addGalleryItem', () => {
    it('should add a gallery item successfully', async () => {
      const mockSupabaseResponse = {
        data: mockGalleryItem,
        error: null
      };

      const mockQuery = {
        single: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      const galleryItemData = {
        portfolio_id: mockPortfolioId,
        title: 'Test Image',
        description: 'Test Description',
        image_url: 'https://example.com/image.jpg',
        image_alt: 'Test Image Alt'
      };

      const result = await addGalleryItem(galleryItemData);

      expect(result).toEqual(mockGalleryItem);
      expect(supabase.from).toHaveBeenCalledWith('portfolio_gallery');
      expect(mockQuery.single).toHaveBeenCalled();
    });

    it('should handle add gallery item errors', async () => {
      const mockError = new Error('Add gallery item failed');
      const mockSupabaseResponse = {
        data: null,
        error: mockError
      };

      const mockQuery = {
        single: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      const galleryItemData = {
        portfolio_id: mockPortfolioId,
        title: 'Test Image',
        description: 'Test Description',
        image_url: 'https://example.com/image.jpg',
        image_alt: 'Test Image Alt'
      };

      await expect(addGalleryItem(galleryItemData)).rejects.toThrow(mockError);
    });

    it('should handle exceptions during add gallery item', async () => {
      const mockError = new Error('Network error');
      
      vi.mocked(supabase.from).mockImplementation(() => {
        throw mockError;
      });

      const galleryItemData = {
        portfolio_id: mockPortfolioId,
        title: 'Test Image',
        description: 'Test Description',
        image_url: 'https://example.com/image.jpg',
        image_alt: 'Test Image Alt'
      };

      await expect(addGalleryItem(galleryItemData)).rejects.toThrow(mockError);
      expect(console.error).toHaveBeenCalledWith('Error adding gallery item:', mockError);
    });
  });

  describe('deleteGalleryItem', () => {
    it('should delete a gallery item successfully', async () => {
      const mockSupabaseResponse = {
        data: null,
        error: null
      };

      const mockQuery = {
        eq: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue(mockQuery)
      } as any);

      await deleteGalleryItem('gallery-item-id');

      expect(supabase.from).toHaveBeenCalledWith('portfolio_gallery');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'gallery-item-id');
    });

    it('should handle delete gallery item errors', async () => {
      const mockError = new Error('Delete gallery item failed');
      const mockSupabaseResponse = {
        data: null,
        error: mockError
      };

      const mockQuery = {
        eq: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue(mockQuery)
      } as any);

      await expect(deleteGalleryItem('gallery-item-id')).rejects.toThrow(mockError);
    });

    it('should handle exceptions during delete gallery item', async () => {
      const mockError = new Error('Network error');
      
      vi.mocked(supabase.from).mockImplementation(() => {
        throw mockError;
      });

      await expect(deleteGalleryItem('gallery-item-id')).rejects.toThrow(mockError);
      expect(console.error).toHaveBeenCalledWith('Error deleting gallery item:', mockError);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed portfolio data gracefully', async () => {
      const malformedData = {
        data: { invalid: 'data' },
        error: null
      };

      const mockQuery = {
        maybeSingle: vi.fn().mockResolvedValue(malformedData)
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      const result = await fetchPortfolio(mockUserId);

      expect(result).toEqual({ invalid: 'data' } as any);
    });

    it('should handle empty string userId', async () => {
      const mockSupabaseResponse = {
        data: null,
        error: null
      };

      const mockQuery = {
        maybeSingle: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      const result = await fetchPortfolio('');

      expect(result).toBeNull();
    });

    it('should handle null userId', async () => {
      const mockSupabaseResponse = {
        data: null,
        error: null
      };

      const mockQuery = {
        maybeSingle: vi.fn().mockResolvedValue(mockSupabaseResponse)
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(mockQuery)
        })
      } as any);

      const result = await fetchPortfolio(null as any);

      expect(result).toBeNull();
    });
  });
});
