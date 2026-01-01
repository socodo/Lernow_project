// DateOfBirth: trường nhập ngày sinh (tùy chọn) và chú thích
const DateOfBirth = ({
  editable = false,
  profile = {},
  onChange = () => { },
}) => {
  const value = profile.dob || "";

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Date of Birth{" "}
        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">
          Optional
        </span>
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="w-64 border border-gray-300 rounded-md p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          readOnly={!editable}
          disabled={!editable}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateOfBirth;
