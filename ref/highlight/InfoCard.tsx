import Image from 'next/image';
import { FaPalette, FaTools, FaMapMarkerAlt, FaLeaf } from 'react-icons/fa';
import CertifiedHumanToggle from './CertifiedHumanToggle';

export default function InfoCard() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between bg-black text-white px-4 py-1">
          <p className="text-sm font-bold font-georgia tracking-wide">Info Card</p>
          <div className="w-8 h-8 relative">
            <Image
              src="/logos/Logo_white.svg"
              alt="Human Mode Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              priority
            />
          </div>
        </div>

        <div className="relative">
          <Image 
            src="/mockup-assets/tarot_header.png" 
            alt="Tarot deck" 
            width={1000}
            height={448}
            className="w-full h-56 object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            quality={85}
          />
          <div className="absolute bottom-4 right-4">
            <CertifiedHumanToggle />
          </div>
        </div>

        <div className="p-6 pb-5">
          <h1 className="text-2xl font-bold mb-1">Luna Arcana Tarot — 78‑Card Deck</h1>
          <p className="text-sm mb-8 text-gray-600">Hand‑illustrated major & minor arcana with gilded edges & guidebook.</p>

          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="circle-icon">
                <FaPalette className="w-5 h-5" />
              </div>
              <div className="grow">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-medium">Original Artwork</h2>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">Verified</span>
                </div>
                <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
                  <li><strong>94% confidence</strong> — unique illustration hashes & zero stock‑art matches</li>
                  <li><strong>Digital artwork</strong> crafted in Procreate, on base of hand-scanned <strong>ink tracings</strong></li>
                  <li>Seller credits <strong>Luna M.</strong>, a UK-based artist trained at Camberwell College of Arts</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="circle-icon">
                <FaTools className="w-5 h-5" />
              </div>
              <div className="grow">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-medium">Indie Printed • First Edition</h2>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">Verified</span>
                </div>
                <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
                  <li>Printed by <strong>Starlith Print House</strong> – Nottingham, UK</li>
                  <li>Vegetable‑based offset lithography</li>
                  <li>Gilding by <strong>Aurora Foils</strong> – Birmingham</li>
                  <li>Collated & boxed in‑studio – Devon</li>
                  <li>Limited run: 500 decks</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="circle-icon">
                <FaMapMarkerAlt className="w-5 h-5" />
              </div>
              <div className="grow">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-medium">Locally Sourced</h2>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">Verified</span>
                </div>
                <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
                  <li>FSC paper • Somerset Paper Mill (120 km)</li>
                  <li>Eco‑solvent inks • Bristol Ink Co. (186 km)</li>
                  <li>Hemp pouch • Celtic Weave (34 km)</li>
                  <li>Packaging • GreenWrap UK (5 km)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="circle-icon">
                <FaLeaf className="w-5 h-5" />
              </div>
              <div className="grow">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-medium">Eco‑Footprint</h2>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">Verified</span>
                </div>
                <table className="w-full text-[11px] text-gray-600 mb-1">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-0.5 pr-2">Paper production</td>
                      <td className="py-0.5 text-right">0.18 kg CO₂</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-0.5 pr-2">Printing & gilding</td>
                      <td className="py-0.5 text-right">0.25 kg CO₂</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 pr-2">Packaging + UK shipping</td>
                      <td className="py-0.5 text-right">0.07 kg CO₂</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[10px] text-gray-600">Total 0.50 kg CO₂ / deck • Plastic‑free mailer.</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full ring-2 ring-emerald-600 overflow-hidden relative flex items-center justify-center">
              <Image
                src="/mockup-assets/Luna Arcana avatar.png"
                alt="Luna Arcana avatar"
                width={48}
                height={48}
                className="object-cover"
                sizes="48px"
                quality={85}
              />
            </div>
            <div className="grow">
              <p className="text-sm font-semibold">Luna Arcana Studio</p>
              <p className="text-xs text-gray-600">Devon, UK · Est. 2021 · 812 sales · ★4.95</p>
            </div>
            <a
              href="https://www.etsy.com/shop/LunaArcanaStudio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium hover:underline"
            >
              Visit shop on Etsy <span className="icon-green">↗︎</span>
            </a>
          </div>

          <div className="relative bg-emerald-50 text-gray-600 text-sm italic rounded-lg p-4 mt-4 mb-8">
            <span className="absolute -top-2 left-8 w-0 h-0 border-l-8 border-transparent border-r-8 border-transparent border-b-8 border-b-emerald-50"></span>
            <strong className="not-italic text-emerald-600">This seller says:</strong> "Our tarot illustrations draw on centuries‑old esoteric wood‑cut traditions, infused with modern folk symbolism. Each image was sketched under the full moon in Dartmoor..." <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer hover:underline">click for more</span>
          </div>

          <p className="inline-block bg-paper rounded-lg px-3 py-2 text-[11px] text-gray-600 mb-8">
            Data aggregated from opt-in seller contributions & Etsy listing metadata. Scores auto‑refresh with updates.
          </p>

          <p className="text-center text-xs mb-6 font-georgia font-bold">
            Find out more about supporting small businesses <a href="#" className="text-emerald-600 underline font-bold">here</a>.
          </p>
          <p className="text-center text-[10px] text-gray-500">
            The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.
          </p>
        </div>
      </div>
    </div>
  );
} 