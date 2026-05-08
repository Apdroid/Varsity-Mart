import Link from "next/link"
import { PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
        <PackageSearch className="h-9 w-9 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-bold">Product not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This listing may have been removed or the link is broken.
        </p>
      </div>
      <Button asChild className="bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90">
        <Link href="/search">Browse similar products</Link>
      </Button>
    </div>
  )
}
