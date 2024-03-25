import { db } from "@/lib/db";
import Button from "@/components/ui/Button";

export default async function Home() {
  return (
    <div>
      <Button variant={"default"}>Hello</Button>
    </div>
  );
}
