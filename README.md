# RiderCritic - Static Template

A modern, responsive motorcycle review website template built with Next.js 14 and Tailwind CSS.

## Features

- **Modern Design**: Clean, professional layout with dark/light theme support
- **Responsive**: Fully responsive design that works on all devices
- **Static Content**: Fast-loading static pages with no backend dependencies
- **Component Library**: Built with shadcn/ui components for consistent design
- **TypeScript**: Full TypeScript support for better development experience
- **SEO Ready**: Optimized for search engines with proper meta tags

## Design Pages

- **Home**: Landing page with featured content and call-to-actions
- **Motorcycles**: Showcase of motorcycle models with filtering
- **Reviews**: Community reviews and ratings display
- **Products**: Motorcycle gear and accessories catalog
- **Accessories**: Additional motorcycle accessories and parts
- **About**: Company information and mission
- **Contact**: Contact form and company details

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Theme**: next-themes (dark/light mode)
- **TypeScript**: Full TypeScript support
- **Linting**: ESLint

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ridercritic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Usage

This template is designed as a starting point for motorcycle-related websites. It includes:

- **Responsive Navigation**: Mobile-friendly navigation with sidebar
- **Static Content**: Pre-built pages with sample data
- **Component System**: Reusable UI components
- **Theme Support**: Dark and light mode toggle
- **Modern Layout**: Professional design with proper spacing

## Project Structure

```
ridercritic/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── accessories/       # Accessories catalog
│   ├── contact/           # Contact page
│   ├── motorcycle/        # Motorcycle showcase
│   ├── products/          # Products catalog
│   ├── reviews/           # Reviews page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Site header
│   ├── main-nav.tsx      # Main navigation
│   ├── sidebar.tsx       # Sidebar navigation
│   └── footer.tsx        # Site footer
├── public/               # Static assets
└── lib/                  # Utility functions
```

## Customization

### Adding New Pages

1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Use existing components for consistent styling

### Modifying Content

- Edit static data in page components
- Update navigation in `components/main-nav.tsx`
- Customize colors in `app/globals.css`

### Adding Components

- Use shadcn/ui components for consistency
- Follow the existing component patterns
- Add new components to `components/ui/` for shared use

## Deployment

This static template can be deployed to any static hosting service:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

## Notes

- All functionality has been removed, keeping only the design
- No backend integration required
- Optimized for performance and SEO
- Mobile-first responsive design
- Accessible components with proper ARIA labels

## Development

The template uses modern development practices:

- **TypeScript** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for styling
- **Component composition** for maintainability

---

**Built with ❤️ for motorcycle enthusiasts**