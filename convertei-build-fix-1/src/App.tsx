import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { PricingPage } from './pages/PricingPage';
import { FormatsPage } from './pages/FormatsPage';
import { FAQPage } from './pages/FAQPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video" element={<CategoryPage category="video" />} />
          <Route path="/audio" element={<CategoryPage category="audio" />} />
          <Route path="/imagem" element={<CategoryPage category="image" />} />
          <Route path="/documentos" element={<CategoryPage category="document" />} />
          <Route path="/pdf" element={<CategoryPage category="document" title="Conversor de PDF" />} />
          <Route path="/ocr" element={<CategoryPage category="image" title="OCR - Extrair texto de imagens" />} />
          <Route path="/arquivos" element={<CategoryPage category="archive" />} />
          <Route path="/ebook" element={<CategoryPage category="ebook" />} />
          <Route path="/fontes" element={<CategoryPage category="font" />} />
          <Route path="/cad" element={<CategoryPage category="cad" />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/precos" element={<PricingPage />} />
          <Route path="/formatos" element={<FormatsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          {/* Popular conversion pages */}
          <Route path="/mp4-para-mp3" element={<CategoryPage category="video" title="MP4 para MP3" defaultOutput="mp3" />} />
          <Route path="/jpg-para-png" element={<CategoryPage category="image" title="JPG para PNG" defaultOutput="png" />} />
          <Route path="/png-para-jpg" element={<CategoryPage category="image" title="PNG para JPG" defaultOutput="jpg" />} />
          <Route path="/pdf-para-jpg" element={<CategoryPage category="document" title="PDF para JPG" />} />
          <Route path="/mp4-para-webm" element={<CategoryPage category="video" title="MP4 para WEBM" defaultOutput="webm" />} />
          <Route path="/mov-para-mp4" element={<CategoryPage category="video" title="MOV para MP4" defaultOutput="mp4" />} />
          <Route path="/wav-para-mp3" element={<CategoryPage category="audio" title="WAV para MP3" defaultOutput="mp3" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
