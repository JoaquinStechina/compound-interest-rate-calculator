import Link from "next/link";
import { Button } from "../ui/button";
import Github from "../ui/Github";
import Instagram from "../ui/Instagram";
import Linkedin from "../ui/Linkedin";
import Portfolio from "../ui/Portfolio";
import { ModeToggle } from "./ModeToggle";

const ButtonBar: React.FC = () => {
  return (
    <nav className="flex justify-end gap-4 items-center">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 px-0">
        <Link
          href={"https://github.com/JoaquinStechina/"}
          target="_blank"
          rel="noreferrer"
        >
          <Github className="text-primary dark:text-primary" />
          <span className="sr-only">GitHub</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 px-0">
        <Link
          href={"https://www.instagram.com/joaquin_stechina/"}
          target="_blank"
          rel="noreferrer"
        >
          <Instagram className="text-primary dark:text-primary" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 px-0">
        <Link
          href={"https://www.linkedin.com/in/joaquinstechina/"}
          target="_blank"
          rel="noreferrer"
        >
          <Linkedin className="text-primary dark:text-primary" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="h-8 w-8 px-0">
        <Link
          href={"https://portfolio-joaquinstechina.vercel.app/"}
          target="_blank"
          rel="noreferrer"
        >
          <Portfolio className="text-primary dark:text-primary" />
        </Link>
      </Button>
      <ModeToggle />
    </nav>
  );
};

export default ButtonBar;
