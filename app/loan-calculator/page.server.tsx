import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const title = "Loan Calculator - ridercritic"
  const description =
    "Calculate your motorcycle loan EMI with our free loan calculator. Compare loan offers from different banks and find the best financing option for your bike purchase in Bangladesh."

  return {
    title,
    description,
    keywords:
      "motorcycle loan calculator, bike loan emi calculator, motorcycle financing, bike loan calculator bangladesh, emi calculator, loan offers, motorcycle loan bangladesh",
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://ridercritic.com/loan-calculator",
      images: [
        {
          url: "https://ridercritic.com/og-loan-calculator.jpg",
          width: 1200,
          height: 630,
          alt: "ridercritic Loan Calculator - Calculate Motorcycle Loan EMI",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://ridercritic.com/og-loan-calculator.jpg"],
    },
    alternates: {
      canonical: "https://ridercritic.com/loan-calculator",
    },
  }
}
