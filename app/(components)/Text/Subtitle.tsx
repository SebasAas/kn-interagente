import React from "react";

function Subtitle({ children }: { children: React.ReactNode }) {
  return <h2 className="uppercase font-bold text-gray-600">{children}</h2>;
}

export default Subtitle;
