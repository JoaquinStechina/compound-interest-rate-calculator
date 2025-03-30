import ButtonBar from "./ButtonBar";

const Header: React.FC = () => {
  return (
    <header className="sticky pl-1 pr-5 pt-2 pb-2 grid grid-cols-2 border border-t-0 border-l-0 border-r-0 border-2 border-dashed flex items-center">
      <nav>
        <h1 className="text-xl">Compound Interest Calculator</h1>
      </nav>
      <ButtonBar />
    </header>
  );
};

export default Header;
