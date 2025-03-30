import { ModeToggle } from "./ModeToggle";
import { Button } from "../ui/button";
import Instagram from "../ui/Instagram";
import Linkedin from "../ui/Linkedin";
import Portfolio from "../ui/Portfolio";
const Header: React.FC = () => {
  return (
    <header className="sticky pl-1 pr-5 pt-2 pb-2 grid grid-cols-2 border border-t-0 border-2 border-dashed flex items-center">
      <nav>
        <h1 className="text-xl">Compound Interest Calculator</h1>
      </nav>
      <nav className="flex justify-end gap-4 items-center">
        <Button variant={"ghost"} size={"sm"}>
          <a href="https://www.instagram.com/joaquin_stechina/">
            <Instagram
              className="text-primary dark:text-primary"
              height={24}
              width={24}
            />
          </a>
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          <a href="https://www.linkedin.com/in/joaquinstechina/">
            <Linkedin
              className="text-primary hover:text-primary/70 hover:scale-110 dark:text-primary dark:hover:text-primary/90 transition"
              height={24}
              width={24}
            />
          </a>
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          <a href="https://portfolio-joaquinstechina.vercel.app/">
            <Portfolio
              className="text-primary hover:text-primary/70 hover:scale-110 dark:text-primary dark:hover:text-primary/90 transition"
              height={24}
              width={24}
            />
          </a>
        </Button>
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Header;
