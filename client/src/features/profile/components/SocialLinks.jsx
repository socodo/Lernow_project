import { useState } from 'react';

// SocialLinks: các trường nhập liên kết mạng xã hội (2 cột)
const SocialLinks = ({
  editable = false,
  profile = {},
  onChange = () => { },
}) => {
  const social = profile.social || {};
  const [errors, setErrors] = useState({});

  const validate = (key, value) => {
    if (!value) return "";

    switch (key) {
      case 'linkedin':
        return !value.includes('linkedin.com') ? "Must be a valid LinkedIn URL (e.g. linkedin.com/in/...)" : "";
      case 'scholar':
        return !value.includes('scholar.google.com') ? "Must be a valid Google Scholar URL" : "";
      case 'instagram':
        return (!value.startsWith('@') && !value.includes('instagram.com')) ? "Must be a valid handle (@username) or Instagram URL" : "";
      case 'facebook':
        return !value.includes('facebook.com') ? "Must be a valid Facebook URL" : "";
      default:
        return "";
    }
  }

  const handle = (key, value) => {
    const error = validate(key, value);
    setErrors(prev => ({ ...prev, [key]: error }));
    onChange({ ...social, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-700">LinkedIn</label>
          <input
            value={social.linkedin || ""}
            readOnly={!editable}
            onChange={(e) => handle("linkedin", e.target.value)}
            className={`w-full mt-2 p-3 border rounded-md ${errors.linkedin ? 'border-red-500 focus:border-red-500' : 'border-gray-100'}`}
            placeholder="linkedin.com/in/username"
          />
          {errors.linkedin && <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-700">Google Scholar</label>
          <input
            value={social.scholar || ""}
            readOnly={!editable}
            onChange={(e) => handle("scholar", e.target.value)}
            className={`w-full mt-2 p-3 border rounded-md ${errors.scholar ? 'border-red-500 focus:border-red-500' : 'border-gray-100'}`}
            placeholder="scholar.google.com/citations?user=..."
          />
          {errors.scholar && <p className="text-red-500 text-xs mt-1">{errors.scholar}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700">Instagram</label>
          <input
            value={social.instagram || ""}
            readOnly={!editable}
            onChange={(e) => handle("instagram", e.target.value)}
            className={`w-full mt-2 p-3 border rounded-md ${errors.instagram ? 'border-red-500 focus:border-red-500' : 'border-gray-100'}`}
            placeholder="@username"
          />
          {errors.instagram && <p className="text-red-500 text-xs mt-1">{errors.instagram}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-700">Facebook</label>
          <input
            value={social.facebook || ""}
            readOnly={!editable}
            onChange={(e) => handle("facebook", e.target.value)}
            className={`w-full mt-2 p-3 border rounded-md ${errors.facebook ? 'border-red-500 focus:border-red-500' : 'border-gray-100'}`}
            placeholder="facebook.com/username"
          />
          {errors.facebook && <p className="text-red-500 text-xs mt-1">{errors.facebook}</p>}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
