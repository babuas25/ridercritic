export { generateMetadata } from './page.server'

export default function OffersPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Offers</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover upcoming deals, finance options, and special offers for riders.
          We&apos;re preparing hand-picked offers tailored for the ridercritic community.
        </p>
      </div>
    </div>
  );
}
