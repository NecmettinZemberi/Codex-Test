export type SiteNavItem = {
  href: string;
  label: string;
  showInFooter: boolean;
  showInHeader: boolean;
};

export const siteNavigation: SiteNavItem[] = [
  {
    href: '/',
    label: 'Anasayfa',
    showInFooter: true,
    showInHeader: false,
  },
  {
    href: '/turkuler',
    label: 'Türküler',
    showInFooter: true,
    showInHeader: true,
  },
  {
    href: '/artists',
    label: 'Sanatçılar',
    showInFooter: true,
    showInHeader: true,
  },
  {
    href: '/hakkimizda',
    label: 'Hakkımızda',
    showInFooter: true,
    showInHeader: false,
  },
];

export const footerNavigation = siteNavigation.filter((item) => item.showInFooter);

export const headerNavigation = siteNavigation.filter((item) => item.showInHeader);
