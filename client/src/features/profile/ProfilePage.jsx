import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { authService } from "../../service/apiService";
import useUserStore from "../../store/userStore";
import ProfileHeader from "./components/ProfileHeader";
import AboutMe from "./components/AboutMe";
import DateOfBirth from "./components/DateOfBirth";
import SocialLinks from "./components/SocialLinks";

const ProfilePage = () => {
  // Get user from AuthContext
  const { fetchMe, user, isAuthenticated } = useUserStore();
  // edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Format dateOfBirth to YYYY-MM-DD for date input
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  // Initialize profile from userStore
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    about: user?.shortDesc || "No bio yet. Click Edit Profile to add one.",
    dob: formatDate(user?.dateOfBirth),
    social: {
      linkedin: user?.links?.linkedin || "",
      scholar: user?.links?.googleScholar || "",
      instagram: user?.links?.instagram || "",
      facebook: user?.links?.facebook || "",
    },
  });

  // Sync profile state with userStore
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchMe();
    }

    if (user) {
      console.log("son tung mtp", user)
      setProfile({
        fullName: user.name || "",
        email: user.email || "",
        about: user.shortDesc || "No bio yet. Click Edit Profile to add one.",
        dob: formatDate(user.dateOfBirth),
        social: {
          linkedin: user.links?.linkedin || "",
          scholar: user.links?.googleScholar || "",
          instagram: user.links?.instagram || "",
          facebook: user.links?.facebook || "",
        },
      });
      setIsLoading(false);
    }
  }, [user, isAuthenticated, fetchMe]);

  const handleChange = (patch) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updateData = {
        fullName: profile.fullName,
        dateOfBirth: profile.dob || null,
        shortDesc: profile.about,
        links: {
          linkedin: profile.social.linkedin || undefined,
          googleScholar: profile.social.scholar || undefined,
          instagram: profile.social.instagram || undefined,
          facebook: profile.social.facebook || undefined,
        },
      };

      const response = await authService.updateProfile(updateData);

      if (response.success) {
        // Show success toast
        toast.success("Profile updated successfully!");

        setIsEditing(false);

        // Refresh user data from API using userStore
        await fetchMe();

      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to current user data from store
    setProfile({
      fullName: user?.fullName || "",
      email: user?.email || "",
      about: user?.shortDesc || "No bio yet. Click Edit Profile to add one.",
      dob: formatDate(user?.dateOfBirth),
      social: {
        linkedin: user?.links?.linkedin || "",
        scholar: user?.links?.googleScholar || "",
        instagram: user?.links?.instagram || "",
        facebook: user?.links?.facebook || "",
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Manage your personal information
            </p>
          </div>

          <div>
            {isEditing ? (
              <div className="flex gap-3">
                <button onClick={handleSave} className="btn-primary">
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <ProfileHeader
            editable={isEditing}
            profile={profile}
            onChange={handleChange}
          />

          <AboutMe
            editable={isEditing}
            profile={profile}
            onChange={(p) => handleChange({ about: p })}
          />

          <DateOfBirth
            editable={isEditing}
            profile={profile}
            onChange={(d) => handleChange({ dob: d })}
          />

          <SocialLinks
            editable={isEditing}
            profile={profile}
            onChange={(s) =>
              handleChange({ social: { ...profile.social, ...s } })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
