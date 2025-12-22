import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navLinks = [
  { to: "/my-courses", label: "header.myCourses" },
  { to: "/about", label: "header.about" },
  { to: "/settings", label: "header.settings" },
];

export default function NavLinks({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`${className} text-neutral-700 hover:text-primary-600 transition-colors`}
        >
          {t(link.label)}
        </Link>
      ))}
    </>
  );
}
