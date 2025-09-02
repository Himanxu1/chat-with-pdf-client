import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Pricing() {
  const router = useRouter();
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">
          Fair pricing for every workload
        </h2>
        <p className="mt-3 text-muted-foreground">
          Start free. Upgrade when you need more documents and larger files.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <p className="text-sm text-muted-foreground">
              Best for trying things out
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">$0</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• 3 chats/month</li>
              <li>• Up to 10MB per file</li>
              <li>• Citations & summaries</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Get started
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-accent">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <p className="text-sm text-muted-foreground">
              For students and professionals
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              $12
              <span className="text-base font-normal text-muted-foreground">
                /mo
              </span>
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• 200 chats/month</li>
              <li>• Up to 50MB per file</li>
              <li>• Priority processing</li>
              <li>• Export chats</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full border-accent text-foreground hover:bg-accent/10 bg-transparent"
            >
              Upgrade
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
