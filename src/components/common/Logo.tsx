import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div>
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold px-2">
          LMS
        </div>
      </Link>
    </div>
  );
};

export default Logo;
