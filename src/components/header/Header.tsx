import { ModeToggle } from "./ModeToggle";
import { Button } from "../ui/button";
import Instagram from "../ui/Instagram";
const Header: React.FC = () => {
  return (
    <header>
      <nav className="flex items-center">
        <Instagram className="dark:text-white" />
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Header;
