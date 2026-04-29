import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DashboardPage } from './pages/DashboardPage';
import { VideoAnalyzerPage } from './pages/VideoAnalyzerPage';
import { ChannelAnalyzerPage } from './pages/ChannelAnalyzerPage';
import { SEOIntelligencePage } from './pages/SEOIntelligencePage';
import { PreUploadPage } from './pages/PreUploadPage';
import { StrategyPage } from './pages/StrategyPage';
import { CommentIntelligencePage } from './pages/CommentIntelligencePage';
import { WatchlistPage } from './pages/WatchlistPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ComparePage } from './pages/ComparePage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/video" element={<VideoAnalyzerPage />} />
            <Route path="/channel" element={<ChannelAnalyzerPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/seo" element={<SEOIntelligencePage />} />
            <Route path="/strategy" element={<StrategyPage />} />
            <Route path="/comments" element={<CommentIntelligencePage />} />
            <Route path="/preupload" element={<PreUploadPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
