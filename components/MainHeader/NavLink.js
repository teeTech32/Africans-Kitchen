"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLink({href, children}){
  const path = usePathname()

  return<Link href={href}>
          <nav className={`cursor-pointer  ${ path.startsWith(href) ? 'text-transparent bg-gradient-to-r from-yellow-300 via-red-600 to-orange-400 bg-clip-text transition-all duration-500' : 'text-white'} drop-shadow-lg hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  translate-0.5 scale-110 text-xs md:text-sm xl:text-lg font-bold mx-4 md:m-4 mb-2`}>
            {children}
          </nav>
        </Link>
}