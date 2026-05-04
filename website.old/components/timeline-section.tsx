"use client"
import { Timeline } from "@/components/ui/timeline"

export function TimelineSection() {
  const data = [
    {
      title: "Step 1",
      content: (
        <div>
          <p className="mb-8 text-sm md:text-base font-normal text-neutral-800 dark:text-neutral-200">
            Browse thousands of items listed by students on your campus. From textbooks to electronics, furniture to
            fashion.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/textbooks-stacked-on-desk.jpg"
              alt="textbooks"
              width={400}
              height={300}
              className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
            />
            <img
              src="/laptop-computer-on-student-desk.jpg"
              alt="electronics"
              width={400}
              height={300}
              className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2",
      content: (
        <div>
          <p className="mb-8 text-sm md:text-base font-normal text-neutral-800 dark:text-neutral-200">
            Connect with sellers directly through our secure messaging system. Ask questions, negotiate prices, and
            arrange meetups.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/students-chatting-on-phone-app.jpg"
              alt="messaging"
              width={400}
              height={300}
              className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
            />
            <img
              src="/handshake-deal-between-students.jpg"
              alt="deal"
              width={400}
              height={300}
              className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 3",
      content: (
        <div>
          <p className="mb-4 text-sm md:text-base font-normal text-neutral-800 dark:text-neutral-200">
            Complete your transaction safely on campus with our built-in safety features and guidelines.
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
              ✓ Meet in public campus locations
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
              ✓ Verify student IDs
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
              ✓ Use secure payment methods
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
              ✓ Leave reviews and ratings
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/happy-students-exchanging-items-on-campus.jpg"
              alt="exchange"
              width={400}
              height={300}
              className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
            />
            <img
              src="/students-giving-thumbs-up-review.jpg"
              alt="review"
              width={400}
              height={300}
              className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="relative w-full overflow-clip bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-2xl md:text-5xl mb-4 text-black dark:text-white font-bold">How VarsityMart Works</h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-2xl">
          Getting started is easy. Follow these simple steps to buy or sell on your campus marketplace.
        </p>
      </div>
      <Timeline data={data} />
    </div>
  )
}
