import { useState } from "react";
import { Search, Shield, TrendingUp } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ResultCard } from "@/components/ResultCard";
import { ProofModal } from "@/components/ProofModal";
import { VectorBackground } from "@/components/VectorBackground";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const mockResults = [
  {
    id: "1",
    title: "Miso Ramen Broth",
    description: "Rich, umami-packed Japanese soup base made with fermented soybean paste, perfect for authentic ramen dishes.",
    similarity: 0.92,
    distance: 0.156,
    verified: true,
    commitmentHash: "3197a8f2b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0d40a",
  },
  {
    id: "2", 
    title: "Soy-Based Dashi Stock",
    description: "Traditional Japanese cooking stock enhanced with soy elements, providing deep flavor foundation for soups and broths.",
    similarity: 0.87,
    distance: 0.243,
    verified: true,
    commitmentHash: "4298b9f3c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1e51b",
  },
  {
    id: "3",
    title: "Tempeh Marinade Base", 
    description: "Fermented soy protein preparation with complex flavors, commonly used in Indonesian and plant-based cuisine.",
    similarity: 0.78,
    distance: 0.387,
    verified: false,
    commitmentHash: "5399c0f4d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2f62c",
  },
];

const mockProofSteps = [
  {
    stepNumber: 1,
    batchHash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    batchSize: 10000,
    inCommit: "f1e2d3c4b5a6789012345678901234567890fedcba1234567890fedcba123456", 
    outCommit: "9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef",
    queryCommit: "5555aaaa1111bbbb5555aaaa1111bbbb5555aaaa1111bbbb5555aaaa1111bbbb",
    canReveal: true,
  },
  {
    stepNumber: 2,
    batchHash: "b2c3d4e5f6a1789012345678901234567890bcdef21234567890bcdef2123456",
    batchSize: 5000,
    inCommit: "e2d3c4b5a6f1789012345678901234567890edcba21234567890edcba2123456",
    outCommit: "8765432109abcdef8765432109abcdef8765432109abcdef8765432109abcdef", 
    queryCommit: "4444aaaa2222bbbb4444aaaa2222bbbb4444aaaa2222bbbb4444aaaa2222bbbb",
    canReveal: false,
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockResults>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1500);
  };

  const handleViewProof = (resultId: string) => {
    setSelectedProof(resultId);
  };

  const handleCloseProof = () => {
    setSelectedProof(null);
  };

  const selectedResult = mockResults.find(r => r.id === selectedProof);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative texture-overlay border-b border-border">
        <VectorBackground />
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl heading-editorial text-foreground">
                Aligned VNNs
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Search vectors with <em>verifiable</em> results. Every search is cryptographically proven 
                and submitted to zk verify for transparent verification.
              </p>
            </div>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Cryptographically verified
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Similarity scoring
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Exhaustive search
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {(searchResults.length > 0 || isLoading) && (
        <div className="container mx-auto px-6 py-12">
          <div className="space-y-6">
            {searchQuery && (
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">
                  Results for "{searchQuery}"
                </h2>
                {searchResults.length > 0 && !isLoading && (
                  <span className="text-sm text-muted-foreground">
                    {searchResults.length} results found
                  </span>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-tactile p-6 animate-pulse">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="h-6 bg-muted/20 rounded w-1/3"></div>
                        <div className="h-6 bg-muted/20 rounded w-20"></div>
                      </div>
                      <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                      <div className="h-4 bg-muted/20 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <ResultCard
                    key={result.id}
                    {...result}
                    onViewProof={handleViewProof}
                    onOpenDataset={(id) => console.log(`Open dataset for ${id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* How it Works Section */}
      {searchResults.length === 0 && !isLoading && (
        <div className="relative container mx-auto px-6 py-16">
          {/* Subtle background elements for this section */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
              className="absolute bottom-10 right-20 w-20 h-20 text-primary/4 transform rotate-45"
              viewBox="0 0 80 80"
              fill="none"
            >
              <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="0.8" fill="none" />
              <circle cx="40" cy="40" r="10" stroke="currentColor" strokeWidth="0.6" fill="none" />
              <circle cx="40" cy="40" r="2" fill="currentColor" />
            </svg>
          </div>
          <div className="text-center space-y-8">
            <h2 className="text-3xl heading-editorial text-foreground">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Submit Query</h3>
                <p className="text-muted-foreground text-sm">
                  Enter your search terms. We convert them into vector embeddings for similarity matching.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Recursive Search</h3>
                <p className="text-muted-foreground text-sm">
                  Our system searches committed index batches recursively, generating cryptographic proofs at each step.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Verify Results</h3>
                <p className="text-muted-foreground text-sm">
                  All proofs are submitted to zk verify, making results publicly verifiable and tamper-evident.
                </p>
              </div>
            </div>
            <Button variant="outline" size="lg" className="mt-8">
              Learn More About Verification
            </Button>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {selectedResult && (
        <ProofModal
          isOpen={!!selectedProof}
          onClose={handleCloseProof}
          resultTitle={selectedResult.title}
          proofSteps={mockProofSteps}
          finalCommitment={selectedResult.commitmentHash}
          generatedAt="2024-09-25 14:30:22 UTC"
          processingTime="2.3 seconds"
          alignedLayerUrl="https://aligned.dev/explorer/batch/abc123"
        />
      )}
    </div>
  );
};

export default Index;
