import CaldeiraLogo from "./CaldeiraLogo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto flex max-w-[1920px] flex-col items-center gap-4 text-center">
        <CaldeiraLogo variant="light" width={48} height={54} />
        <p className="font-body text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Instituto Caldeira. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
