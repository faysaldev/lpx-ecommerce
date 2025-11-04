"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/UI/button";
import { Checkbox } from "@/components/UI/checkbox";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Textarea } from "@/components/UI/textarea";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAllCategoriesQuery } from "@/redux/features/BrowseCollectibles/BrowseCollectibles";
import { useVendorCreateMutation } from "@/redux/features/vendors/vendor";
import { useAppSelector } from "@/redux/hooks";
import { X, Plus, Upload, MapPin, Globe } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SocialMediaType =
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "pinterest";

interface SocialMediaEntry {
  type: SocialMediaType;
  username: string;
}

const UAE_CITIES = [
  "Abu Dhabi",
  "Ajman",
  "Dubai",
  "Fujairah",
  "Ras Al Khaimah",
  "Sharjah",
  "Umm Al-Quwain",
];
function RequestVendorForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialMedia, setSocialMedia] = useState<SocialMediaEntry[]>([]);
  const [storePhoto, setStorePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const currentUser = useAppSelector(selectCurrentUser);

  const [vendorCreationApplication] = useVendorCreateMutation();
  const { data: categoriesData } = useAllCategoriesQuery({});

  // Add new social media entry
  const addSocialMedia = () => {
    setSocialMedia([...socialMedia, { type: "facebook", username: "" }]);
  };

  // Update social media entry
  const updateSocialMedia = (
    index: number,
    field: keyof SocialMediaEntry,
    value: string
  ) => {
    const updated = [...socialMedia];
    updated[index] = { ...updated[index], [field]: value };
    setSocialMedia(updated);
  };

  // Remove social media entry
  const removeSocialMedia = (index: number) => {
    const updated = socialMedia.filter((_, i) => i !== index);
    setSocialMedia(updated);
  };

  // Handle store photo upload
  const handleStorePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setStorePhoto(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Remove store photo
  const removeStorePhoto = () => {
    setStorePhoto(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const handleApplicationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!storePhoto) {
      setIsSubmitting(false);
      return toast.error("Store image Is required");
    }

    if (!selectedCity) {
      setIsSubmitting(false);
      return toast.error("Please select a city");
    }

    const form = e.currentTarget;

    // Get address details
    const addressDetails = (
      form.elements.namedItem("addressDetails") as HTMLInputElement
    ).value;
    const addressParts = addressDetails.trim().split(/\s+/);

    // Validate address format (must have at least 3 parts: house_no, building_name, area)
    if (addressParts.length < 3) {
      setIsSubmitting(false);
      return toast.error(
        "Please provide House No, Building Name, and Area separated by spaces"
      );
    }

    const origin_address_house_no = addressParts[0];
    const origin_address_building_name = addressParts[1];
    const origin_address_area = addressParts.slice(2).join(" ");

    // Get form values
    const name = currentUser?.name?.split(" ");
    const firstName = name?.[0] ?? " ";
    const lastName = name?.[2] ?? "Name";

    const storeName = (form.elements.namedItem("storeName") as HTMLInputElement)
      .value;
    const userEmail = currentUser?.email ?? "";
    const contactEmail = (
      form.elements.namedItem("contactEmail") as HTMLInputElement
    ).value;
    const phoneNumber = currentUser?.phoneNumber ?? "";
    const category = (form.elements.namedItem("category") as HTMLSelectElement)
      .value;
    const website = (form.elements.namedItem("website") as HTMLInputElement)
      .value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const experiences = (
      form.elements.namedItem("experiences") as HTMLSelectElement
    ).value;

    // Filter out empty social media entries
    const validSocialMedia = socialMedia.filter(
      (sm) => sm.username.trim() !== ""
    );

    // Combine location details
    const location = `${origin_address_house_no} ${origin_address_building_name} ${origin_address_area}`;

    // Create FormData instead of regular object
    const formData = new FormData();

    // Append text fields
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("storeName", storeName);
    formData.append("email", userEmail);
    formData.append("contactEmail", contactEmail);
    formData.append("phoneNumber", phoneNumber);
    formData.append("city", selectedCity);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("website", website || "");
    formData.append("description", description);
    formData.append("experiences", experiences);

    // Append social media as JSON string
    formData.append("socialLinks", JSON.stringify(validSocialMedia));

    // Append store photo if available
    if (storePhoto) {
      formData.append("image", storePhoto);
    }

    try {
      // Pass FormData directly to the mutation
      const res = await vendorCreationApplication(formData);

      if (res.error) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message: string };
          toast(`❌ ${errorData.message}`);
        } else {
          toast(`❌ An unknown error occurred`);
        }
      } else {
        toast.success(
          "Application submitted successfully! We'll review it within 24-48 hours."
        );
        router.push("/");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleApplicationSubmit} className="space-y-8">
      {/* Store Information Section */}
      <section>
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
          Store Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="storeName">Store Name *</Label>
            <Input
              name="storeName"
              id="storeName"
              placeholder="Your official store name"
              required
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="storePhoto">Store Logo/Photo</Label>
            <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {previewUrl ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-primary/20 shadow-md">
                    <Image
                      src={previewUrl}
                      alt="Store preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeStorePhoto}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X size={16} className="mr-1" />
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="storePhoto"
                  className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
                >
                  <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
                    <Upload size={24} />
                    <span className="text-xs mt-2 text-center">
                      Upload Store Logo
                    </span>
                  </div>
                  <input
                    id="storePhoto"
                    name="storePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleStorePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Recommended: Square image, JPG/PNG format, max 5MB. This will
                  be displayed as your store logo.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="contactEmail">Business Email *</Label>
            <Input
              name="contactEmail"
              id="contactEmail"
              type="email"
              placeholder="business@example.com"
              required
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="city">City *</Label>
            <Select
              value={selectedCity}
              onValueChange={setSelectedCity}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {UAE_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="addressDetails">Address Details *</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
              <Input
                name="addressDetails"
                id="addressDetails"
                placeholder="House No Building Name Area (e.g., 123 TowerName AlBarsha)"
                required
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Format: House No, Building Name, Area (separated by spaces)
            </p>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="category">Primary Category *</Label>
            <Select name="category" required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your main product category" />
              </SelectTrigger>

              <SelectContent>
                {categoriesData?.data?.attributes?.map((category: any) => (
                  <SelectItem key={category?._id} value={category?.name}>
                    {category?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <div className="relative mt-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                name="website"
                id="website"
                placeholder="https://yourstore.com"
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section>
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
          Social Media Profiles
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Add your social media profiles</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSocialMedia}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Add Profile
            </Button>
          </div>

          {socialMedia.length === 0 ? (
            <div className="text-sm text-muted-foreground italic p-4 border-2 border-dashed rounded-lg bg-muted/30 text-center">
              No social media profiles added yet. Add your profiles to increase
              visibility.
            </div>
          ) : (
            <div className="space-y-3">
              {socialMedia.map((social: any, index: any) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-2 items-start"
                >
                  <Select
                    value={social.type}
                    onValueChange={(value: SocialMediaType) =>
                      updateSocialMedia(index, "type", value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="pinterest">Pinterest</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder={`${social.type} username or profile URL`}
                    value={social.username}
                    onChange={(e) =>
                      updateSocialMedia(index, "username", e.target.value)
                    }
                    className="flex-1"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSocialMedia(index)}
                    className="shrink-0 text-destructive hover:text-destructive/80"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Business Description Section */}
      <section>
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
          Business Description
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Tell us about your business *</Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Describe your business, the types of collectibles you specialize in, your expertise in the field, and what makes your store unique..."
              className="min-h-[120px] mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="experiences">
              Years of Experience in Collectibles *
            </Label>
            <Select name="experiences" required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">Less than 1 year</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-10">5-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section className="bg-muted/30 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Checkbox name="terms" id="terms" required />
          <div>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions
            </label>
            <p className="text-sm text-muted-foreground mt-1">
              By submitting this application, I confirm that all information
              provided is accurate. I understand that there is a up to 3-5%
              transaction fee on all sales, and I agree to comply with the
              platform{`'`}s vendor policies and guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/")}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel Application
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  );
}

export default RequestVendorForm;

// "use client";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Button } from "@/components/UI/button";
// import { Checkbox } from "@/components/UI/checkbox";
// import { Input } from "@/components/UI/input";
// import { Label } from "@/components/UI/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/UI/select";
// import { Textarea } from "@/components/UI/textarea";
// import { selectCurrentUser } from "@/redux/features/auth/authSlice";
// import { useAllCategoriesQuery } from "@/redux/features/BrowseCollectibles/BrowseCollectibles";
// import { useVendorCreateMutation } from "@/redux/features/vendors/vendor";
// import { useAppSelector } from "@/redux/hooks";
// import { X, Plus, Upload, MapPin, Globe } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";

// type SocialMediaType =
//   | "facebook"
//   | "instagram"
//   | "twitter"
//   | "linkedin"
//   | "youtube"
//   | "pinterest";

// interface SocialMediaEntry {
//   type: SocialMediaType;
//   username: string;
// }

// function RequestVendorForm() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [socialMedia, setSocialMedia] = useState<SocialMediaEntry[]>([]);
//   const [storePhoto, setStorePhoto] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const currentUser = useAppSelector(selectCurrentUser);

//   const [vendorCreationApplication] = useVendorCreateMutation();
//   const { data: categoriesData } = useAllCategoriesQuery({});
//   // Add new social media entry
//   const addSocialMedia = () => {
//     setSocialMedia([...socialMedia, { type: "facebook", username: "" }]);
//   };

//   // Update social media entry
//   const updateSocialMedia = (
//     index: number,
//     field: keyof SocialMediaEntry,
//     value: string
//   ) => {
//     const updated = [...socialMedia];
//     updated[index] = { ...updated[index], [field]: value };
//     setSocialMedia(updated);
//   };

//   // Remove social media entry
//   const removeSocialMedia = (index: number) => {
//     const updated = socialMedia.filter((_, i) => i !== index);
//     setSocialMedia(updated);
//   };

//   // Handle store photo upload
//   const handleStorePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Check file type
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please upload an image file");
//         return;
//       }

//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size should be less than 5MB");
//         return;
//       }

//       setStorePhoto(file);

//       // Create preview URL
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//     }
//   };

//   // Remove store photo
//   const removeStorePhoto = () => {
//     setStorePhoto(null);
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl);
//     }
//     setPreviewUrl(null);
//   };

//   const handleApplicationSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!storePhoto) {
//       setIsSubmitting(false);
//       return toast.error("Store image Is required");
//     }
//     const form = e.currentTarget;
//     // Get form values
//     const name = currentUser?.name?.split(" ");
//     console.log(name, "im the name");
//     const firstName = name?.[0] ?? " "; // Default to an empty string if undefined
//     const lastName = name?.[2] ?? "Name"; // Default to an empty string if undefined

//     const storeName = (form.elements.namedItem("storeName") as HTMLInputElement)
//       .value;
//     const userEmail = currentUser?.email ?? "";
//     const contactEmail = (
//       form.elements.namedItem("contactEmail") as HTMLInputElement
//     ).value;
//     const phoneNumber = currentUser?.phoneNumber ?? "";

//     const location = (form.elements.namedItem("location") as HTMLInputElement)
//       .value;
//     const category = (form.elements.namedItem("category") as HTMLSelectElement)
//       .value;
//     const website = (form.elements.namedItem("website") as HTMLInputElement)
//       .value;
//     const description = (
//       form.elements.namedItem("description") as HTMLTextAreaElement
//     ).value;
//     const experiences = (
//       form.elements.namedItem("experiences") as HTMLSelectElement
//     ).value;

//     // Filter out empty social media entries
//     const validSocialMedia = socialMedia.filter(
//       (sm) => sm.username.trim() !== ""
//     );

//     // Create FormData instead of regular object
//     const formData = new FormData();

//     // Append text fields
//     formData.append("firstName", firstName);
//     formData.append("lastName", lastName);
//     formData.append("storeName", storeName);
//     formData.append("email", userEmail);
//     formData.append("contactEmail", contactEmail);
//     formData.append("phoneNumber", phoneNumber);
//     formData.append("location", location);
//     formData.append("category", category);
//     formData.append("website", website || "");
//     formData.append("description", description);
//     formData.append("experiences", experiences);

//     // Append social media as JSON string
//     formData.append("socialLinks", JSON.stringify(validSocialMedia));

//     // Append store photo if available
//     if (storePhoto) {
//       formData.append("image", storePhoto);
//     }

//     try {
//       // Pass FormData directly to the mutation
//       const res = await vendorCreationApplication(formData);

//       if (res.error) {
//         if ("data" in res.error) {
//           const errorData = res.error.data as { message: string };
//           toast(`❌ ${errorData.message}`);
//         } else {
//           toast(`❌ An unknown error occurred`);
//         }
//       } else {
//         toast.success(
//           "Application submitted successfully! We'll review it within 24-48 hours."
//         );
//         router.push("/");
//       }
//     } catch (error: any) {
//       console.error("Submission error:", error);
//       toast(error.message || "An error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   return (
//     <form onSubmit={handleApplicationSubmit} className="space-y-8">
//       {/* Store Information Section */}
//       <section>
//         <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
//           Store Information
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-2">
//             <Label htmlFor="storeName">Store Name *</Label>
//             <Input
//               name="storeName"
//               id="storeName"
//               placeholder="Your official store name"
//               required
//               className="mt-1"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <Label htmlFor="storePhoto">Store Logo/Photo</Label>
//             <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
//               {previewUrl ? (
//                 <div className="flex flex-col items-center space-y-3">
//                   <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-primary/20 shadow-md">
//                     <Image
//                       src={previewUrl}
//                       alt="Store preview"
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={removeStorePhoto}
//                     className="text-destructive hover:text-destructive/80"
//                   >
//                     <X size={16} className="mr-1" />
//                     Remove Photo
//                   </Button>
//                 </div>
//               ) : (
//                 <label
//                   htmlFor="storePhoto"
//                   className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
//                 >
//                   <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
//                     <Upload size={24} />
//                     <span className="text-xs mt-2 text-center">
//                       Upload Store Logo
//                     </span>
//                   </div>
//                   <input
//                     id="storePhoto"
//                     name="storePhoto"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleStorePhotoUpload}
//                     className="hidden"
//                   />
//                 </label>
//               )}
//               <div className="flex-1">
//                 <p className="text-sm text-muted-foreground">
//                   Recommended: Square image, JPG/PNG format, max 5MB. This will
//                   be displayed as your store logo.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-x-2">
//             <div>
//               <Label htmlFor="contactEmail">Business Email *</Label>
//               <Input
//                 name="contactEmail"
//                 id="contactEmail"
//                 type="email"
//                 placeholder="business@example.com"
//                 required
//                 className="mt-1"
//               />
//             </div>
//             <div className="">
//               <Label htmlFor="location">Business Location *</Label>
//               <div className="relative mt-1">
//                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input
//                   name="location"
//                   id="location"
//                   placeholder="City, State, Country"
//                   required
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="md:col-span-2">
//             <Label htmlFor="category">Primary Category *</Label>
//             <Select name="category" required>
//               <SelectTrigger className="mt-1">
//                 <SelectValue placeholder="Select your main product category" />
//               </SelectTrigger>

//               <SelectContent>
//                 {categoriesData?.data?.attributes?.map((category: any) => (
//                   <SelectItem key={category?._id} value={category?.name}>
//                     {category?.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="md:col-span-2">
//             <Label htmlFor="website">Website (Optional)</Label>
//             <div className="relative mt-1">
//               <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//               <Input
//                 name="website"
//                 id="website"
//                 placeholder="https://yourstore.com"
//                 className="pl-10"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Social Media Section */}
//       <section>
//         <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
//           Social Media Profiles
//         </h3>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <Label>Add your social media profiles</Label>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={addSocialMedia}
//               className="flex items-center gap-1"
//             >
//               <Plus size={16} />
//               Add Profile
//             </Button>
//           </div>

//           {socialMedia.length === 0 ? (
//             <div className="text-sm text-muted-foreground italic p-4 border-2 border-dashed rounded-lg bg-muted/30 text-center">
//               No social media profiles added yet. Add your profiles to increase
//               visibility.
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {socialMedia.map((social: any, index: any) => (
//                 <div
//                   key={index}
//                   className="flex flex-col sm:flex-row gap-2 items-start"
//                 >
//                   <Select
//                     value={social.type}
//                     onValueChange={(value: SocialMediaType) =>
//                       updateSocialMedia(index, "type", value)
//                     }
//                   >
//                     <SelectTrigger className="w-full sm:w-[160px]">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="facebook">Facebook</SelectItem>
//                       <SelectItem value="instagram">Instagram</SelectItem>
//                       <SelectItem value="twitter">Twitter/X</SelectItem>
//                       <SelectItem value="linkedin">LinkedIn</SelectItem>
//                       <SelectItem value="youtube">YouTube</SelectItem>
//                       <SelectItem value="pinterest">Pinterest</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <Input
//                     placeholder={`${social.type} username or profile URL`}
//                     value={social.username}
//                     onChange={(e) =>
//                       updateSocialMedia(index, "username", e.target.value)
//                     }
//                     className="flex-1"
//                   />

//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => removeSocialMedia(index)}
//                     className="shrink-0 text-destructive hover:text-destructive/80"
//                   >
//                     <X size={16} />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Business Description Section */}
//       <section>
//         <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
//           Business Description
//         </h3>
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="description">Tell us about your business *</Label>
//             <Textarea
//               name="description"
//               id="description"
//               placeholder="Describe your business, the types of collectibles you specialize in, your expertise in the field, and what makes your store unique..."
//               className="min-h-[120px] mt-1"
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="experiences">
//               Years of Experience in Collectibles *
//             </Label>
//             <Select name="experiences" required>
//               <SelectTrigger className="mt-1">
//                 <SelectValue placeholder="Select your experience level" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="0-1">Less than 1 year</SelectItem>
//                 <SelectItem value="1-3">1-3 years</SelectItem>
//                 <SelectItem value="3-5">3-5 years</SelectItem>
//                 <SelectItem value="5-10">5-10 years</SelectItem>
//                 <SelectItem value="10+">10+ years</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </section>

//       {/* Terms and Conditions */}
//       <section className="bg-muted/30 p-4 rounded-lg">
//         <div className="flex items-start space-x-3">
//           <Checkbox name="terms" id="terms" required />
//           <div>
//             <label
//               htmlFor="terms"
//               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//             >
//               I agree to the terms and conditions
//             </label>
//             <p className="text-sm text-muted-foreground mt-1">
//               By submitting this application, I confirm that all information
//               provided is accurate. I understand that there is a 3% transaction
//               fee on all sales, and I agree to comply with the platform{`'`}s
//               vendor policies and guidelines.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Submit Buttons */}
//       <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => router.push("/")}
//           disabled={isSubmitting}
//           className="w-full sm:w-auto"
//         >
//           Cancel Application
//         </Button>
//         <Button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full sm:w-auto"
//         >
//           {isSubmitting ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               Submitting...
//             </>
//           ) : (
//             "Submit Application"
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// }

// export default RequestVendorForm;
