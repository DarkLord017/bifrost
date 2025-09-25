import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const exampleQueries = [
  "Japanese broth made with fermented soy",
  "Red wine from Bordeaux region", 
  "Chocolate dessert with espresso",
  "Citrus fruits high in vitamin C"
];

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items — e.g. 'Japanese broth made with fermented soy'"
            className="search-input pl-14 pr-32"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Searching
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-muted-foreground mr-2">Try:</span>
        {exampleQueries.map((example, index) => (
          <button
            key={index}
            onClick={() => handleExampleClick(example)}
            className="px-3 py-1.5 text-sm bg-surface border border-border rounded-full 
                     hover:border-primary/30 hover:bg-primary/5 transition-all duration-200
                     text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}