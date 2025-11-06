import { NavLink} from "react-router-dom";
// Navigation items
const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Buy", path: "/properties/buy" },
  { name: "Rent", path: "/properties/rent" },
  { name: "Sale", path: "/properties/sale" },
  { name: "All", path: "/properties" },
];
const NavItem = ({ item, onClick }) => {
  const getLinkClass = ({ isActive }) =>
    `block hover:text-blue-500 transition-colors duration-300 ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-800"
    }`;

  return (
    <NavLink
      to={item.path}
      className={getLinkClass}
      onClick={onClick}
      end={item.path === "/properties"}
    >
      {item.name}
    </NavLink>
  );
};

export default NavItem