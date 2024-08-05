"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Fallback() {
  const router = useRouter();
  const reload = () => {
    startTransition(() => {
      router.refresh();
    });
  };
  return (
    <div>
      <p>Algo deu errado, tente novamente</p>
      <button onClick={reload}>Recarregar</button>
    </div>
  );
}
