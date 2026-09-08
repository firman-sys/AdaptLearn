import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Layouts
import MainLayout from "./layouts/MainLayout";
import QuizLayout from "./layouts/QuizLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import LearningLayout from "./layouts/LearningLayout";

// Import Pages
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import DashboardHome from "./pages/dashboard/DashboardHome";
import MaterialDetail from "./pages/learning/MaterialDetail";
import VisualLearningPage from "./pages/learning/VisualLearningPage";
import ReadingLearningPage from "./pages/learning/ReadingLearningPage";
import WelcomeScreen from "./pages/quiz/WelcomeScreen";
import StyleIdentification from "./pages/quiz/StyleIdentification";
import AssessmentLevel from "./pages/quiz/AssessmentLevel";
import AnalysisLoading from "./pages/quiz/AnalysisLoading";
import QuizResult from "./pages/quiz/QuizResult";

const getAuthStatus = () => !!localStorage.getItem("userSession") || !!sessionStorage.getItem("userSession");

const getProfile = () => {
  const profile = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
  return profile ? JSON.parse(profile) : null;
};

// Helper components for clean routing
const AuthGuard = ({ children, requireAssessment = false }) => {
  const isAuthenticated = getAuthStatus();
  const profile = getProfile();
  const needsAssessment = profile?.needs_reassessment === true;
  const isNewUser = !profile?.last_quiz_at;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requireAssessment && !isNewUser && !needsAssessment) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requireAssessment && (isNewUser || needsAssessment)) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = getAuthStatus();
  const profile = getProfile();
  const needsAssessment = profile?.needs_reassessment === true;
  const isNewUser = !profile?.last_quiz_at;

  if (isAuthenticated) {
    return (isNewUser || needsAssessment) ? <Navigate to="/welcome" replace /> : <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GRUP PUBLIC */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        </Route>

        {/* GRUP QUIZ */}
        <Route path="/" element={<AuthGuard requireAssessment={true}><QuizLayout /></AuthGuard>}>
          <Route path="welcome" element={<WelcomeScreen />} />
          <Route path="quiz-style" element={<StyleIdentification />} />
          <Route path="quiz-level" element={<AssessmentLevel />} />
          <Route path="analyzing" element={<AnalysisLoading />} />
          <Route path="quiz-result" element={<QuizResult />} />
        </Route>

        {/* GRUP DASHBOARD */}
        <Route path="/" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route path="dashboard" element={<DashboardHome />} />
        </Route>

        {/* GRUP LEARNING */}
        <Route path="/" element={<AuthGuard><LearningLayout /></AuthGuard>}>
          <Route path="belajar/video/:videoId" element={<VisualLearningPage />} />
          <Route path="belajar/materi/:materiId" element={<ReadingLearningPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//apa aja
