import type { FC, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import NavBar from "./NavBar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  // Removed unused variable 'user'
  const {} = useAuth();

  // AppLayout is only used for authenticated pages, so always show NavBar
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="pt-0">{children}</main>
    </div>
  );
};

export default AppLayout;
