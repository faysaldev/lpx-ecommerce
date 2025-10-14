"use client";

import { CheckCircle, Tag, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Input } from "@/components/UI/input";

interface PromoCodeProps {
  onApply: (code: string) => { valid: boolean; discount: number };
  currentCode?: string | null;
  onRemove?: () => void;
}

export default function PromoCode({
  onApply,
  currentCode,
  onRemove,
}: PromoCodeProps) {
  const [code, setCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");

  const handleApply = () => {
    if (!code.trim()) {
      setError("Please enter a promo code");
      return;
    }

    setIsApplying(true);
    setError("");

    // Simulate async validation
    setTimeout(() => {
      // if(onApply)
      const result = onApply(code);
      if (!result.valid) {
        setError("Invalid promo code");
      } else {
        setCode("");
      }
      setIsApplying(false);
    }, 500);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
      setCode("");
      setError("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  if (currentCode) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Promo code applied</span>
              <Badge variant="secondary">{currentCode}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Have a promo code?</span>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className={error ? "border-red-500" : ""}
              disabled={isApplying}
            />
            <Button
              onClick={handleApply}
              disabled={!code.trim() || isApplying}
              variant="outline"
            >
              {isApplying ? "Applying..." : "Apply"}
            </Button>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {/* Available Codes Hint (for demo) */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              Try these codes:
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => setCode("SAVE10")}
              >
                SAVE10
              </Badge>
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => setCode("WELCOME15")}
              >
                WELCOME15
              </Badge>
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => setCode("FREESHIP")}
              >
                FREESHIP
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
