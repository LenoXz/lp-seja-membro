import Image from "next/image";

export default function CaldeiraLogo({
  variant = "light",
  width = 72,
  height = 80,
}: {
  variant?: "light" | "dark";
  width?: number;
  height?: number;
}) {
  const src = variant === "light" ? "/logo-caldeira-light.png" : "/logo-caldeira-dark.png";

  return (
    <Image
      src={src}
      alt="Instituto Caldeira"
      width={width}
      height={height}
      className="object-contain"
      priority
    />
  );
}
