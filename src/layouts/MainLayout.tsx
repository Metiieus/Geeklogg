import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { DesktopHeader } from "../components/DesktopHeader";
import { MobileSidebar } from "../components/MobileSidebar";
// Stripe removido

import {
    Home,
    BookOpen,
    MessageSquare,
    Clock,
    BarChart3,
    Users,
    Settings,
    User,
    Plus,
    Edit3,
} from "lucide-react";

// Page metadata mapping (Moved from App.tsx)
// Simplified to map paths/keys to metadata
const getPageMetadata = (pathname: string) => {
    const path = pathname.split("/")[1] || "dashboard";

    const metadata: Record<string, { name: string; icon: React.ReactNode }> = {
        dashboard: { name: "Dashboard", icon: <Home size={20} /> },
        library: { name: "Biblioteca", icon: <BookOpen size={20} /> },
        reviews: { name: "Resenhas", icon: <MessageSquare size={20} /> },
        timeline: { name: "Jornada", icon: <Clock size={20} /> },
        statistics: { name: "Estatísticas", icon: <BarChart3 size={20} /> },
        social: { name: "Social", icon: <Users size={20} /> },
        settings: { name: "Configurações", icon: <Settings size={20} /> },
        profile: { name: "Perfil", icon: <User size={20} /> },
        "add-media": { name: "Adicionar Mídia", icon: <Plus size={20} /> },
        "edit-media": { name: "Editar Mídia", icon: <Edit3 size={20} /> },
        user: { name: "Perfil do Usuário", icon: <User size={20} /> },
    };

    return metadata[path] || metadata.dashboard;
};

export const MainLayout: React.FC = () => {
    const location = useLocation();
    const meta = getPageMetadata(location.pathname);

    return (
        <div className="min-h-screen mobile-full-height bg-gray-900 text-white overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 rotate-45"></div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <MobileSidebar />

            {/* Desktop Header */}
            <div className="hidden md:block">
                <DesktopHeader
                    pageName={meta.name}
                    pageIcon={meta.icon}
                />
            </div>

            {/* Conteúdo */}
            <main className="md:ml-20 md:pt-16 min-h-screen pt-16 overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8 pb-8">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                            </div>
                        }
                    >
                        <Outlet />
                    </Suspense>
                </div>
            </main>


        </div>
    );
};
