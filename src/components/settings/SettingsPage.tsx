
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SettingsData, CustomService } from "../estimates/form/types";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_COMPANY_INTRO = `We are a Hyderabad based Wedding Photography firm with over 11 years of experience in non-meddling, 
inventive, photojournalistic approach. We need you to recollect how you felt on your big day. At each 
wedding, We plan to archive genuine minutes and crude feelings in new and remarkable manners.`;

const DEFAULT_TERMS = [
  "This estimate is valid for 30 days from the date of issue.",
  "A 50% advance payment is required to confirm the booking.",
  "The balance payment is due before the event date."
];

const DEFAULT_SERVICES: Record<string, CustomService> = {
  bigFat: {
    title: "BigFat Weddings",
    items: [
      "Candid Photography",
      "Cinematography",
      "Traditional Photography",
      "Traditional Videography",
      "Premium Albums",
      "Cloud Gallery"
    ]
  },
  intimate: {
    title: "Intimate Weddings",
    items: [
      "Candid Photography",
      "Cinematography",
      "Cloud Gallery"
    ]
  },
  addons: {
    title: "Optional Addons",
    items: [
      "Evite (E-invitations) - starts from 2,000/-",
      "LED Screen 25,000/-",
      "Live Streaming HD - 15,000/-",
      "Traditional Video coverage - 30,000/- Per Day",
      "Traditional Photo - 20,000/- Per Day",
      "Albums - 25,000/- (35-40 sheets)"
    ]
  }
};

export function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsData>({
    terms: [...DEFAULT_TERMS],
    services: JSON.parse(JSON.stringify(DEFAULT_SERVICES)), // Deep copy
    companyIntro: DEFAULT_COMPANY_INTRO
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTerm, setNewTerm] = useState("");
  const [newServiceKey, setNewServiceKey] = useState("");
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [tempServiceItem, setTempServiceItem] = useState("");
  const [editingServiceKey, setEditingServiceKey] = useState<string | null>(null);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // First try to load from Supabase
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error loading settings from Supabase:", error);
          throw error;
        }
        
        // If found in Supabase, use that
        if (data) {
          setSettings(data.settings);
        } else {
          // Fallback to localStorage
          const savedSettings = localStorage.getItem("studiosync_settings");
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error loading settings",
          description: "Using default settings instead.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);
  
  // Save settings
  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage as fallback
      localStorage.setItem("studiosync_settings", JSON.stringify(settings));
      
      // Try to save to Supabase if available
      try {
        const { data, error } = await supabase
          .from('settings')
          .upsert({ 
            id: 1, // Single settings record
            settings: settings,
            updated_at: new Date().toISOString()
          });
          
        if (error) throw error;
      } catch (supabaseError) {
        console.warn("Could not save to Supabase, using localStorage only:", supabaseError);
      }
      
      toast({
        title: "Settings saved",
        description: "Your custom settings have been saved successfully."
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Could not save your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Terms management
  const addTerm = () => {
    if (!newTerm.trim()) return;
    setSettings({
      ...settings,
      terms: [...settings.terms, newTerm]
    });
    setNewTerm("");
  };
  
  const removeTerm = (index: number) => {
    const updatedTerms = [...settings.terms];
    updatedTerms.splice(index, 1);
    setSettings({
      ...settings,
      terms: updatedTerms
    });
  };
  
  // Service management
  const addService = () => {
    if (!newServiceKey.trim() || !newServiceTitle.trim()) return;
    
    // Make sure key is unique and in the right format
    const key = newServiceKey.trim().replace(/\s+/g, '_').toLowerCase();
    
    if (settings.services[key]) {
      toast({
        title: "Service key already exists",
        description: "Please use a unique identifier for the service.",
        variant: "destructive",
      });
      return;
    }
    
    setSettings({
      ...settings,
      services: {
        ...settings.services,
        [key]: {
          title: newServiceTitle,
          items: []
        }
      }
    });
    
    setNewServiceKey("");
    setNewServiceTitle("");
    setEditingServiceKey(key);
  };
  
  const removeService = (key: string) => {
    const updatedServices = { ...settings.services };
    delete updatedServices[key];
    setSettings({
      ...settings,
      services: updatedServices
    });
    
    if (editingServiceKey === key) {
      setEditingServiceKey(null);
    }
  };
  
  const selectServiceToEdit = (key: string) => {
    setEditingServiceKey(key);
    setTempServiceItem("");
  };
  
  const addServiceItem = () => {
    if (!editingServiceKey || !tempServiceItem.trim()) return;
    
    const updatedServices = { ...settings.services };
    updatedServices[editingServiceKey].items.push(tempServiceItem);
    
    setSettings({
      ...settings,
      services: updatedServices
    });
    
    setTempServiceItem("");
  };
  
  const removeServiceItem = (serviceKey: string, itemIndex: number) => {
    const updatedServices = { ...settings.services };
    updatedServices[serviceKey].items.splice(itemIndex, 1);
    
    setSettings({
      ...settings,
      services: updatedServices
    });
  };
  
  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading settings...</div>;
  }
  
  return (
    <div className="container max-w-5xl py-10 animate-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize your application's terms, services, and other details
        </p>
      </div>
      
      <Tabs defaultValue="intro" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="intro">Company Introduction</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        {/* Company Introduction Tab */}
        <TabsContent value="intro">
          <Card>
            <CardHeader>
              <CardTitle>Company Introduction</CardTitle>
              <CardDescription>
                This text will appear in the introduction section of your estimates and emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  value={settings.companyIntro}
                  onChange={(e) => setSettings({...settings, companyIntro: e.target.value})}
                  placeholder="Enter your company introduction"
                  className="min-h-[200px]"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={saveSettings} 
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Terms Tab */}
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
              <CardDescription>
                Customize the terms that will appear in your estimates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  {settings.terms.map((term, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={term}
                        onChange={(e) => {
                          const updatedTerms = [...settings.terms];
                          updatedTerms[index] = e.target.value;
                          setSettings({...settings, terms: updatedTerms});
                        }}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeTerm(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <Input 
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="Add a new term"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTerm();
                      }
                    }}
                  />
                  <Button onClick={addTerm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={saveSettings} 
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                Manage the service packages that you offer to clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6">
                {/* Service List */}
                <div className="sm:col-span-1 space-y-4">
                  <h3 className="font-medium">Service Packages</h3>
                  
                  <div className="space-y-2">
                    {Object.entries(settings.services).map(([key, service]) => (
                      <div 
                        key={key}
                        className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${
                          editingServiceKey === key ? 'bg-muted border-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => selectServiceToEdit(key)}
                      >
                        <div>
                          <p className="font-medium">{service.title}</p>
                          <p className="text-xs text-muted-foreground">{service.items.length} items</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeService(key);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-medium">Add New Service</h4>
                    <Input 
                      value={newServiceKey}
                      onChange={(e) => setNewServiceKey(e.target.value)}
                      placeholder="Service Key (e.g. premium)"
                      className="mb-2"
                    />
                    <Input 
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      placeholder="Service Title"
                      className="mb-2"
                    />
                    <Button 
                      onClick={addService} 
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </div>
                
                {/* Service Items Editor */}
                <div className="sm:col-span-2 space-y-4">
                  <h3 className="font-medium">
                    {editingServiceKey 
                      ? `Edit ${settings.services[editingServiceKey]?.title || editingServiceKey}` 
                      : 'Select a service to edit its items'}
                  </h3>
                  
                  {editingServiceKey ? (
                    <>
                      <div className="space-y-2">
                        {settings.services[editingServiceKey].items.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              value={item}
                              onChange={(e) => {
                                const updatedServices = { ...settings.services };
                                updatedServices[editingServiceKey].items[index] = e.target.value;
                                setSettings({
                                  ...settings,
                                  services: updatedServices
                                });
                              }}
                              className="flex-1"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeServiceItem(editingServiceKey, index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input 
                          value={tempServiceItem}
                          onChange={(e) => setTempServiceItem(e.target.value)}
                          placeholder="Add a new item to this service"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addServiceItem();
                            }
                          }}
                        />
                        <Button onClick={addServiceItem}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-40 border rounded-md bg-muted/30">
                      <p className="text-muted-foreground">Select a service package from the list to edit its items</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={saveSettings} 
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
