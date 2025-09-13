// src/components/Auth/SignOut.jsx
export default function SignOut({ onSignOut, closeDropdown }) {
  const handleSignOut = () => {
    if (closeDropdown) closeDropdown();
    if (onSignOut) onSignOut();
    else console.log("Signed out!");
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-semibold"
    >
      Sign Out
    </button>
  );
}
