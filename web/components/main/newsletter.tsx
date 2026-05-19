'use client';
import {MailboxIcon} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
function Newsletter() {
	return (
		<div className=" pb-10 bg-card">
			<div className="flex flex-col gap-6 vm-section md:flex-row md:items-center md:justify-between">
				<div className="max-w-md">
					<h3 className="text-2xl font-bold tracking-tight">
						Get campus deals in your inbox
					</h3>
					<p className="mt-1.5 text-sm">
						Weekly drops, hostel essentials, and KNUST-only offers — no spam.
					</p>
				</div>

				<form className="flex w-full md:max-w-md gap-2">
					<div className="relative flex-1">
						<MailboxIcon weight="bold" size={32} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 " />
						<Input
							type="email"
							placeholder="your.name@knust.edu.gh"
							className="h-11 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 border-none rounded-lg"
						/>
					</div>
					<Button
						type="submit"
						className="h-11 rounded-md px-5 font-semibold bg-vm-tangerine hover:opacity-90"
					>
						Subscribe
					</Button>
				</form>
			</div>
		</div>
	)
};

export default Newsletter;
