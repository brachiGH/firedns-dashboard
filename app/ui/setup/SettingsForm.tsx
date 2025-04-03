"use client";
export default function SettingsForm() {
  const handleEmailChange = () => {
    // Logic for changing email
    console.log("Email changed");
  };
  const handlePasswordChange = () => {
    // Logic for changing password
    console.log("Password changed");
  };
  const handleAccountDeletion = () => {
    // Logic for deleting account
    console.log("Account deleted");
  };
  const handleClearLogs = () => {
    // Logic for clearing logs
    console.log("Logs cleared");
  };
  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Change Email Section */}
      <div className="p-6 border border-gray-200 rounded shadow bg-gray-800">
        <h2 className="text-lg font-bold mb-2 text-gray-100">Change Email</h2>
        <input
          type="email"
          placeholder="Enter new email"
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={handleEmailChange}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 transition"
        >
          Update Email
        </button>
      </div>
      {/* Change Password Section */}
      <div className="p-6 border border-gray-200 rounded shadow bg-gray-800">
        <h2 className="text-lg font-bold mb-2 text-gray-100">
          Change Password
        </h2>
        <input
          type="password"
          placeholder="Current password"
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <h4 className="text-lg font-bold mb-2 text-gray-100">Enter new password</h4>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="password"
          placeholder="Re-enter new password"
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={handlePasswordChange}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 transition"
        >
          Update Password
        </button>
      </div>
      {/* Delete Account Section */}
      <div className="p-6 border border-gray-200 rounded shadow bg-gray-800">
        <h2 className="text-lg font-bold mb-2 text-orange-500">
          Delete Account
        </h2>
        <p className="text-sm text-gray-300 mb-2">
          Warning: This action is irreversible.
        </p>
        <button
          onClick={handleAccountDeletion}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>
      {/* Clear Logs Section */}
      <div className="p-6 border border-gray-200 rounded shadow bg-gray-800">
        <h2 className="text-lg font-bold mb-2 text-gray-100">Clear Logs</h2>
        <button
          onClick={handleClearLogs}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
}
