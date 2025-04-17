import MainNav from "@/components/main-nav"

export default function Home() {
  return (
    <>
      <MainNav />
      <div className="container mx-auto mt-6">
        <h1 className="text-4xl font-bold mb-6">Welcome to Raider Critic</h1>
        <p className="text-lg text-muted-foreground">
          Your ultimate guide to motorcycles and riding culture.
        </p>
      </div>
    </>
  )
}