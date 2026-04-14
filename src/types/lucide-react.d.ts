declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  
  export interface LucideIcon extends FC<SVGProps<SVGSVGElement>> {}
  
  export const Search: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const User: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const MapPin: LucideIcon;
  export const Bell: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Heart: LucideIcon;
  export const Share2: LucideIcon;
}
