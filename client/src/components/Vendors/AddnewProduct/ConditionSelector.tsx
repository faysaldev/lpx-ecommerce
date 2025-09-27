"use client";

import { Label } from "@/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { useState } from "react";

function ConditionSelector({
  value,
  onChange,
  gradedConditions,
  rawConditions,
}: {
  value: string;
  onChange: (value: string) => void;
  gradedConditions: string[];
  rawConditions: string[];
}) {
  const [conditionType, setConditionType] = useState<"raw" | "graded">(
    gradedConditions.includes(value) ? "graded" : "raw"
  );

  const handleConditionTypeChange = (type: "raw" | "graded") => {
    setConditionType(type);
    // Reset condition when switching type
    onChange("");
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Condition Type *</Label>
        <RadioGroup
          value={conditionType}
          onValueChange={(value: "raw" | "graded") =>
            handleConditionTypeChange(value)
          }
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="raw" id="raw" />
            <Label htmlFor="raw">Raw</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="graded" id="graded" />
            <Label htmlFor="graded">Graded</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="condition">Condition *</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder={`Select ${conditionType} condition`} />
          </SelectTrigger>
          <SelectContent>
            {conditionType === "raw"
              ? rawConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))
              : gradedConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default ConditionSelector;
