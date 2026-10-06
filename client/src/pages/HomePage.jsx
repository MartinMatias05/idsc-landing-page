import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import CtaSection from '../sections/CtaSection';
import EnrollmentSection from '../sections/EnrollmentSection';
import NewsHero from '../sections/NewsHero';
import NewsSection from '../sections/NewsSection';
import PulseSection from '../sections/PulseSection';
import StatisticsSection from '../sections/StatisticsSection';

/**
 * Landing page. Each endpoint is requested once and shared by the sections that need it:
 * /news feeds the hero and the notice grid, /enrollment feeds the enrollment hero and the final CTA.
 */
export default function HomePage() {
  const news = useApi(api.getNews);
  const enrollment = useApi(api.getEnrollment);
  const pulse = useApi(api.getPulse);
  const statistics = useApi(api.getStatistics);

  return (
    <>
      <NewsHero state={news} />
      <NewsSection state={news} />
      <EnrollmentSection state={enrollment} />
      <PulseSection state={pulse} />
      <StatisticsSection state={statistics} />
      <CtaSection state={enrollment} />
    </>
  );
}
