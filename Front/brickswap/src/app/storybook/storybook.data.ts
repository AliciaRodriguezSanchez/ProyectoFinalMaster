import type { UiCarrouselItem } from '../shared/components/carrousel/carrousel.interface';

export const brickImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"%3E%3Crect width="320" height="320" fill="%23f8fafc"/%3E%3Crect x="58" y="104" width="204" height="128" rx="18" fill="%23e11d48"/%3E%3Crect x="82" y="76" width="48" height="42" rx="12" fill="%23fb7185"/%3E%3Crect x="136" y="76" width="48" height="42" rx="12" fill="%23fb7185"/%3E%3Crect x="190" y="76" width="48" height="42" rx="12" fill="%23fb7185"/%3E%3Cpath d="M84 160h152M84 196h108" stroke="%23fff" stroke-width="16" stroke-linecap="round" opacity=".75"/%3E%3C/svg%3E';

export const bannerImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop stop-color="%230f172a"/%3E%3Cstop offset=".55" stop-color="%232563eb"/%3E%3Cstop offset="1" stop-color="%23facc15"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="520" fill="url(%23g)"/%3E%3Cg opacity=".92"%3E%3Crect x="710" y="115" width="250" height="150" rx="22" fill="%23ef4444"/%3E%3Crect x="755" y="70" width="56" height="58" rx="16" fill="%23f87171"/%3E%3Crect x="835" y="70" width="56" height="58" rx="16" fill="%23f87171"/%3E%3Crect x="915" y="70" width="56" height="58" rx="16" fill="%23f87171"/%3E%3Crect x="815" y="255" width="255" height="146" rx="22" fill="%2322c55e"/%3E%3Crect x="860" y="210" width="56" height="58" rx="16" fill="%2386efac"/%3E%3Crect x="940" y="210" width="56" height="58" rx="16" fill="%2386efac"/%3E%3Crect x="1020" y="210" width="56" height="58" rx="16" fill="%2386efac"/%3E%3C/g%3E%3C/svg%3E';

export const categoryItems: UiCarrouselItem[] = [
  { icon: 'CITY', color: '#0284c7', text: 'City' },
  { icon: 'STAR', color: '#7c3aed', text: 'Star Wars' },
  { icon: 'TECH', color: '#16a34a', text: 'Technic' },
  { icon: 'IDEA', color: '#dc2626', text: 'Ideas' },
  { icon: 'CAST', color: '#ca8a04', text: 'Castillos' },
  { icon: 'MINI', color: '#0891b2', text: 'Minifiguras' }
];
