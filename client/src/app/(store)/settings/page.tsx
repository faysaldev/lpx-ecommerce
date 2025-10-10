/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Store,
  DollarSign,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/features/Users/userSlice";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/getImageURL";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";

export default function UserSettingsProfile() {
  const { data: userProfile, isLoading, refetch } = useGetUserProfileQuery({});
  const [updateProfile, { isLoading: updaProfileLoading }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading: changeLoading }] =
    useChangePasswordMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Initialize form data when userProfile loads
  useEffect(() => {
    if (userProfile?.data?.attributes?.user) {
      const user = userProfile.data.attributes.user;
      setFormData({
        name: user.name || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      });
      setImagePreview(user.image || "");
    }
  }, [userProfile]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsEditing(true);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsEditing(true);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("address", formData.address);
      submitData.append("phoneNumber", formData.phoneNumber);

      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      // Call the updateProfile mutation
      await updateProfile(submitData).unwrap();
      await refetch();
      setIsEditing(false);
      setSelectedImage(null);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
      console.error("Update error:", error);
    }
  };

  const handleCancelEdit = () => {
    if (userProfile?.data?.attributes?.user) {
      const user = userProfile.data.attributes.user;
      setFormData({
        name: user.name || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      });
      setImagePreview(user.image || "");
      setSelectedImage(null);
      setIsEditing(false);
    }
  };

  const handlePasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      // Call the changePassword mutation with the correct parameter names
      await changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      toast.success("Password updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
      console.error("Password update error:", error);
    }
  };

  const user = userProfile?.data?.attributes?.user;
  const isSeller = user?.type === "seller";
  const vendorDetails = user?.vendorDetails;

  if (isLoading) {
    return (
      <PageLayout
        title="Profile Settings"
        description="Manage Your User Profile Settings"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Profile", href: "/profile" },
        ]}
      >
        <div className="flex justify-center items-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Profile Settings"
      description="Manage Your User Profile Settings"
      breadcrumbs={[{ label: "Profile", href: "/profile" }]}
    >
      <div className="space-y-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Picture Card */}
            <div className="rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 border-4 border-white shadow-2xl">
                    <img
                      src={
                        !selectedImage
                          ? getImageUrl(imagePreview)
                          : selectedImage
                      }
                      alt={user?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleImageClick}
                    className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-100 mb-1">
                  {user?.name || "User"}
                </h2>
                <p className="text-gray-300 text-sm mb-3">{user?.email}</p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
                  {isSeller ? (
                    <>
                      <Store className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-700">
                        Seller Account
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-700">
                        User Account
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-200">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Member since{" "}
                      {new Date(user?.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Stats Card */}
            {isSeller && vendorDetails && (
              <div className=" rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30">
                    {vendorDetails.storePhoto ? (
                      <img
                        src={getImageUrl(vendorDetails.storePhoto)}
                        alt={vendorDetails.storeName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-purple-100 text-xs font-medium">
                      Store Name
                    </p>
                    <h3 className="text-xl font-bold">
                      {vendorDetails.storeName}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                  {/* Total Earnings Card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-300" />
                        <span className="text-sm font-medium">
                          Total Earnings
                        </span>
                      </div>
                      <span className="text-2xl font-bold">
                        ${vendorDetails.totalEarnings?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>

                  {/* Total Withdrawals Card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-300" />
                        <span className="text-sm font-medium">
                          Total Withdrawals
                        </span>
                      </div>
                      <span className="text-2xl font-bold">
                        ${vendorDetails.totalWithDrawal?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>

                  {/* Available Balance Card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-yellow-300" />
                        <span className="text-sm font-medium">
                          Available Balance
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-yellow-300">
                        $
                        {(
                          (vendorDetails.totalEarnings || 0) -
                          (vendorDetails.totalWithDrawal || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Information Card */}
            <div className="rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-100">
                    Profile Information
                  </h3>
                  <p className="text-gray-200 text-sm mt-1">
                    Update your personal details
                  </p>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={updaProfileLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={updaProfileLoading}
                      className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {updaProfileLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>
            </div>

            {/* Password & Security Card */}
            <div className=" rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-gray-200" />
                    Password & Security
                  </h3>
                  <p className="text-gray-200 text-sm mt-1">
                    Keep your account secure with a strong password
                  </p>
                </div>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Enter new password"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handlePasswordReset}
                      disabled={changeLoading}
                      className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50"
                    >
                      {changeLoading ? "Updating..." : "Update Password"}
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      disabled={changeLoading}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useState, useRef, useEffect, ChangeEvent } from "react";
// import {
//   Camera,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Store,
//   DollarSign,
//   Save,
//   X,
//   Lock,
//   Eye,
//   EyeOff,
//   Calendar,
//   Shield,
//   TrendingUp,
//   CreditCard,
// } from "lucide-react";
// import PageLayout from "@/components/layout/PageLayout";

// import {
//   useGetUserProfileQuery,
//   useUpdateProfileMutation,
// } from "@/redux/features/Users/userSlice";
// import { toast } from "sonner";
// import { getImageUrl } from "@/lib/getImageURL";
// import { useChangePasswordMutation } from "@/redux/features/auth/authApi";

// export default function UserSettingsProfile() {
//   const { data: userProfile, isLoading, refetch } = useGetUserProfileQuery({});
//   // const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
//   const [updateProfile, { isLoading: updaProfileLoading, error }] =
//     useUpdateProfileMutation();
//   const [changePassword, { isLoading: changeLoading }] =
//     useChangePasswordMutation();

//   const isUpdating = false;
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     phoneNumber: "",
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>("");

//   // Initialize form data when userProfile loads
//   useEffect(() => {
//     if (userProfile?.data?.attributes?.user) {
//       const user = userProfile.data.attributes.user;
//       setFormData({
//         name: user.name || "",
//         address: user.address || "",
//         phoneNumber: user.phoneNumber || "",
//       });
//       setImagePreview(user.image || "");
//     }
//   }, [userProfile]);

//   const handleImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please select an image file");
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size should be less than 5MB");
//         return;
//       }

//       setSelectedImage(file);
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);
//       setIsEditing(true);
//     }
//   };

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setIsEditing(true);
//   };

//   const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPasswordData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSaveProfile = async () => {
//     try {
//       const submitData = new FormData();
//       submitData.append("name", formData.name);
//       submitData.append("address", formData.address);
//       submitData.append("phoneNumber", formData.phoneNumber);

//       if (selectedImage) {
//         submitData.append("image", selectedImage);
//       }

//       // await updateUserProfile(submitData).unwrap();
//       await refetch();
//       setIsEditing(false);
//       setSelectedImage(null);
//       toast.success("Profile updated successfully!");
//     } catch (error) {
//       toast.error("Failed to update profile");
//       console.error("Update error:", error);
//     }
//   };

//   const handleCancelEdit = () => {
//     if (userProfile?.data?.attributes?.user) {
//       const user = userProfile.data.attributes.user;
//       setFormData({
//         name: user.name || "",
//         address: user.address || "",
//         phoneNumber: user.phoneNumber || "",
//       });
//       setImagePreview(user.image || "");
//       setSelectedImage(null);
//       setIsEditing(false);
//     }
//   };

//   const handlePasswordReset = async () => {
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast.error("New passwords do not match");
//       return;
//     }

//     if (passwordData.newPassword.length < 8) {
//       toast.error("Password must be at least 8 characters long");
//       return;
//     }

//     try {
//       // await resetPassword(passwordData).unwrap();
//       setPasswordData({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//       setIsChangingPassword(false);
//       toast.success("Password updated successfully!");
//     } catch (error) {
//       toast.error("Failed to update password");
//     }
//   };

//   const user = userProfile?.data?.attributes?.user;
//   const isSeller = user?.type === "seller";
//   const vendorDetails = user?.vendorDetails;

//   if (isLoading) {
//     return (
//       <PageLayout
//         title="Profile Settings"
//         description="Manage Your User Profile Settings"
//         breadcrumbs={[
//           { label: "Home", href: "/" },
//           { label: "Profile", href: "/profile" },
//         ]}
//       >
//         <div className="flex justify-center items-center h-96">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <User className="w-6 h-6 text-indigo-600" />
//             </div>
//           </div>
//         </div>
//       </PageLayout>
//     );
//   }

//   return (
//     <PageLayout
//       title="Profile Settings"
//       description="Manage Your User Profile Settings"
//       breadcrumbs={[
//         { label: "Home", href: "/" },
//         { label: "Profile", href: "/profile" },
//       ]}
//     >
//       <div className="space-y-6">
//         <div className="grid lg:grid-cols-5 gap-6">
//           {/* Left Column - Profile Card */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Profile Picture Card */}
//             <div className="rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="text-center">
//                 <div className="relative inline-block mb-4">
//                   <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 border-4 border-white shadow-2xl">
//                     {imagePreview ? (
//                       <img
//                         src={getImageUrl(imagePreview)}
//                         alt={user?.name || "User"}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <User className="w-20 h-20 text-white" />
//                       </div>
//                     )}
//                   </div>
//                   <button
//                     onClick={handleImageClick}
//                     className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
//                   >
//                     <Camera className="w-5 h-5" />
//                   </button>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                   />
//                 </div>

//                 <h2 className="text-2xl font-bold text-gray-100 mb-1">
//                   {user?.name || "User"}
//                 </h2>
//                 <p className="text-gray-300 text-sm mb-3">{user?.email}</p>

//                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
//                   {isSeller ? (
//                     <>
//                       <Store className="w-4 h-4 text-purple-600" />
//                       <span className="text-sm font-semibold text-purple-700">
//                         Seller Account
//                       </span>
//                     </>
//                   ) : (
//                     <>
//                       <User className="w-4 h-4 text-indigo-600" />
//                       <span className="text-sm font-semibold text-indigo-700">
//                         User Account
//                       </span>
//                     </>
//                   )}
//                 </div>

//                 <div className="mt-4 pt-4 border-t border-gray-100">
//                   <div className="flex items-center justify-center gap-2 text-sm text-gray-200">
//                     <Calendar className="w-4 h-4" />
//                     <span>
//                       Member since{" "}
//                       {new Date(user?.createdAt).toLocaleDateString("en-US", {
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Vendor Stats Card */}
//             {isSeller && vendorDetails && (
//               <div className=" rounded-2xl shadow-lg p-6 text-white">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30">
//                     {vendorDetails.storePhoto ? (
//                       <img
//                         src={getImageUrl(vendorDetails.storePhoto)}
//                         alt={vendorDetails.storeName}
//                         className="w-full h-full object-contain"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <Store className="w-6 h-6 text-white" />
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-purple-100 text-xs font-medium">
//                       Store Name
//                     </p>
//                     <h3 className="text-xl font-bold">
//                       {vendorDetails.storeName}
//                     </h3>
//                   </div>
//                 </div>

//                 <div className="space-y-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
//                   {/* Total Earnings Card */}
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col justify-between h-full">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <TrendingUp className="w-5 h-5 text-green-300" />
//                         <span className="text-sm font-medium">
//                           Total Earnings
//                         </span>
//                       </div>
//                       <span className="text-2xl font-bold">
//                         ${vendorDetails.totalEarnings?.toFixed(2) || "0.00"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Total Withdrawals Card */}
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col justify-between h-full">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <CreditCard className="w-5 h-5 text-blue-300" />
//                         <span className="text-sm font-medium">
//                           Total Withdrawals
//                         </span>
//                       </div>
//                       <span className="text-2xl font-bold">
//                         ${vendorDetails.totalWithDrawal?.toFixed(2) || "0.00"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Available Balance Card */}
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col justify-between h-full">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <DollarSign className="w-5 h-5 text-yellow-300" />
//                         <span className="text-sm font-medium">
//                           Available Balance
//                         </span>
//                       </div>
//                       <span className="text-2xl font-bold text-yellow-300">
//                         $
//                         {(
//                           (vendorDetails.totalEarnings || 0) -
//                           (vendorDetails.totalWithDrawal || 0)
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Forms */}
//           <div className="lg:col-span-3 space-y-6">
//             {/* Profile Information Card */}
//             <div className="rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-2xl font-bold text-gray-100">
//                     Profile Information
//                   </h3>
//                   <p className="text-gray-200 text-sm mt-1">
//                     Update your personal details
//                   </p>
//                 </div>
//                 {isEditing && (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleCancelEdit}
//                       disabled={isUpdating}
//                       className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
//                     >
//                       <X className="w-4 h-4" />
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleSaveProfile}
//                       disabled={isUpdating}
//                       className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
//                     >
//                       <Save className="w-4 h-4" />
//                       {isUpdating ? "Saving..." : "Save Changes"}
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-5">
//                 <div>
//                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2">
//                     <User className="w-4 h-4 text-indigo-600" />
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                     placeholder="Enter your full name"
//                   />
//                 </div>

//                 <div>
//                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2">
//                     <Mail className="w-4 h-4 text-indigo-600" />
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     value={user?.email || ""}
//                     disabled
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Email cannot be changed
//                   </p>
//                 </div>

//                 <div>
//                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2">
//                     <Phone className="w-4 h-4 text-indigo-600" />
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                     placeholder="Enter your phone number"
//                   />
//                 </div>

//                 <div>
//                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2">
//                     <MapPin className="w-4 h-4 text-indigo-600" />
//                     Address
//                   </label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
//                     placeholder="Enter your complete address"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Password & Security Card */}
//             <div className=" rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
//                     <Lock className="w-6 h-6 text-gray-200" />
//                     Password & Security
//                   </h3>
//                   <p className="text-gray-200 text-sm mt-1">
//                     Keep your account secure with a strong password
//                   </p>
//                 </div>
//                 {!isChangingPassword && (
//                   <button
//                     onClick={() => setIsChangingPassword(true)}
//                     className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
//                   >
//                     Change Password
//                   </button>
//                 )}
//               </div>

//               {isChangingPassword && (
//                 <div className="space-y-4 pt-4 border-t border-gray-200">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-200 mb-2">
//                       Current Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showCurrentPassword ? "text" : "password"}
//                         name="currentPassword"
//                         value={passwordData.currentPassword}
//                         onChange={handlePasswordChange}
//                         className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                         placeholder="Enter current password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowCurrentPassword(!showCurrentPassword)
//                         }
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showCurrentPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-200 mb-2">
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showNewPassword ? "text" : "password"}
//                         name="newPassword"
//                         value={passwordData.newPassword}
//                         onChange={handlePasswordChange}
//                         className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                         placeholder="Enter new password"
//                         minLength={8}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowNewPassword(!showNewPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showNewPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Must be at least 8 characters long
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-200 mb-2">
//                       Confirm New Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         name="confirmPassword"
//                         value={passwordData.confirmPassword}
//                         onChange={handlePasswordChange}
//                         className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                         placeholder="Confirm new password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex gap-3 pt-2">
//                     <button
//                       onClick={handlePasswordReset}
//                       className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
//                     >
//                       Update Password
//                     </button>
//                     <button
//                       onClick={() => {
//                         setIsChangingPassword(false);
//                         setPasswordData({
//                           currentPassword: "",
//                           newPassword: "",
//                           confirmPassword: "",
//                         });
//                       }}
//                       className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </PageLayout>
//   );
// }

// call everythings into this way
//   await changePassword({ oldPassword, newPassword }).unwrap();

//       e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("phoneNumber", phoneNumber);
//     formData.append("address", address);
//     if (image) {
//       formData.append("image", image);
//     }

//     try {
//       await updateProfile(formData).unwrap();
//       alert("Profile updated successfully!");
//     } catch (err) {
//       console.error("Failed to update profile:", err);
//       alert("Error updating profile.");
//     }
//   };
