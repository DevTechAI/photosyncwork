
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioLink } from "../form/types";
import { X, Youtube, Vimeo, Link, Globe, Instagram } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface PortfolioPageProps {
  portfolioLinks: PortfolioLink[];
  onPortfolioLinksChange: (links: PortfolioLink[]) => void;
  isReadOnly?: boolean;
}

export function PortfolioPage({
  portfolioLinks,
  onPortfolioLinksChange,
  isReadOnly = false,
}: PortfolioPageProps) {
  const [newLink, setNewLink] = useState<Omit<PortfolioLink, "id">>({
    title: "",
    url: "",
    platform: "youtube",
  });

  const platformIcons = {
    youtube: <Youtube className="h-5 w-5 text-red-500" />,
    vimeo: <Vimeo className="h-5 w-5 text-blue-500" />,
    website: <Globe className="h-5 w-5 text-green-500" />,
    instagram: <Instagram className="h-5 w-5 text-pink-500" />,
    other: <Link className="h-5 w-5 text-gray-500" />,
  };

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) return;

    const updatedLinks = [
      ...portfolioLinks,
      { ...newLink, id: uuidv4() },
    ];
    onPortfolioLinksChange(updatedLinks);
    setNewLink({
      title: "",
      url: "",
      platform: "youtube",
      description: "",
    });
  };

  const handleRemoveLink = (id: string) => {
    const updatedLinks = portfolioLinks.filter((link) => link.id !== id);
    onPortfolioLinksChange(updatedLinks);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-light">PORTFOLIO SHOWCASE</h2>
        {!isReadOnly && (
          <p className="text-sm text-muted-foreground mt-2">
            Add links to your portfolio work that you'd like to showcase to your clients.
          </p>
        )}
      </div>

      {!isReadOnly && (
        <Card>
          <CardHeader>
            <CardTitle>Add Portfolio Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Wedding Highlight Film"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Platform</label>
                <Select
                  value={newLink.platform}
                  onValueChange={(value: any) =>
                    setNewLink({ ...newLink, platform: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">URL</label>
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="A brief description of this portfolio item..."
                value={newLink.description || ""}
                onChange={(e) =>
                  setNewLink({ ...newLink, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddLink}>Add Portfolio Item</Button>
          </CardFooter>
        </Card>
      )}

      {portfolioLinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioLinks.map((link) => (
            <Card key={link.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  {platformIcons[link.platform]}
                  {link.title}
                </CardTitle>
                {!isReadOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLink(link.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm truncate text-blue-500 hover:underline">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </div>
                {link.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {link.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No portfolio links have been added yet.
            {!isReadOnly && " Add some links to showcase your work!"}
          </p>
        </div>
      )}
    </div>
  );
}
