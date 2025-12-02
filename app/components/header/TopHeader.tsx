import NavBar from "@/app/components/header/NavBar";

export default function TopHeader() {

    const navigationLinks = [
        { label: 'Matches', href: '/matches' },
        { label: 'Stats', href: '/stats' },
        { label: 'Settings', href: '/settings'  },
        { label: 'Contact', href: '/contact' },
    ];

    return (
    <div>
        <NavBar links={navigationLinks} logoText="Fotbalek.APP" />
    </div>
  );
}
