import { createFileRoute } from "@tanstack/react-router";
import DestinationsPage from "./destinations.index";

// Alias — reuse destinations listing for /packages
export const Route = createFileRoute("/packages")({
  component: (DestinationsPage as any).Route?.options?.component ?? (() => null),
  head: () => ({ meta: [{ title: "Packages — RATHGO" }] }),
});
