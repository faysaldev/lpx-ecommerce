/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plus, X, Search } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import {
  useAddTagMutation,
  useGetTagsQuery,
} from "@/redux/features/products/product";
import { Badge } from "@/components/UI/badge";

function TagInput({
  tags,
  onTagsChange,
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [error, setError] = useState<string | null>(null); // For error handling
  const inputRef = useRef<HTMLInputElement>(null);

  const [addTag] = useAddTagMutation();
  const { data: fetchedTags, isLoading } = useGetTagsQuery(inputValue, {
    skip: inputValue.length < 2, // Only fetch when user types at least 2 characters
  });

  const suggestions = fetchedTags?.data?.attributes || [];

  const handleAddTag = async (tagToAdd?: string) => {
    const tag = tagToAdd || inputValue.trim();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      try {
        onTagsChange([...tags, tag]);
        setInputValue("");
        setIsPopoverOpen(false);
        setError(null); // Reset error state if successful
        // Only save to backend if it's a new tag (not from suggestions)
        if (!suggestions.includes(tag)) {
          await addTag(tag);
        }
      } catch (error) {
        console.error("Failed to add tag", error);
        setError("Failed to add tag. Please try again."); // Set error state on failure
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Escape") {
      setIsPopoverOpen(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSuggestionSelect = async (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      onTagsChange([...tags, suggestion]);
      setInputValue("");
      setIsPopoverOpen(false);
    }
  };

  const canAddTag =
    inputValue.trim() && !tags.includes(inputValue.trim()) && tags.length < 10;

  return (
    <div className="space-y-3">
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="px-3 py-1.5 text-sm font-medium bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 transition-colors"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 hover:text-red-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <div className="text-xs text-gray-400 self-center">
            {tags.length}/10 tags
          </div>
        </div>
      )}

      {/* Input with Suggestions */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsPopoverOpen(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => inputValue.length > 0 && setIsPopoverOpen(true)}
            placeholder="Add tags (e.g., vintage, rare, pokemon)"
            className="flex-1 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={20}
          />
          <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <Button
          type="button"
          onClick={() => handleAddTag()}
          variant="default"
          disabled={!canAddTag}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700 disabled:text-gray-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Tag</span>
        </Button>
      </div>

      {/* Helper Text */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Press Enter to add tags • Max 10 tags</span>
        <span>{inputValue.length}/20 characters</span>
      </div>

      {/* Quick Suggestions */}

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((popularTag: any) => (
            <Badge
              key={popularTag}
              variant="outline"
              className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => handleSuggestionSelect(popularTag)}
            >
              {popularTag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TagInput;

// "use client";

// import { Plus, X } from "lucide-react";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/UI/button";
// import { Input } from "@/components/UI/input";
// import {
//   useAddTagMutation,
//   useGetTagsQuery,
// } from "@/redux/features/products/product";
// function TagInput({
//   tags,
//   onTagsChange,
// }: {
//   tags: string[];
//   onTagsChange: (tags: string[]) => void;
// }) {
//   const [inputValue, setInputValue] = useState("");
//   const [suggestions, setSuggestions] = useState<string[]>([]);

//   const [addTag] = useAddTagMutation(); // Mutation to add a new tag

//   const { data: fetchedTags, isLoading } = useGetTagsQuery(inputValue); // Fetch tags based on input

//   // Effect to update suggestions based on the fetched data
//   useEffect(() => {
//     if (fetchedTags?.data?.attributes) {
//       setSuggestions(fetchedTags?.data?.attributes);
//     }
//   }, [fetchedTags]);

//   const handleAddTag = async () => {
//     const trimmedTag = inputValue.trim();
//     if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
//       try {
//         // Add the tag to the frontend
//         onTagsChange([...tags, trimmedTag]);
//         setInputValue("");

//         // Save the new tag to the backend
//         await addTag(trimmedTag);
//       } catch (error) {
//         console.error("Failed to add tag", error);
//       }
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddTag();
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     onTagsChange(tags.filter((tag) => tag !== tagToRemove));
//   };

//   const handleTagSuggestionClick = async (suggestion: string) => {
//     if (!tags.includes(suggestion)) {
//       // Add the suggestion to the frontend
//       onTagsChange([...tags, suggestion]);

//       // Save the suggested tag to the backend
//       await addTag(suggestion);
//       setInputValue(""); // Clear the input after adding
//     }
//   };

//   return (
//     <div className="space-y-3">
//       <div className="flex gap-2">
//         <Input
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Add a tag (e.g., vintage, rare, pokemon)"
//           className="flex-1"
//           maxLength={20}
//         />
//         <Button
//           type="button"
//           onClick={handleAddTag}
//           variant="outline"
//           disabled={
//             !inputValue.trim() ||
//             tags.includes(inputValue.trim()) ||
//             tags.length >= 10
//           }
//         >
//           <Plus className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* Show suggestions if there are any */}
//       {suggestions.length > 0 && inputValue.trim() && (
//         <div className="mt-2 bg-gray-800 w-fit shadow-md rounded-md border border-gray-200 p-2">
//           {suggestions.map((suggestion) => (
//             <div
//               key={suggestion}
//               className="cursor-pointer hover:bg-gray-100 p-1 border-b"
//               onClick={() => handleTagSuggestionClick(suggestion)}
//             >
//               <span>
//                 Add this tag: <strong>{suggestion}</strong>
//               </span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Display added tags */}
//       {tags.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {tags.map((tag) => (
//             <div
//               key={tag}
//               className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
//             >
//               {tag}
//               <button
//                 type="button"
//                 onClick={() => removeTag(tag)}
//                 className="hover:text-destructive"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default TagInput;
