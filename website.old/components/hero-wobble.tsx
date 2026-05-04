"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WobbleCard } from "@/components/ui/wobble-card";

export function HeroWobble() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full px-4 py-20">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-blue-600 to-blue-800 min-h-[500px] lg:min-h-[400px]"
        className=""
      >
        <div className="max-w-xl">
          <h2 className="text-left text-balance text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight text-white">
            Your Campus Marketplace
          </h2>
          <p className="mt-4 text-left text-base md:text-lg text-blue-100">
            Buy and sell everything you need for university life. From textbooks
            to tech, connect with students on your campus.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="mt-6 bg-white text-blue-600 hover:bg-blue-50"
            >
              Start Shopping
            </Button>
          </Link>
        </div>
        <Image
          src="/university-students-studying-with-laptops-and-book.jpg"
          width={400}
          height={400}
          alt="Students shopping"
          className="absolute -right-4 lg:-right-[20%] filter brightness-110 -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>

      <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-green-600 to-green-800">
        <h2 className="max-w-80 text-left text-balance text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-white">
          Sell Your Items Fast
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base text-green-100">
          List your items in minutes and reach thousands of students on your
          campus.
        </p>
        <Link href="/sell">
          <Button
            variant="outline"
            size="lg"
            className="mt-6 border-white text-white hover:bg-white/10 bg-transparent"
          >
            Start Selling
          </Button>
        </Link>
      </WobbleCard>

      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-purple-600 to-indigo-800 min-h-[400px] lg:min-h-[300px]">
        <div className="max-w-2xl">
          <h2 className="text-left text-balance text-xl md:text-2xl lg:text-4xl font-semibold tracking-tight text-white">
            Join Thousands of Students
          </h2>
          <p className="mt-4 max-w-[32rem] text-left text-base md:text-lg text-purple-100">
            VarsityMart connects students across campuses for safe, convenient,
            and affordable buying and selling.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                Sign Up Free
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        <Image
          src="/diverse-college-students-using-mobile-phones-shopp.jpg"
          width={500}
          height={400}
          alt="Students using VarsityMart"
          className="absolute -right-10 md:-right-[30%] lg:-right-[15%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
