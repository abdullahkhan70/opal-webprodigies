import Image from "next/image";
import LandingPageNavBar from "./_components/navbar";

export default function Home() {
  return (
    <main suppressHydrationWarning>
      <LandingPageNavBar />
    </main>
  );
}
