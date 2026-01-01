// AboutMe: ô nhập mô tả ngắn của người dùng, kèm hiển thị số ký tự
import { useState, useEffect } from "react";

const AboutMe = ({ editable = false, profile = {}, onChange = () => {} }) => {
  const [text, setText] = useState(profile.about || "");
  const min = 40;

  useEffect(() => setText(profile.about || ""), [profile.about]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
      <textarea
        className="w-full border border-gray-100 rounded-md p-3 text-gray-700"
        rows={4}
        value={text}
        readOnly={!editable}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
      />
      <div className="flex justify-between items-center mt-2">
        <div
          className={`text-sm ${
            text.length < min ? "text-orange-500" : "text-gray-500"
          }`}
        >
          {text.length < min
            ? `Add at least ${min - text.length} more characters`
            : `${text.length}/300`}
        </div>
        <div className="text-sm text-gray-400">{text.length}/300</div>
      </div>
    </div>
  );
};

export default AboutMe;
