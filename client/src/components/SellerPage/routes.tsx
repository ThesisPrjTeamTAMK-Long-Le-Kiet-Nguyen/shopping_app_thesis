import { lazy } from 'react';
import type { LazyExoticComponent } from 'react';
import type { ComponentType } from 'react';

// Lazy load all admin components
const AdminComponents = {
  SellerPage: lazy(() => import('./SellerPage')),
  OrderAdmin: lazy(() => import('./OrderAdmin')),
  RacketManagement: lazy(() => import('./ProductManagement/Racket/RacketManagement')),
  BagManagement: lazy(() => import('./ProductManagement/Bag/BagManagement')),
  ShoeManagement: lazy(() => import('./ProductManagement/Shoe/ShoeManagement')),
  StringingManagement: lazy(() => import('./ProductManagement/Stringing/StringingManagement')),
  GripManagement: lazy(() => import('./ProductManagement/Grip/GripManagement')),
  ShuttlecockManagement: lazy(() => import('./ProductManagement/Shuttlecock/ShuttlecockManagement')),
};

// Type-safe route configuration
export interface AdminRoute {
  path: string;
  Component: LazyExoticComponent<ComponentType>;
}

// Admin routes configuration
export const adminRoutes: AdminRoute[] = [
  { path: '/seller', Component: AdminComponents.SellerPage },
  { path: '/seller/orders', Component: AdminComponents.OrderAdmin },
  { path: '/seller/rackets', Component: AdminComponents.RacketManagement },
  { path: '/seller/bags', Component: AdminComponents.BagManagement },
  { path: '/seller/shoes', Component: AdminComponents.ShoeManagement },
  { path: '/seller/stringings', Component: AdminComponents.StringingManagement },
  { path: '/seller/grips', Component: AdminComponents.GripManagement },
  { path: '/seller/shuttlecocks', Component: AdminComponents.ShuttlecockManagement },
]; 