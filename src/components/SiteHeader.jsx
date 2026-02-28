"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-rose-600" />
          <span className="font-semibold">Metrimonial</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <Link href="/blog" className="hover:text-rose-600">Blog</Link>
          <Link href="/about" className="hover:text-rose-600">About</Link>
          <Link href="/contact" className="hover:text-rose-600">Contact</Link>
          <Link href="/login" className="bg-rose-600 hover:bg-rose-700 text-white rounded px-3 py-2">Login</Link>
        </nav>
        <button className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded border" onClick={()=>setOpen(!open)} aria-label="Toggle menu">
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-3 text-sm">
            <Link href="/" onClick={()=>setOpen(false)} className="hover:text-rose-600">Home</Link>
            <Link href="/blog" onClick={()=>setOpen(false)} className="hover:text-rose-600">Blog</Link>
            <Link href="/about" onClick={()=>setOpen(false)} className="hover:text-rose-600">About</Link>
            <Link href="/contact" onClick={()=>setOpen(false)} className="hover:text-rose-600">Contact</Link>
            <Link href="/login" onClick={()=>setOpen(false)} className="bg-rose-600 hover:bg-rose-700 text-white rounded px-3 py-2 text-center">Login</Link>
          </nav>
        </div>
      )}
    </header>
  );
}


