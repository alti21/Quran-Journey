"use client";

import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
}

export default function NavButton({ href, children }: Props) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="text-emerald-700 hover:text-emerald-900 transition-all font-medium"
      >
        {children}
      </Link>
   </div>
  )
}