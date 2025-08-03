"use client";

import Image from "next/image";
import Link from "next/link";
import SearchForm from "@/app/app/SearchForm";
import { FaRocket, FaFlag } from "react-icons/fa";
import CopyrightToggle from '../components/CopyrightToggle';
import { usePathname } from 'next/navigation';

export default function App() {
  const pathname = usePathname();
  const isApp = pathname === '/app';

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen px-4 py-2 gap-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-12 lg:py-6 md:gap-3 font-[family-name:var(--font-geist-sans)] bg-paper">
      <header className="row-start-1 w-full flex justify-between items-center">
        <Link href="https://humanmode.id">
          <h1 className="text-xl sm:text-2xl font-serif flex items-center">
            <span className="italic">human</span>
            <Image
              src="/logos/Logo_black.svg"
              alt="Human Mode Logo"
              width={24}
              height={24}
              className="h-[0.5em] w-auto object-contain mx-1 mt-1"
            />
            <span className="font-bold">mode</span>
          </h1>
        </Link>
      </header>
      
      <main className="flex flex-col gap-6 sm:gap-[32px] row-start-2 self-center justify-self-center w-full max-w-xl">
        <div className="flex flex-col items-center text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-bold">Certified Human<span className="text-xl sm:text-2xl align-super">©</span></h2>
          <p className="text-xs sm:text-sm mt-1">Helping small artisans stand out</p>
        </div>

        <SearchForm />
      </main>
      <footer className="row-start-3 flex justify-center py-4 flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <p className="text-sm mb-3 text-gray-600">We support</p>
          <div className="flex items-center gap-4">
            <a href="https://www.etsy.com" target="_blank" rel="noopener noreferrer" className="h-6">
              <Image 
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Etsy_logo.svg"
                alt="Etsy"
                width={60}
                height={24}
                className="h-6 w-auto"
              />
            </a>
            <a href="https://www.redbubble.com" target="_blank" rel="noopener noreferrer" className="h-6">
              <Image 
                src="https://upload.wikimedia.org/wikipedia/commons/2/27/Redbubble_logo.svg"
                alt="Redbubble"
                width={90}
                height={24}
                className="h-6 w-auto"
              />
            </a>
            <a href="https://www.alibaba.com" target="_blank" rel="noopener noreferrer" className="h-6">
              <Image 
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Alibaba_en_logo.svg"
                alt="Alibaba"
                width={90}
                height={24}
                className="h-6 w-auto"
              />
            </a>
          </div>
        </div>
        <div className="flex items-center">
          <CopyrightToggle />
        </div>
      </footer>
    </div>
  );
} 