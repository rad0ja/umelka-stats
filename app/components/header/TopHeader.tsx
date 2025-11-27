import NavBar from "@/app/components/header/NavBar";

export default function TopHeader() {

    const navigationLinks = [
        { label: 'Home', href: '/',icon: '🏠' },
        { label: 'Matches', href: '/matches', icon: '🏠' },
        { label: 'About', href: '/about', icon: '🏠' },
        { label: 'Contact', href: '/contact', icon: '🏠' },
    ];

    return (
    <div>
        <NavBar links={navigationLinks} logoText="Fotbalek.APP" />
    </div>
  );
}
