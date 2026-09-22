import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { CommandMenu } from "./CommandMenu";
import { MobileNav } from "./MobileNav";
import { HeaderNav } from "./HeaderNav";
import { GitHubIcon } from "./Icons";
import "./Header.css";

const GITHUB_URL = "https://github.com/loamui/loamui";

export function Header() {
  return (
    <header className="site-Header">
      <div className="inner">
        <div className="left">
          <MobileNav />
          <Logo />
          <HeaderNav />
        </div>

        <div className="right">
          <HeaderNav resources />
          <CommandMenu />
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="LoamUI on GitHub">
            <GitHubIcon width={16} height={16} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
