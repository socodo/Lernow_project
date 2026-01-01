import { useState } from 'react';

// ProfileHeader: top card with avatar, name and email; supports edit mode
const ProfileHeader = ({
  editable = false,
  profile = {},
  onChange = () => { },
}) => {
  const [emailError, setEmailError] = useState("");

  const initials = (profile.fullName || "JD")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    onChange({ email: newEmail });

    if (!newEmail) {
      setEmailError("Email is required");
    } else if (!validateEmail(newEmail)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-6 w-full">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
          {initials}
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-500">Full Name</div>
          {editable ? (
            <input
              className="w-full mt-1 p-3 bg-gray-50 rounded"
              value={profile.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
            />
          ) : (
            <div className="text-lg font-semibold text-gray-900">
              {profile.fullName}
            </div>
          )}

          <div className="text-sm text-gray-500 mt-2">Email Address</div>
          {editable ? (
            <>
              <input
                className={`w-full mt-1 p-3 bg-gray-50 rounded border ${emailError ? 'border-red-500 focus:border-red-500' : 'border-transparent'}`}
                value={profile.email}
                onChange={handleEmailChange}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </>
          ) : (
            <div className="text-sm text-gray-500 mt-2">
              {profile.email}{" "}
              <span className="ml-2 inline-block bg-gray-900 text-white text-xs px-2 py-1 rounded">
                Verified
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
