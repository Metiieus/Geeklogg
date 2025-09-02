/**
 * GeekLog Design System - Component Library Index
 *
 * Modern, sophisticated design system inspired by dark mode, gradients,
 * glassmorphism and RPG/fantasy elements.
 */

// ============= TOKENS & FOUNDATIONS =============
export * from "./tokens";
export type {
  ColorToken,
  GradientToken,
  TypographyToken,
  SpacingToken,
  ShadowToken,
  AnimationToken,
  GlassmorphismToken,
} from "./tokens";

// ============= COMPONENTS =============

// Hero & Banners
export { HeroBanner } from "./components/HeroBanner";
export type { HeroBannerProps } from "./components/HeroBanner";

// Glass Components
export {
  GlassInput,
  GlassSelect,
  GlassFilterBar,
} from "./components/GlassInput";

// Navigation & Icons
export {
  GlassIconCard,
  GlassNavigation,
  GlassActionButton,
  mainNavigationItems,
  mediaTypeItems,
  actionItems,
} from "./components/GlassNavigation";

// Media Cards
export { MediaCard } from "./components/MediaCard";
export type { MediaItemDS } from "./components/MediaCard";

// Patterns & Ornaments
export {
  TribalDivider,
  NeonOrnament,
  FloatingParticles,
} from "./components/NeonPatterns";

// ============= UTILITIES =============

// Helper functions from tokens
export { getCategoryColors, getCategoryGradient } from "./tokens";

// ============= COMPONENT EXAMPLES =============

/**
 * USAGE EXAMPLES:
 *
 * // Using Hero Banner
 * import { HeroBanner } from '@/design-system';
 *
 * <HeroBanner
 *   title="Minha Biblioteca"
 *   subtitle="Organize sua jornada geek"
 *   onAddMedia={() => setShowModal(true)}
 * />
 *
 * // Using Glass Input
 * import { GlassInput } from '@/design-system';
 *
 * <GlassInput
 *   placeholder="Buscar..."
 *   value={search}
 *   onChange={(e) => setSearch(e.target.value)}
 *   variant="search"
 * />
 *
 * // Using Media Card
 * import { MediaCard } from '@/design-system';
 *
 * <MediaCard
 *   item={mediaItem}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   variant="default"
 * />
 *
 * // Using Design Tokens
 * import { colors, gradients, shadows } from '@/design-system';
 *
 * const customStyle = {
 *   background: gradients.hero.intrigue,
 *   boxShadow: shadows.glow.violet,
 *   color: colors.text.primary,
 * };
 */

// ============= DESIGN GUIDELINES =============

/**
 * DESIGN PRINCIPLES:
 *
 * 1. **Dark Foundation**: Use #111827 as base background
 * 2. **Glassmorphism**: Leverage backdrop-blur and transparency
 * 3. **Gradient Accents**: Use hero gradients for key elements
 * 4. **Category Colors**: Each media type has unique duotone
 * 5. **Micro-interactions**: Subtle hover states and animations
 * 6. **Typography**: TT Commons with proper hierarchy
 * 7. **Accessibility**: WCAG AA compliant contrast and focus states
 *
 * COLOR USAGE:
 * - Primary Actions: Violet (#8B5CF6) to Cyan (#06B6D4)
 * - Secondary Actions: White/10 with glassmorphism
 * - Success States: Emerald (#10B981)
 * - Warning States: Amber (#F59E0B)
 * - Error States: Red (#EF4444)
 *
 * COMPONENT PATTERNS:
 * - Cards: 2xl border radius, subtle gradients, hover elevation
 * - Inputs: Glassmorphism with focus rings
 * - Buttons: Gradient backgrounds with glow effects
 * - Navigation: Glass cards with tooltips and badges
 */

// ============= DEFAULT EXPORT =============

import {
  colors,
  gradients,
  shadows,
  getCategoryColors,
  getCategoryGradient,
} from "./tokens";

export default {
  // Quick access to core utilities
  colors,
  gradients,
  shadows,
  getCategoryColors,
  getCategoryGradient,
};
