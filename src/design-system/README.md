# GeekLog Design System

Um design system moderno, sofisticado e envolvente, inspirado em dark mode, gradientes vibrantes, glassmorphism e elementos sutis do universo RPG/fantasia.

## 🎨 Paleta de Cores

### Cores Base - Dark Foundation

```typescript
background: "#111827"; // Primary dark background
surface: "#1F2937"; // Elevated surfaces
overlay: "#374151"; // Modal overlays
border: "#4B5563"; // Subtle borders
```

### Cores de Destaque

```typescript
violet: "#8B5CF6"; // Main violet
cyan: "#06B6D4"; // Main cyan
magenta: "#EC4899"; // Main magenta
```

### Duotones por Categoria

- **Jogos**: Violet (#8B5CF6) → Cyan (#06B6D4)
- **Anime**: Magenta (#EC4899) → Light Magenta (#F472B6)
- **Séries**: Dark Violet (#7C3AED) → Light Violet (#A78BFA)
- **Livros**: Emerald (#059669) → Success Green (#10B981)
- **Filmes**: Red (#DC2626) → Amber (#F59E0B)

## 🌈 Gradientes Hero

### 1. Warm Cold

```css
background: linear-gradient(135deg, #db5375 0%, #b3ffb3 100%);
```

### 2. Intrigue

```css
background: linear-gradient(135deg, #6c33ee 0%, #2dcff0 100%);
```

### 3. Tech Organic

```css
background: linear-gradient(135deg, #ff2d95 0%, #0acdea 100%);
```

## 📝 Tipografia

### Font Family

- **Primary**: TT Commons (com fallback para Inter)
- **Monospace**: Fira Code

### Hierarquia

- **Headlines**: TT Commons DemiBold, 28px+, line-height 1.25
- **Body**: TT Commons Regular, 16px, line-height 1.5 (WCAG AA)
- **Captions**: 12px, font-weight 500, uppercase, letter-spacing 0.025em

### Exemplo de Uso

```css
.text-headline-1 {
  font-size: 60px;
  font-weight: 600;
}
.text-body {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}
.text-caption {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}
```

## 🧩 Componentes

### HeroBanner

Banner principal com gradientes dinâmicos e CTA em estilo pill.

```tsx
import { HeroBanner } from "@/design-system";

<HeroBanner
  title="Minha Biblioteca"
  subtitle="Organize sua jornada geek com estilo"
  onAddMedia={() => setShowModal(true)}
/>;
```

**Features:**

- 3 gradientes rotativos (8s cada)
- Ícones flutuantes animados
- CTA com glow effect
- Glassmorphism overlay

### MediaCard

Cards de mídia com micro-interações e overlay semi-transparente.

```tsx
import { MediaCard } from "@/design-system";

<MediaCard
  item={mediaItem}
  onEdit={handleEdit}
  onDelete={handleDelete}
  variant="default" // 'default' | 'compact' | 'featured'
/>;
```

**Features:**

- Hover scale 1.03 com shadow colorido
- Overlay de ações no hover
- Progress bar para livros
- Duotone único por categoria
- Bordas 2xl arredondadas

### GlassInput

Campos de input com glassmorphism.

```tsx
import { GlassInput } from "@/design-system";

<GlassInput
  placeholder="Buscar por título..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  variant="search" // 'default' | 'search' | 'light'
/>;
```

**Features:**

- Backdrop-blur 20px, opacity 30%
- Ícones com toque de cor de destaque
- Focus ring colorido
- Clear button animado

### GlassNavigation

Sistema de navegação com glass cards 60×60px.

```tsx
import { GlassNavigation, mainNavigationItems } from "@/design-system";

<GlassNavigation
  items={mainNavigationItems}
  activeItem="library"
  onItemClick={setActiveItem}
  orientation="horizontal" // 'horizontal' | 'vertical'
/>;
```

**Features:**

- Glass cards minimalistas
- "Pingo" de cor no canto quando ativo
- Tooltips ao hover
- Badges para notificações

## 🎭 Patterns e Ornamentos

### TribalDivider

Divisores verticais com traços tribais estilizados.

```tsx
import { TribalDivider } from "@/design-system";

<TribalDivider
  variant="complex" // 'default' | 'minimal' | 'complex'
  color="cyan" // 'violet' | 'cyan' | 'magenta'
  opacity={0.6}
  animated={true}
/>;
```

### NeonOrnament

Ornamentos decorativos com glow neon.

```tsx
import { NeonOrnament } from "@/design-system";

<NeonOrnament
  type="corner" // 'corner' | 'center' | 'side'
  color="violet"
  size="medium" // 'small' | 'medium' | 'large'
  opacity={0.8}
/>;
```

### FloatingParticles

Partículas flutuantes para backgrounds.

```tsx
import { FloatingParticles } from "@/design-system";

<FloatingParticles count={12} color="cyan" className="absolute inset-0" />;
```

## 🎨 Glassmorphism

### Configuração Base

```css
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Variantes

- **Light**: blur(12px), bg-white/5, border-white/10
- **Strong**: blur(30px), bg-white/15, border-white/30

## 🎯 Micro-interações

### Cards

```css
hover:scale-[1.03]
hover:shadow-2xl
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Botões

```css
hover:scale-1.05
hover:y--2px
transition: all 0.2s ease-out
```

### Ícones

```css
hover:scale-1.1
hover:rotate-5deg
transition: transform 0.2s ease
```

## 📏 Especificações

### Shadows Coloridos

```typescript
glow: {
  violet: '0 20px 25px -5px rgba(139, 92, 246, 0.3)',
  cyan: '0 20px 25px -5px rgba(6, 182, 212, 0.3)',
  magenta: '0 20px 25px -5px rgba(236, 72, 153, 0.3)',
}
```

### Border Radius

- **Cards**: 1rem (16px) - 2xl
- **Buttons**: 1rem (16px) - 2xl
- **Pills**: 9999px - full
- **Glass Elements**: 0.75rem (12px) - xl

### Spacing

Baseado em múltiplos de 4px (0.25rem):

- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- base: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

## 🚀 Exemplos de Uso

### Layout Completo

```tsx
import {
  HeroBanner,
  MediaCard,
  GlassInput,
  TribalDivider,
  FloatingParticles,
} from "@/design-system";

function ModernLibrary() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <FloatingParticles count={8} color="cyan" />

      <div className="max-w-7xl mx-auto p-8 space-y-12">
        <HeroBanner
          title="Minha Biblioteca"
          onAddMedia={() => setShowModal(true)}
        />

        <TribalDivider variant="complex" color="cyan" />

        <GlassInput placeholder="Buscar mídia..." variant="search" />

        <div className="grid grid-cols-4 gap-8">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Theme Provider

```tsx
import { colors, gradients } from "@/design-system";

const theme = {
  colors,
  gradients,
  // Customize conforme necessário
};
```

## ♿ Acessibilidade

- **Contraste**: WCAG AA compliant (4.5:1)
- **Focus States**: Visible ring com 2px
- **Line Height**: 1.5 para corpo de texto
- **Touch Targets**: Mínimo 44px para mobile
- **Motion**: Respeita `prefers-reduced-motion`

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Grid Adaptativo

```css
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
```

## 🎪 Decisões de Design

### Por que Glassmorphism?

- **Profundidade**: Cria hierarquia visual sem peso excessivo
- **Modernidade**: Estética atual e sofisticada
- **Legibilidade**: Mantém conteúdo visível com blur sutil

### Por que Gradientes Hero?

- **Energia**: Transmite dinamismo e personalidade
- **Diferenciação**: Cada seção tem identidade visual única
- **Engajamento**: Cores vibrantes aumentam interesse

### Por que TT Commons?

- **Legibilidade**: Otimizada para UI e leitura prolongada
- **Personalidade**: Geométrica mas humanizada
- **Versatilidade**: Funciona em diferentes pesos e tamanhos

---

_Design System GeekLog v1.0 - Criado para uma experiência geek moderna e envolvente_ 🎮✨
