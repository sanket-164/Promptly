import AuthProvider from "@/components/AuthProvider";
import Navbar from "./_components/Navbar";
import { FloatingPaths } from "../_components/FloatingPath";

type Props = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
  return (
    <AuthProvider>
      <Navbar />
      <FloatingPaths position={-1} />
      {children}
    </AuthProvider>
  );
};

export default HomeLayout;
