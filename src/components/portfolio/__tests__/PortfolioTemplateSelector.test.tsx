import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PortfolioTemplateSelector } from '@/components/portfolio/PortfolioTemplateSelector';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Camera: () => <div data-testid="camera-icon">Camera</div>,
  ChevronLeft: () => <div data-testid="chevron-left">Left</div>,
  ChevronRight: () => <div data-testid="chevron-right">Right</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Mountain: () => <div data-testid="mountain-icon">Mountain</div>,
  ArrowRight: () => <div data-testid="arrow-right">Arrow</div>,
  Palette: () => <div data-testid="palette-icon">Palette</div>,
  Briefcase: () => <div data-testid="briefcase-icon">Briefcase</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  Home: () => <div data-testid="home-icon">Home</div>,
  Star: () => <div data-testid="star-icon">Star</div>,
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: any) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: any) => (
    <h3 data-testid="card-title">{children}</h3>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PortfolioTemplateSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with title and description', () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    expect(screen.getByText('Select Portfolio Template')).toBeInTheDocument();
    expect(screen.getByText('Choose a template that best fits your photography style and brand')).toBeInTheDocument();
  });

  it('should display template carousel with navigation arrows', () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Check for navigation arrows
    const leftArrow = screen.getByTestId('chevron-left');
    const rightArrow = screen.getByTestId('chevron-right');
    
    expect(leftArrow).toBeInTheDocument();
    expect(rightArrow).toBeInTheDocument();
  });

  it('should show template counter', () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Should show "1-3 of 8" initially
    expect(screen.getByText('1-3 of 8')).toBeInTheDocument();
  });

  it('should display templates with correct information', () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Check for template names
    expect(screen.getByText('Wedding Photography')).toBeInTheDocument();
    expect(screen.getByText('Corporate Events')).toBeInTheDocument();
    expect(screen.getByText('Portrait Studio')).toBeInTheDocument();
  });

  it('should handle template selection', async () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Click on a template
    const weddingTemplate = screen.getByText('Wedding Photography');
    fireEvent.click(weddingTemplate);
    
    // Should show preview on the right side
    await waitFor(() => {
      expect(screen.getByText('Wedding Photography')).toBeInTheDocument();
    });
  });

  it('should handle double-click to proceed', async () => {
    const mockOnTemplateSelect = vi.fn();
    renderWithRouter(<PortfolioTemplateSelector onTemplateSelect={mockOnTemplateSelect} />);
    
    // Double-click on a template
    const weddingTemplate = screen.getByText('Wedding Photography');
    fireEvent.doubleClick(weddingTemplate);
    
    // Should call the onTemplateSelect callback
    await waitFor(() => {
      expect(mockOnTemplateSelect).toHaveBeenCalled();
    });
  });

  it('should navigate to template page on double-click when no callback provided', async () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Double-click on a template
    const weddingTemplate = screen.getByText('Wedding Photography');
    fireEvent.doubleClick(weddingTemplate);
    
    // Should navigate to template page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/portfolio/template/wedding');
    });
  });

  it('should handle navigation arrows correctly', () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    const leftArrow = screen.getByTestId('chevron-left');
    const rightArrow = screen.getByTestId('chevron-right');
    
    // Left arrow should be disabled initially
    expect(leftArrow).toBeDisabled();
    
    // Right arrow should be enabled
    expect(rightArrow).not.toBeDisabled();
  });

  it('should update template counter when navigating', () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    const rightArrow = screen.getByTestId('chevron-right');
    
    // Click right arrow
    fireEvent.click(rightArrow);
    
    // Counter should update to "2-4 of 8"
    expect(screen.getByText('2-4 of 8')).toBeInTheDocument();
  });

  it('should show template preview when template is selected', async () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Click on a template
    const weddingTemplate = screen.getByText('Wedding Photography');
    fireEvent.click(weddingTemplate);
    
    // Should show preview section
    await waitFor(() => {
      expect(screen.getByText('Wedding Photography')).toBeInTheDocument();
      expect(screen.getByText('Perfect for wedding photographers who want to showcase their romantic and elegant work')).toBeInTheDocument();
    });
  });

  it('should show empty state when no template is selected', () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Should show empty state placeholder
    expect(screen.getByText('Select a Template')).toBeInTheDocument();
    expect(screen.getByText('Choose a template from the left to see a preview here')).toBeInTheDocument();
  });

  it('should display template features correctly', async () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Click on wedding template
    const weddingTemplate = screen.getByText('Wedding Photography');
    fireEvent.click(weddingTemplate);
    
    // Should show features
    await waitFor(() => {
      expect(screen.getByText('Romantic Gallery')).toBeInTheDocument();
      expect(screen.getByText('Couple Stories')).toBeInTheDocument();
      expect(screen.getByText('Testimonials')).toBeInTheDocument();
    });
  });

  it('should handle proceed button click', async () => {
    const mockOnTemplateSelect = vi.fn();
    renderWithRouter(<PortfolioTemplateSelector onTemplateSelect={mockOnTemplateSelect} />);
    
    // Select a template first
    const weddingTemplate = screen.getByText('Wedding Photography');
    fireEvent.click(weddingTemplate);
    
    // Wait for preview to appear
    await waitFor(() => {
      expect(screen.getByText('Proceed with Wedding Photography')).toBeInTheDocument();
    });
    
    // Click proceed button
    const proceedButton = screen.getByText('Proceed with Wedding Photography');
    fireEvent.click(proceedButton);
    
    // Should call the callback
    expect(mockOnTemplateSelect).toHaveBeenCalled();
  });

  it('should disable navigation arrows at boundaries', () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    const leftArrow = screen.getByTestId('chevron-left');
    const rightArrow = screen.getByTestId('chevron-right');
    
    // Initially, left should be disabled, right should be enabled
    expect(leftArrow).toBeDisabled();
    expect(rightArrow).not.toBeDisabled();
    
    // Click right arrow multiple times to reach the end
    for (let i = 0; i < 6; i++) {
      fireEvent.click(rightArrow);
    }
    
    // Now right should be disabled
    expect(rightArrow).toBeDisabled();
  });

  it('should render all template categories correctly', () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Check for different template categories
    expect(screen.getByText('Wedding')).toBeInTheDocument();
    expect(screen.getByText('Corporate')).toBeInTheDocument();
    expect(screen.getByText('Portrait')).toBeInTheDocument();
    expect(screen.getByText('Real Estate')).toBeInTheDocument();
    expect(screen.getByText('Event')).toBeInTheDocument();
    expect(screen.getByText('Fashion')).toBeInTheDocument();
  });

  it('should handle template selection visual feedback', async () => {
    renderWithRouter(<PortfolioTemplateSelector />);
    
    // Click on a template
    const weddingTemplate = screen.getByText('Wedding Photography');
    fireEvent.click(weddingTemplate);
    
    // Should show selection indicator (the dot)
    await waitFor(() => {
      const selectionIndicator = screen.getByText('Wedding Photography').closest('[class*="ring-2"]');
      expect(selectionIndicator).toBeInTheDocument();
    });
  });
});
