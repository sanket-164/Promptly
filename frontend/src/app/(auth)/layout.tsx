import React from "react";
import { FloatingPaths } from "../_components/FloatingPath";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div>
      <div className="fixed inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
