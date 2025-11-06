import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
}

function NavButton({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="text-emerald-700 hover:text-emerald-900 transition-all font-medium"
    >
      {children}
    </Link>
  )
}

export default NavButton;