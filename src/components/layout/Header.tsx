'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#anasayfa', label: 'Anasayfa' },
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '#hakkimizda', label: 'Hakkımızda' },
  { href: '#iletisim', label: 'İletişim' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-black/80 backdrop-blur-md py-3 shadow-lg'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#anasayfa"
            onClick={(e) => handleNavClick(e, '#anasayfa')}
            className="flex items-center"
          >
            <span className="font-serif text-xl md:text-2xl font-bold italic text-white tracking-wide">
              Baran Atay <span className="text-primary-300">Hair Art</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  'text-white/80 hover:text-white font-medium text-sm uppercase tracking-wider',
                  'transition-colors duration-200 relative',
                  'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5',
                  'after:bg-primary-300 after:transition-all after:duration-300',
                  'hover:after:w-full'
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Menüyü aç"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-white/80 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
