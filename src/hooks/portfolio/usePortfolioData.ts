import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchPortfolio, 
  createPortfolio, 
  updatePortfolio,
  fetchPortfolioGallery,
  addGalleryItem,
  deleteGalleryItem
} from "./api/portfolioApi";
import { Portfolio, PortfolioGalleryItem, PortfolioFormData } from "@/types/portfolio";
import { useToast } from "@/hooks/use-toast";

export function usePortfolioData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch portfolio
  const { 
    data: portfolio, 
    isLoading: isLoadingPortfolio,
    refetch: refetchPortfolio
  } = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: () => user ? fetchPortfolio(user.id) : null,
    enabled: !!user,
    onError: (error: any) => {
      console.error("Error fetching portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data",
        variant: "destructive"
      });
    }
  });

  // Fetch gallery items
  const { 
    data: galleryItems = [], 
    isLoading: isLoadingGallery,
    refetch: refetchGallery
  } = useQuery({
    queryKey: ['portfolioGallery', portfolio?.id],
    queryFn: () => portfolio ? fetchPortfolioGallery(portfolio.id) : [],
    enabled: !!portfolio,
    onError: (error: any) => {
      console.error("Error fetching gallery items:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolio gallery",
        variant: "destructive"
      });
    }
  });

  // Create portfolio mutation
  const createPortfolioMutation = useMutation({
    mutationFn: (portfolioData: PortfolioFormData) => 
      user ? createPortfolio(user.id, portfolioData) : Promise.reject("No user"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Portfolio Created",
        description: "Your portfolio has been created successfully"
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive"
      });
    }
  });

  // Update portfolio mutation
  const updatePortfolioMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PortfolioFormData }) => 
      updatePortfolio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Portfolio Updated",
        description: "Your portfolio has been updated successfully"
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update portfolio",
        variant: "destructive"
      });
    }
  });

  // Add gallery item mutation
  const addGalleryItemMutation = useMutation({
    mutationFn: (item: Omit<PortfolioGalleryItem, 'id' | 'created_at' | 'updated_at'>) => 
      addGalleryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioGallery'] });
      toast({
        title: "Image Added",
        description: "Image has been added to your portfolio gallery"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add image to gallery",
        variant: "destructive"
      });
    }
  });

  // Delete gallery item mutation
  const deleteGalleryItemMutation = useMutation({
    mutationFn: (itemId: string) => deleteGalleryItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioGallery'] });
      toast({
        title: "Image Removed",
        description: "Image has been removed from your portfolio gallery"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to remove image from gallery",
        variant: "destructive"
      });
    }
  });

  // Combined portfolio data with gallery items
  const [portfolioData, setPortfolioData] = useState<{
    name: string;
    tagline: string;
    about: string;
    services: string[];
    contact: {
      email: string;
      phone: string;
      location: string;
    };
    socialLinks: {
      instagram: string;
      facebook: string;
      website: string;
    };
    gallery: Array<{
      id: string;
      url: string;
      title: string;
      category: string;
    }>;
  }>({
    name: "",
    tagline: "",
    about: "",
    services: [],
    contact: {
      email: "",
      phone: "",
      location: ""
    },
    socialLinks: {
      instagram: "",
      facebook: "",
      website: ""
    },
    gallery: []
  });

  // Update portfolioData when portfolio or gallery items change
  useEffect(() => {
    if (portfolio) {
      setPortfolioData(prev => ({
        ...prev,
        name: portfolio.name,
        tagline: portfolio.tagline,
        about: portfolio.about,
        services: portfolio.services,
        contact: portfolio.contact,
        socialLinks: portfolio.socialLinks
      }));
    } else if (user) {
      // If no portfolio exists, populate contact info from user profile
      setPortfolioData(prev => ({
        ...prev,
        contact: {
          email: user.email || "",
          phone: "",
          location: ""
        }
      }));
    }
  }, [portfolio, user]);

  useEffect(() => {
    if (galleryItems.length > 0) {
      setPortfolioData(prev => ({
        ...prev,
        gallery: galleryItems.map(item => ({
          id: item.id,
          url: item.url,
          title: item.title,
          category: item.category
        }))
      }));
    }
  }, [galleryItems]);

  // Handle saving portfolio
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your portfolio",
        variant: "destructive"
      });
      return;
    }

    const portfolioFormData: PortfolioFormData = {
      name: portfolioData.name,
      tagline: portfolioData.tagline,
      about: portfolioData.about,
      services: portfolioData.services,
      contact: {
        email: portfolioData.contact.email || user.email || "",
        phone: portfolioData.contact.phone || "",
        location: portfolioData.contact.location || ""
      },
      socialLinks: portfolioData.socialLinks
    };

    if (portfolio) {
      // Update existing portfolio
      updatePortfolioMutation.mutate({ 
        id: portfolio.id, 
        data: portfolioFormData 
      });
    } else {
      // Create new portfolio
      createPortfolioMutation.mutate(portfolioFormData);
    }
  };

  // Handle adding a gallery item
  const handleAddGalleryItem = (item: {
    url: string;
    title: string;
    category: string;
  }) => {
    if (!portfolio) {
      toast({
        title: "Portfolio Required",
        description: "Please create a portfolio first",
        variant: "destructive"
      });
      return;
    }

    addGalleryItemMutation.mutate({
      portfolio_id: portfolio.id,
      url: item.url,
      title: item.title,
      category: item.category
    });
  };

  // Handle removing a gallery item
  const handleRemoveGalleryItem = (itemId: string) => {
    deleteGalleryItemMutation.mutate(itemId);
  };

  return {
    portfolioData,
    setPortfolioData,
    isLoading: isLoadingPortfolio || isLoadingGallery,
    isEditing,
    setIsEditing,
    showPreview,
    setShowPreview,
    handleSave,
    handleAddGalleryItem,
    handleRemoveGalleryItem,
    refetchPortfolio,
    refetchGallery,
    hasPortfolio: !!portfolio
  };
}