import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePortfolioData } from '../usePortfolioData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('@/hooks/use-toast');
vi.mock('../api/portfolioApi', () => ({
  fetchPortfolio: vi.fn(),
  createPortfolio: vi.fn(),
  updatePortfolio: vi.fn(),
  fetchPortfolioGallery: vi.fn(),
  addGalleryItem: vi.fn(),
  deleteGalleryItem: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);
const mockUseToast = vi.mocked(useToast);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('usePortfolioData', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User',
    },
  };

  const mockPortfolio = {
    id: 'portfolio-id',
    user_id: 'test-user-id',
    name: 'Test Portfolio',
    tagline: 'Test Tagline',
    about: 'Test About',
    services: ['Portrait', 'Wedding'],
    contact: {
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Test City',
    },
    social_links: {
      instagram: '@test',
      facebook: 'test.facebook',
      website: 'https://test.com',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockGalleryItems = [
    {
      id: 'gallery-item-1',
      portfolio_id: 'portfolio-id',
      title: 'Test Image 1',
      description: 'Test Description 1',
      image_url: 'https://example.com/image1.jpg',
      image_alt: 'Test Image 1 Alt',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      profile: null,
      loading: false,
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      bypassAuth: false,
      toggleBypassAuth: vi.fn(),
      userRoles: ['photographer'],
      hasPermission: vi.fn(),
      hasRole: vi.fn(),
    });

    mockUseToast.mockReturnValue({
      toast: vi.fn(),
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.showPreview).toBe(false);
  });

  it('should fetch portfolio data when user is available', async () => {
    const { fetchPortfolio } = await import('../api/portfolioApi');
    vi.mocked(fetchPortfolio).mockResolvedValue(mockPortfolio);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.portfolio).toEqual(mockPortfolio);
    });

    expect(fetchPortfolio).toHaveBeenCalledWith('test-user-id');
  });

  it('should handle portfolio fetch error gracefully', async () => {
    const { fetchPortfolio } = await import('../api/portfolioApi');
    const mockError = new Error('Fetch failed');
    vi.mocked(fetchPortfolio).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.portfolio).toBeUndefined();
    });

    expect(fetchPortfolio).toHaveBeenCalledWith('test-user-id');
  });

  it('should not fetch portfolio when user is not available', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      loading: false,
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      bypassAuth: false,
      toggleBypassAuth: vi.fn(),
      userRoles: [],
      hasPermission: vi.fn(),
      hasRole: vi.fn(),
    });

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.portfolio).toBeUndefined();
  });

  it('should create portfolio successfully', async () => {
    const { createPortfolio } = await import('../api/portfolioApi');
    vi.mocked(createPortfolio).mockResolvedValue(mockPortfolio);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    const portfolioData = {
      name: 'Test Portfolio',
      tagline: 'Test Tagline',
      about: 'Test About',
      services: ['Portrait'],
      contact: {
        email: 'test@example.com',
        phone: '+1234567890',
        location: 'Test City',
      },
      socialLinks: {
        instagram: '@test',
        facebook: '',
        website: '',
      },
    };

    await waitFor(() => {
      result.current.createPortfolioMutation.mutate(portfolioData);
    });

    await waitFor(() => {
      expect(createPortfolio).toHaveBeenCalledWith('test-user-id', portfolioData);
    });
  });

  it('should update portfolio successfully', async () => {
    const { updatePortfolio } = await import('../api/portfolioApi');
    const updatedPortfolio = { ...mockPortfolio, name: 'Updated Portfolio' };
    vi.mocked(updatePortfolio).mockResolvedValue(updatedPortfolio);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    const updateData = {
      name: 'Updated Portfolio',
      tagline: 'Updated Tagline',
      about: 'Updated About',
      services: ['Portrait', 'Wedding'],
      contact: {
        email: 'updated@example.com',
        phone: '+1234567890',
        location: 'Updated City',
      },
      socialLinks: {
        instagram: '@updated',
        facebook: '',
        website: '',
      },
    };

    await waitFor(() => {
      result.current.updatePortfolioMutation.mutate({
        portfolioId: 'portfolio-id',
        portfolio: updateData,
      });
    });

    await waitFor(() => {
      expect(updatePortfolio).toHaveBeenCalledWith('portfolio-id', updateData);
    });
  });

  it('should fetch gallery items successfully', async () => {
    const { fetchPortfolioGallery } = await import('../api/portfolioApi');
    vi.mocked(fetchPortfolioGallery).mockResolvedValue(mockGalleryItems);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.fetchGalleryItems('portfolio-id');
    });

    await waitFor(() => {
      expect(fetchPortfolioGallery).toHaveBeenCalledWith('portfolio-id');
    });
  });

  it('should add gallery item successfully', async () => {
    const { addGalleryItem } = await import('../api/portfolioApi');
    vi.mocked(addGalleryItem).mockResolvedValue(mockGalleryItems[0]);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    const galleryItemData = {
      portfolio_id: 'portfolio-id',
      title: 'New Image',
      description: 'New Description',
      image_url: 'https://example.com/new-image.jpg',
      image_alt: 'New Image Alt',
    };

    await waitFor(() => {
      result.current.addGalleryItemMutation.mutate(galleryItemData);
    });

    await waitFor(() => {
      expect(addGalleryItem).toHaveBeenCalledWith(galleryItemData);
    });
  });

  it('should delete gallery item successfully', async () => {
    const { deleteGalleryItem } = await import('../api/portfolioApi');
    vi.mocked(deleteGalleryItem).mockResolvedValue(undefined);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.deleteGalleryItemMutation.mutate('gallery-item-1');
    });

    await waitFor(() => {
      expect(deleteGalleryItem).toHaveBeenCalledWith('gallery-item-1');
    });
  });

  it('should toggle editing state', () => {
    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isEditing).toBe(false);

    result.current.setIsEditing(true);
    expect(result.current.isEditing).toBe(true);

    result.current.setIsEditing(false);
    expect(result.current.isEditing).toBe(false);
  });

  it('should toggle preview state', () => {
    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.showPreview).toBe(false);

    result.current.setShowPreview(true);
    expect(result.current.showPreview).toBe(true);

    result.current.setShowPreview(false);
    expect(result.current.showPreview).toBe(false);
  });

  it('should handle portfolio creation error', async () => {
    const { createPortfolio } = await import('../api/portfolioApi');
    const mockError = new Error('Creation failed');
    vi.mocked(createPortfolio).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    const portfolioData = {
      name: 'Test Portfolio',
      tagline: 'Test Tagline',
      about: 'Test About',
      services: ['Portrait'],
      contact: {
        email: 'test@example.com',
        phone: '+1234567890',
        location: 'Test City',
      },
      socialLinks: {
        instagram: '@test',
        facebook: '',
        website: '',
      },
    };

    await waitFor(() => {
      result.current.createPortfolioMutation.mutate(portfolioData);
    });

    await waitFor(() => {
      expect(result.current.createPortfolioMutation.isError).toBe(true);
    });
  });

  it('should handle portfolio update error', async () => {
    const { updatePortfolio } = await import('../api/portfolioApi');
    const mockError = new Error('Update failed');
    vi.mocked(updatePortfolio).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    const updateData = {
      name: 'Updated Portfolio',
      tagline: 'Updated Tagline',
      about: 'Updated About',
      services: ['Portrait'],
      contact: {
        email: 'updated@example.com',
        phone: '+1234567890',
        location: 'Updated City',
      },
      socialLinks: {
        instagram: '@updated',
        facebook: '',
        website: '',
      },
    };

    await waitFor(() => {
      result.current.updatePortfolioMutation.mutate({
        portfolioId: 'portfolio-id',
        portfolio: updateData,
      });
    });

    await waitFor(() => {
      expect(result.current.updatePortfolioMutation.isError).toBe(true);
    });
  });

  it('should handle gallery item addition error', async () => {
    const { addGalleryItem } = await import('../api/portfolioApi');
    const mockError = new Error('Add gallery item failed');
    vi.mocked(addGalleryItem).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    const galleryItemData = {
      portfolio_id: 'portfolio-id',
      title: 'New Image',
      description: 'New Description',
      image_url: 'https://example.com/new-image.jpg',
      image_alt: 'New Image Alt',
    };

    await waitFor(() => {
      result.current.addGalleryItemMutation.mutate(galleryItemData);
    });

    await waitFor(() => {
      expect(result.current.addGalleryItemMutation.isError).toBe(true);
    });
  });

  it('should handle gallery item deletion error', async () => {
    const { deleteGalleryItem } = await import('../api/portfolioApi');
    const mockError = new Error('Delete gallery item failed');
    vi.mocked(deleteGalleryItem).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePortfolioData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.deleteGalleryItemMutation.mutate('gallery-item-1');
    });

    await waitFor(() => {
      expect(result.current.deleteGalleryItemMutation.isError).toBe(true);
    });
  });
});
