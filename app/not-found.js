import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className=" w-[287px]">
        <Image
          src="/404.png"
          alt="404"
          width={500}
          height={500}
        />

      </div>
      <div className="text-center mt-4">
        <h1 className="text-4xl font-black text-gray-900 mb-2">OOPS!</h1>
        <p className="text-lg font-semibold text-gray-700 mb-8">
          PAGE NOT FOUND
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/80 transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}