import Navbar from "../components/Navbar"
import Hero from "../components/hero"
import Annoncements from "../components/Annoncements";
import Footer from "../components/footer"

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Annoncements />
      <Footer />
    </div>
  )
}