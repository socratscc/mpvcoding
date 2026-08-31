import { Routes, Route } from 'react-router';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import VideoBitrateCalculator from '@/pages/tools/VideoBitrateCalculator';
import VideoFileSizeCalculator from '@/pages/tools/VideoFileSizeCalculator';
import AspectRatioCalculator from '@/pages/tools/AspectRatioCalculator';
import DurationDateTimeCalculator from '@/pages/tools/DurationDateTimeCalculator';
import TextCleanerFormatter from '@/pages/tools/TextCleanerFormatter';
import About from '@/pages/trust/About';
import Contact from '@/pages/trust/Contact';
import Privacy from '@/pages/trust/Privacy';
import Terms from '@/pages/trust/Terms';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="video-bitrate-calculator" element={<VideoBitrateCalculator />} />
        <Route path="video-file-size-calculator" element={<VideoFileSizeCalculator />} />
        <Route path="aspect-ratio-resolution-calculator" element={<AspectRatioCalculator />} />
        <Route path="duration-date-time-calculator" element={<DurationDateTimeCalculator />} />
        <Route path="text-cleaner-formatter" element={<TextCleanerFormatter />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
