import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Clock, Hash, ExternalLink, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface ProofStep {
  stepNumber: number;
  batchHash: string;
  batchSize: number;
  inCommit: string;
  outCommit: string;
  queryCommit: string;
  canReveal: boolean;
  revealed?: boolean;
  plaintextVectors?: Array<{ id: string; data: number[] }>;
}

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultTitle: string;
  proofSteps: ProofStep[];
  finalCommitment: string;
  generatedAt: string;
  processingTime: string;
  alignedLayerUrl?: string;
}

export function ProofModal({
  isOpen,
  onClose,
  resultTitle,
  proofSteps,
  finalCommitment,
  generatedAt,
  processingTime,
  alignedLayerUrl,
}: ProofModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showRawHashes, setShowRawHashes] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${label} copied successfully`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleReveal = (stepNumber: number) => {
    setRevealedSteps(prev => new Set([...prev, stepNumber]));
    toast({
      title: "Vectors revealed",
      description: "Plaintext vectors are now visible",
    });
  };

  const truncateHash = (hash: string) => 
    showRawHashes ? hash : `${hash.slice(0, 8)}…${hash.slice(-8)}`;

  const currentProofStep = proofSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-2xl heading-editorial">
            Proof Explorer: {resultTitle}
          </DialogTitle>
          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Generated: {generatedAt}
            </div>
            <div className="flex items-center gap-1">
              <Hash className="w-4 h-4" />
              Steps: {proofSteps.length}
            </div>
            <div>Processing: {processingTime}</div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="card-tactile p-4 bg-primary/5 border-primary/20">
            <p className="text-sm text-foreground">
              This result was produced by recursively searching committed batches and submitted to Aligned Layer for verifiable proof.
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recursive Proof Steps</h3>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="px-3 py-1 bg-muted/20 rounded text-sm">
                Step {currentStep + 1} of {proofSteps.length}
              </span>
              <Button
                onClick={() => setCurrentStep(Math.min(proofSteps.length - 1, currentStep + 1))}
                disabled={currentStep === proofSteps.length - 1}
                variant="outline"
                size="sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Current Step Details */}
          {currentProofStep && (
            <div className="card-tactile p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Step {currentProofStep.stepNumber}</h4>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowRawHashes(!showRawHashes)}
                    variant="ghost"
                    size="sm"
                  >
                    {showRawHashes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showRawHashes ? "Hide" : "Show"} Raw
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Batch Hash</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="hash-display flex-1">{truncateHash(currentProofStep.batchHash)}</code>
                      <Button
                        onClick={() => handleCopy(currentProofStep.batchHash, "Batch hash")}
                        variant="ghost"
                        size="sm"
                        className="px-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">In-Commit</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="hash-display flex-1">{truncateHash(currentProofStep.inCommit)}</code>
                      <Button
                        onClick={() => handleCopy(currentProofStep.inCommit, "In-commit")}
                        variant="ghost"
                        size="sm"
                        className="px-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Out-Commit</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="hash-display flex-1">{truncateHash(currentProofStep.outCommit)}</code>
                      <Button
                        onClick={() => handleCopy(currentProofStep.outCommit, "Out-commit")}
                        variant="ghost"
                        size="sm"
                        className="px-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Query-Commit</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="hash-display flex-1">{truncateHash(currentProofStep.queryCommit)}</code>
                      <Button
                        onClick={() => handleCopy(currentProofStep.queryCommit, "Query-commit")}
                        variant="ghost"
                        size="sm"
                        className="px-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Batch Size</label>
                    <div className="mt-1">
                      <span className="px-3 py-1 bg-muted/10 rounded text-sm font-mono">
                        {currentProofStep.batchSize.toLocaleString()} items
                      </span>
                    </div>
                  </div>

                  {currentProofStep.canReveal && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Plaintext Vectors</label>
                      <div className="mt-1">
                        {revealedSteps.has(currentProofStep.stepNumber) ? (
                          <div className="text-sm text-success">
                            ✓ Vectors revealed (owner only)
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleReveal(currentProofStep.stepNumber)}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Reveal
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Final Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Final Output Commitment</label>
              <div className="flex items-center gap-2">
                <code className="hash-display">{truncateHash(finalCommitment)}</code>
                <Button
                  onClick={() => handleCopy(finalCommitment, "Final commitment")}
                  variant="ghost"
                  size="sm"
                  className="px-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {alignedLayerUrl && (
              <Button
                onClick={() => window.open(alignedLayerUrl, '_blank')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Verify on Aligned Layer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}