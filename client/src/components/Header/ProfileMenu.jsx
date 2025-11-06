import { NavLink} from "react-router-dom";

const ProfileMenu = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(signOut());
    navigate("/");
    onClose?.();
  };

  return (
    <div className="flex flex-col py-2 rounded-lg border border-gray-100 bg-white shadow-lg w-48">
      <NavLink
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
        onClick={onClose}
      >
        My Profile
      </NavLink>
      <NavLink
        to="/my-properties"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
        onClick={onClose}
      >
        My Properties
      </NavLink>
      <button
        onClick={handleSignOut}
        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
      >
        Sign Out
      </button>
    </div>
  );
};