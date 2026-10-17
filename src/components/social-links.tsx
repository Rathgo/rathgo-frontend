import instagramIcon from "@/assets/rathgo-instagram.png";
import youtubeIcon from "@/assets/rathgo-youtube.png";

const socialAccounts = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/chetantravelsnoida?mdxt=emdzaHczM2pqdXU=",
    image: instagramIcon,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@chetantravels?si=8tG9_O1y25w2Olp6",
    image: youtubeIcon,
  },
];

export function SocialLinks() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {socialAccounts.map((account) => (
        <a
          key={account.label}
          href={account.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit Rathgo on ${account.label}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand"
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center overflow-hidden">
            <img
              src={account.image}
              alt=""
              className={`h-5 w-5 object-contain ${account.label === "YouTube" ? "scale-[2.8]" : ""}`}
            />
          </span>
          <span>{account.label}</span>
        </a>
      ))}
    </div>
  );
}
