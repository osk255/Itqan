import { routes } from "@/lib/site";
import { PillLink } from "@/components/ui/primitives";
import { CollaborateBand } from "@/components/sections/shared";

/** Closing band on the product listing pages. */
export function ProductsCta() {
  return (
    <CollaborateBand>
      <PillLink href={routes.contactCooperation}>Become a Partner</PillLink>
      <PillLink href={routes.contactProduct()} variant="ghost">
        Contact Us
      </PillLink>
    </CollaborateBand>
  );
}
