"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

type NavbarProps = {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function NavLink({href, children, className}: NavbarProps){
  const path = usePathname()

  return<Link href={href}>
          <nav className={`cursor-pointer ${className ?? ""}  ${ path.startsWith(href) ? 'text-transparent bg-gradient-to-r from-yellow-300 via-red-600 to-orange-400 bg-clip-text transition-all duration-500' : 'text-white'} drop-shadow-lg hover:drop-shadow-[0_0_10px_rgba(236,92,153,20)]  translate-transform scale-105 text-xs md:text-sm xl:text-lg font-bold px-4 py-1 md:m-4 mb-2`}>
            {children}
          </nav>
        </Link>
}
