import {useState} from 'react';
import {ContactSection} from './components/ContactSection';
import {DifferentialsSection} from './components/DifferentialsSection';
import {FaqSection} from './components/FaqSection';
import {Footer} from './components/Footer';
import {GallerySection} from './components/GallerySection';
import {Header} from './components/Header';
import {HeroSection} from './components/HeroSection';
import {LightboxModal} from './components/LightboxModal';
import {Property3DShowcase} from './components/Property3DShowcase';
import {TestimonialsSection} from './components/TestimonialsSection';
import {WhatsAppFloatingButton} from './components/WhatsAppFloatingButton';
import {GALLERY_PHOTOS} from './data/brokerData';
import {getNextLightboxIndex, getPrevLightboxIndex} from './utils/brokerUtils';

export default function App() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleCloseLightbox = () => setLightboxIndex(null);
  const handlePrevLightbox = () => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : getPrevLightboxIndex(prev, GALLERY_PHOTOS.length),
    );
  };
  const handleNextLightbox = () => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : getNextLightboxIndex(prev, GALLERY_PHOTOS.length),
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-[#252528]">
      <Header />
      <main>
        <HeroSection />
        <DifferentialsSection />
        <GallerySection onSelectPhoto={setLightboxIndex} />
        <Property3DShowcase />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <LightboxModal
        photos={GALLERY_PHOTOS}
        activeIndex={lightboxIndex}
        onClose={handleCloseLightbox}
        onPrev={handlePrevLightbox}
        onNext={handleNextLightbox}
      />
    </div>
  );
}
