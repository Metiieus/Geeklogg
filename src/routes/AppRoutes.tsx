
import React, { Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MainLayout } from "../layouts/MainLayout";
import { MediaItem, UserProfile } from "../types";

// Static imports
import { Login } from "../pages/Login";
import { LandingPage } from "../pages/Landing";
import { Register } from "../pages/Register";

// Lazy Loaded Pages with preload
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const ProLibrary = React.lazy(() => import("../pages/Library"));
const Reviews = React.lazy(() => import("../pages/Reviews"));
const Timeline = React.lazy(() => import("../pages/Timeline"));
const Statistics = React.lazy(() => import("../pages/Statistics"));

// Preload critical routes
const preloadDashboard = () => import("../pages/Dashboard");
const preloadLibrary = () => import("../pages/Library");
const SettingsComponent = React.lazy(() => import("../pages/Settings"));
const Profile = React.lazy(() => import("../pages/Profile"));
const AddMediaPage = React.lazy(() => import("../pages/AddMedia").then(module => ({ default: module.AddMediaPage })));
const EditMediaPageWrapper = React.lazy(() => import("../pages/EditMedia"));
const CreateMediaPage = React.lazy(() => import("../pages/CreateMedia"));
const UserProfileView = React.lazy(() => import("../pages/UserProfile").then(module => ({ default: module.UserProfileView })));
const PrivacyPolicy = React.lazy(() => import("../components/PrivacyPolicy"));
const AccountDeletion = React.lazy(() => import("../components/AccountDeletion"));

// Types for Props if needed (none strictly required for now)
interface AppRoutesProps {
    // No props needed
}

// Wrapper for UserProfile to handle useParams
const UserProfileRoute = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) return <Navigate to="/dashboard" />;

    return <UserProfileView userId={id} onBack={() => navigate(-1)} />;
};

export const AppRoutes: React.FC<AppRoutesProps> = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Preload critical routes on mount
    React.useEffect(() => {
        if (user) {
            preloadDashboard();
            preloadLibrary();
        }
    }, [user]);

    if (!user) {
        return (
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/landing" element={<LandingPage onLogin={() => navigate("/login")} onRegister={() => navigate("/register")} />} />
                    <Route path="/login" element={<Login onCancel={() => navigate("/landing")} onRegister={() => navigate("/register")} />} />
                    <Route path="/register" element={<Register onCancel={() => navigate("/landing")} onLogin={() => navigate("/login")} />} />
                    <Route path="*" element={<Navigate to="/landing" />} />
                </Routes>
            </AnimatePresence>
        );
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-slate-300">Carregando...</p>
                </div>
            </div>
        }>
            <Routes location={location}>
                    {/* Auth Routes redirection for logged in users */}
                    <Route path="/landing" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={<Navigate to="/dashboard" />} />
                    <Route path="/register" element={<Navigate to="/dashboard" />} />

                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/account-deletion" element={<AccountDeletion />} />

                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/library" element={
                            <ProLibrary />
                        } />
                        <Route path="/reviews" element={<Reviews />} />
                        <Route path="/timeline" element={<Timeline />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/settings" element={<SettingsComponent />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/add-media" element={<AddMediaPage />} />
                        <Route path="/media/new" element={<CreateMediaPage />} />
                        <Route path="/edit-media/:id" element={<EditMediaPageWrapper />} />
                        <Route path="/user/:id" element={<UserProfileRoute />} />
                        <Route path="/social" element={
                            <div className="flex items-center justify-center h-96">
                                <div className="text-center">
                                    <Users className="mx-auto mb-4 text-purple-400" size={48} />
                                    <h2 className="text-xl font-semibold text-white mb-2">Social em Breve</h2>
                                    <p className="text-slate-400">Conecte-se com outros nerds e compartilhe suas descobertas!</p>
                                </div>
                            </div>
                        } />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Route>
            </Routes>
        </Suspense>
    );
};
