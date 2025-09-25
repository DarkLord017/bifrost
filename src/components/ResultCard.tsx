import { useState } from "react";
import { Shield, ShieldCheck, Copy, ExternalLink, Eye, TrendingUp, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ResultCardProps {
  id: string;
  title: string;
  description: string;
  similarity: number;
  distance: number;
  verified: boolean;
  commitmentHash: string;
  onViewProof: (id: string) => void;
  onOpenDataset?: (id: string) => void;
}

export function ResultCard({
  id,
  title,
  description,
  similarity,
  distance,
  verified,
  commitmentHash,
  onViewProof,
  onOpenDataset,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCommitment = async () => {
    try {
      await navigator.clipboard.writeText(commitmentHash);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Commitment hash copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const truncatedHash = `${commitmentHash.slice(0, 6)}…${commitmentHash.slice(-6)}`;

  return (
    <div className="card-tactile p-6 space-y-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <div className={verified ? "proof-verified" : "proof-unverified"}>
            {verified ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                Verified
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Unverified
              </>
            )}
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="metric-item">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">{(similarity * 100).toFixed(1)}%</span>
          <span className="text-muted">similarity</span>
        </div>
        <div className="metric-item">
          <Ruler className="w-4 h-4" />
          <span className="font-medium">{distance.toFixed(3)}</span>
          <span className="text-muted">distance</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Commitment:</span>
            <button
              onClick={handleCopyCommitment}
              className="hash-display"
              title={commitmentHash}
            >
              {truncatedHash}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onViewProof(id)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Proof
          </Button>
          
          {onOpenDataset && (
            <Button
              onClick={() => onOpenDataset(id)}
              variant="ghost"
              size="sm"
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Dataset
            </Button>
          )}
          
          <Button
            onClick={handleCopyCommitment}
            variant="ghost"
            size="sm"
            className="px-3"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}