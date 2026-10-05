import { useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import Hero from '../sections/Hero';
import NewsSection from '../sections/NewsSection';
import EnrollmentSection from '../sections/EnrollmentSection';
import PulseSection from '../sections/PulseSection';
import StatsSection from '../sections/StatsSection';
import CtaSection from '../sections/CtaSection';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';

export default function HomePage() {
  const site = useApi(api.getSite);
  const navigation = useApi(api.getNavigation);
  const news = useApi(api.getNews);
  const enrollment = useApi(api.getEnrollment);
  const pulse = useApi(api.getPulse);
  const statistics = useApi(api.getStatistics);
  const ready = [site, navigation, news, enrollment, pulse, statistics].every((item) => !item.loading);
  const hasError = [site, navigation, news, enrollment, pulse, statistics].some((item) => item.error);
  const retry = () => [site, navigation, news, enrollment, pulse, statistics].forEach((item) => item.reload());
  const featured = useMemo(() => (news.data?.items ?? news.data ?? []).find((item) => item.featured) || (news.data?.items ?? news.data ?? [])[0], [news.data]);
  if (!ready) return <><Header site={site.data} navigation={navigation.data}/><main className="container page-loading"><LoadingState/></main></>;
  if (hasError) return <><Header site={site.data} navigation={navigation.data}/><main className="container page-loading"><ErrorState onRetry={retry}/></main><Footer site={site.data} navigation={navigation.data}/></>;
  return <><Header site={site.data} navigation={navigation.data}/><main><Hero article={featured}/><NewsSection articles={news.data?.items ?? news.data ?? []}/><EnrollmentSection enrollment={enrollment.data}/><PulseSection pulse={pulse.data}/><StatsSection statistics={statistics.data}/><CtaSection enrollment={enrollment.data} site={site.data}/></main><Footer site={site.data} navigation={navigation.data}/></>;
}
