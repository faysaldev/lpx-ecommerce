"use client";

import { Plus, X } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/UI/button";

import { Input } from "@/components/UI/input";

function TagInput({
  tags,
  onTagsChange,
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (
      inputValue.trim() &&
      !tags.includes(inputValue.trim()) &&
      tags.length < 10
    ) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag (e.g., vintage, rare, pokemon)"
          className="flex-1"
          maxLength={20}
        />
        <Button
          type="button"
          onClick={handleAddTag}
          variant="outline"
          disabled={
            !inputValue.trim() ||
            tags.includes(inputValue.trim()) ||
            tags.length >= 10
          }
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagInput;
