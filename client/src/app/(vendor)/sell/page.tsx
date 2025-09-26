"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
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
import { useVendorCreateMutation } from "@/redux/features/vendors/vendor";
import ProtectedRoute from "@/Provider/ProtectedRoutes";
import { X, Plus, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// Define social media types
type SocialMediaType = "facebook" | "instagram" | "twitter" | "linkedin";

interface SocialMediaEntry {
  type: SocialMediaType;
  username: string;
}

export default function BecomeVendorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialMedia, setSocialMedia] = useState<SocialMediaEntry[]>([]);
  const [storePhoto, setStorePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [vendorCreationApplication] = useVendorCreateMutation();

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

    const form = e.currentTarget;

    // Get form values
    const firstName = (
      form.elements.namedItem("firstUserName") as HTMLInputElement
    ).value;
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement)
      .value;
    const storeName = (form.elements.namedItem("storeName") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement)
      .value;
    const website = (form.elements.namedItem("website") as HTMLInputElement)
      .value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const experience = (
      form.elements.namedItem("experience") as HTMLSelectElement
    ).value;

    // Filter out empty social media entries
    const validSocialMedia = socialMedia.filter(
      (sm) => sm.username.trim() !== ""
    );

    // Create FormData instead of regular object
    const formData = new FormData();

    // Append text fields
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("storeName", storeName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("category", category);
    formData.append("website", website);
    formData.append("description", description);
    formData.append("experience", experience);

    // Append social media as JSON string
    formData.append("socialLinks", JSON.stringify(validSocialMedia));

    // Append store photo if available
    if (storePhoto) {
      formData.append("image", storePhoto);
    }

    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // Pass FormData directly to the mutation
      const res = await vendorCreationApplication(formData);

      if (res.error) {
        throw new Error("Failed to submit application");
      }

      toast.success(
        "Application submitted successfully! We'll review it within 24-48 hours."
      );
      router.push("/");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedTypes={["customer", "admin"]}>
      <PageLayout
        title="Vendor Application"
        description="Complete this form to apply for a vendor account. We'll review your application within 24-48 hours."
        breadcrumbs={[{ label: "Become a Seller" }]}
      >
        <Card>
          <CardContent>
            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    name="firstUserName"
                    id="firstName"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    name="lastName"
                    id="lastName"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  name="storeName"
                  id="storeName"
                  placeholder="Your store name"
                  required
                  className="mt-1"
                />
              </div>

              {/* Store Photo Upload Section */}
              <div>
                <Label htmlFor="storePhoto">Store Photo</Label>
                <div className="mt-2">
                  {previewUrl ? (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
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
                      className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-full cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Upload size={24} />
                        <span className="text-xs mt-2 text-center">
                          Store Photo
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
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: Square image, max 5MB
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input name="phone" id="phone" type="tel" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="category">Primary Category *</Label>
                <Select name="category" required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trading-cards">Trading Cards</SelectItem>
                    <SelectItem value="comics">Comics</SelectItem>
                    <SelectItem value="coins">Coins</SelectItem>
                    <SelectItem value="stamps">Stamps</SelectItem>
                    <SelectItem value="toys">Vintage Toys</SelectItem>
                    <SelectItem value="sports">Sports Memorabilia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  name="website"
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>

              {/* Social Media Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Social Media Profiles</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSocialMedia}
                    className="flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Social Media
                  </Button>
                </div>

                {socialMedia.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic p-3 border rounded-md bg-muted/50">
                    No social media profiles added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {socialMedia.map((social, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Select
                          value={social.type}
                          onValueChange={(value: SocialMediaType) =>
                            updateSocialMedia(index, "type", value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input
                          placeholder={`${social.type} username`}
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

              <div>
                <Label htmlFor="description">
                  Tell us about your business *
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  placeholder="What types of items do you plan to sell? How long have you been in business?"
                  className="min-h-[120px] mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="experience">
                  Experience selling collectibles
                </Label>
                <Select name="experience">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New to selling</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox name="terms" id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions and the 3% transaction fee
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PageLayout>
    </ProtectedRoute>
  );
}

// "use client";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import PageLayout from "@/components/layout/PageLayout";
// import { Button } from "@/components/UI/button";
// import { Card, CardContent } from "@/components/UI/card";
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
// import { useVendorCreateMutation } from "@/redux/features/vendors/vendor";
// import ProtectedRoute from "@/Provider/ProtectedRoutes";
// import { X, Plus } from "lucide-react";

// // Define social media types
// type SocialMediaType = "facebook" | "instagram" | "twitter" | "linkedin";

// interface SocialMediaEntry {
//   type: SocialMediaType;
//   username: string;
// }

// export default function BecomeVendorPage() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [socialMedia, setSocialMedia] = useState<SocialMediaEntry[]>([]);
//   const [vendorCreationApplication] = useVendorCreateMutation();

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

//   const handleApplicationSubmit = async (e: any) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const form = e.target;

//     // Get form values
//     const firstName = form.firstUserName.value;
//     const lastName = form.lastName.value;
//     const storeName = form.storeName.value;
//     const email = form.email.value;
//     const phone = form.phone.value;
//     const category = form.category.value;
//     const website = form.website.value;
//     const description = form.description.value;
//     const experience = form.experience.value;

//     // Filter out empty social media entries
//     const validSocialMedia = socialMedia.filter(
//       (sm) => sm.username.trim() !== ""
//     );

//     const data = {
//       firstName,
//       lastName,
//       storeName,
//       email,
//       phone,
//       category,
//       website,
//       description,
//       experience,
//       socialLinks: validSocialMedia,
//     };
//     console.log("all form data show ", data);
//     try {
//       const res = await vendorCreationApplication(data);
//       toast.success(
//         "Application submitted successfully! We'll review it within 24-48 hours."
//       );
//       router.push("/");
//     } catch (error) {
//       toast.error("An error occurred. Please try again.");
//     }

//     setIsSubmitting(false);
//   };

//   return (
//     <ProtectedRoute allowedTypes={["customer", "admin"]}>
//       <PageLayout
//         title="Vendor Application"
//         description="Complete this form to apply for a vendor account. We'll review your application within 24-48 hours."
//         breadcrumbs={[{ label: "Become a Seller" }]}
//       >
//         <Card>
//           <CardContent>
//             <form onSubmit={handleApplicationSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="firstName">First Name *</Label>
//                   <Input
//                     name="firstUserName"
//                     id="firstName"
//                     required
//                     className="mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="lastName">Last Name *</Label>
//                   <Input
//                     name="lastName"
//                     id="lastName"
//                     required
//                     className="mt-1"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="storeName">Store Name *</Label>
//                 <Input
//                   name="storeName"
//                   id="storeName"
//                   placeholder="Your store name"
//                   required
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="email">Email Address *</Label>
//                 <Input
//                   name="email"
//                   id="email"
//                   type="email"
//                   required
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="phone">Phone Number</Label>
//                 <Input name="phone" id="phone" type="tel" className="mt-1" />
//               </div>

//               <div>
//                 <Label htmlFor="category">Primary Category *</Label>
//                 <Select name="category" required>
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Select a category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="trading-cards">Trading Cards</SelectItem>
//                     <SelectItem value="comics">Comics</SelectItem>
//                     <SelectItem value="coins">Coins</SelectItem>
//                     <SelectItem value="stamps">Stamps</SelectItem>
//                     <SelectItem value="toys">Vintage Toys</SelectItem>
//                     <SelectItem value="sports">Sports Memorabilia</SelectItem>
//                     <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="website">Website</Label>
//                 <Input
//                   name="website"
//                   id="website"
//                   type="url"
//                   placeholder="https://example.com"
//                   className="mt-1"
//                 />
//               </div>

//               {/* Social Media Section */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <Label>Social Media Profiles</Label>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={addSocialMedia}
//                     className="flex items-center gap-1"
//                   >
//                     <Plus size={16} />
//                     Add Social Media
//                   </Button>
//                 </div>

//                 {socialMedia.length === 0 ? (
//                   <div className="text-sm text-muted-foreground italic p-3 border rounded-md bg-muted/50">
//                     No social media profiles added yet
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {socialMedia.map((social, index) => (
//                       <div key={index} className="flex gap-2 items-start">
//                         <Select
//                           value={social.type}
//                           onValueChange={(value: SocialMediaType) =>
//                             updateSocialMedia(index, "type", value)
//                           }
//                         >
//                           <SelectTrigger className="w-[140px]">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="facebook">Facebook</SelectItem>
//                             <SelectItem value="instagram">Instagram</SelectItem>
//                             <SelectItem value="twitter">Twitter</SelectItem>
//                             <SelectItem value="linkedin">LinkedIn</SelectItem>
//                           </SelectContent>
//                         </Select>

//                         <Input
//                           placeholder={`${social.type} username`}
//                           value={social.username}
//                           onChange={(e) =>
//                             updateSocialMedia(index, "username", e.target.value)
//                           }
//                           className="flex-1"
//                         />

//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => removeSocialMedia(index)}
//                           className="shrink-0 text-destructive hover:text-destructive/80"
//                         >
//                           <X size={16} />
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="description">
//                   Tell us about your business *
//                 </Label>
//                 <Textarea
//                   name="description"
//                   id="description"
//                   placeholder="What types of items do you plan to sell? How long have you been in business?"
//                   className="min-h-[120px] mt-1"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="experience">
//                   Experience selling collectibles
//                 </Label>
//                 <Select name="experience">
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Select your experience level" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="new">New to selling</SelectItem>
//                     <SelectItem value="1-2">1-2 years</SelectItem>
//                     <SelectItem value="3-5">3-5 years</SelectItem>
//                     <SelectItem value="5+">5+ years</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Checkbox name="terms" id="terms" required />
//                 <label
//                   htmlFor="terms"
//                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   I agree to the terms and conditions and the 3% transaction fee
//                 </label>
//               </div>

//               <div className="flex gap-3 justify-end pt-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.push("/")}
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? "Submitting..." : "Submit Application"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </PageLayout>
//     </ProtectedRoute>
//   );
// }
