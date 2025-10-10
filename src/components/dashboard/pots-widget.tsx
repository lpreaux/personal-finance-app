import { PotsOutlineIcon } from "~/components/icons";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { PotItem } from "./pot-item";
import { SectionHeader } from "./section-header";

interface Pot {
  name: string;
  amount: string;
  color: string;
}

interface PotsWidgetProps {
  totalSaved: string;
  pots: Pot[];
  className?: string;
}

export function PotsWidget({ totalSaved, pots, className }: PotsWidgetProps) {
  return (
    <Card asChild className={cn("py-6", className)}>
      <section aria-labelledby="pots-heading">
        <SectionHeader
          id="pots-heading"
          title="Pots"
          href="/dashboard/pots"
          srOnlyText="for savings pots"
        />
        <div className={cn("flex flex-col gap-5", "tablet:flex-row")}>
          <Card
            asChild
            className={cn(
              "flex items-center gap-4 bg-orange-100 p-4",
              "tablet:w-5/12",
            )}
          >
            <article aria-label="Total savings summary">
              <PotsOutlineIcon className="text-teal-800" aria-hidden="true" />
              <dl>
                <dt className="text-preset-4 text-gray-500">Total Saved</dt>
                <dd className="text-preset-1">{totalSaved}</dd>
              </dl>
            </article>
          </Card>
          <ul className="grid flex-grow grid-cols-2 gap-4" role="list">
            {pots.map((pot) => (
              <PotItem
                key={pot.name}
                name={pot.name}
                amount={pot.amount}
                color={pot.color}
              />
            ))}
          </ul>
        </div>
      </section>
    </Card>
  );
}
