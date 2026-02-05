import Image from 'next/image';

export default function Logo() {
  return (
    <div 
      className="inline-flex items-center py-1 gap-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-800 dark:focus-visible:ring-gray-300 rounded-lg transition-all duration-300 hover:scale-105">
      <div className="relative w-32 h-14">
        <Image 
          src="https://res.cloudinary.com/dqznmhhtv/image/upload/v1769211087/edunify-logo_ntnwbi.png" 
          alt="Edunify Logo"
          fill
          className="object-contain filter brightness-110 contrast-110"
          priority
        />
      </div>
    </div>
  );
}