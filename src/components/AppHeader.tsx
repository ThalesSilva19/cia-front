'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import LogoutButton from "./LogoutButton";

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
}

const AppHeader = ({
    title = "Meraki - O respiro das telas",
    subtitle = "O novo espetáculo da Cia de Dança Ufscar - 01 de novembro - Colégio La Salle"
}: AppHeaderProps) => {
    const { userInfo, isAdmin } = useAuth();

    return (
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h3zM9 4h6V3H9v1z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                                {title}
                            </h1>
                            {userInfo && (
                                <p className="text-blue-100 text-xs md:text-sm">
                                    Bem-vindo, {userInfo.user_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <Link
                            href="/"
                            className="bg-white/20 hover:bg-white/30 text-white px-2 md:px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 md:space-x-2 text-sm"
                        >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="hidden sm:inline">Início</span>
                        </Link>

                        <Link
                            href="/tickets"
                            className="bg-white/20 hover:bg-white/30 text-white px-2 md:px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 md:space-x-2 text-sm"
                        >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span className="hidden sm:inline">Meus Ingressos</span>
                        </Link>

                        {isAdmin() && (
                            <Link
                                href="/admin"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 md:px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 md:space-x-2 shadow-lg text-sm"
                            >
                                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="hidden sm:inline">Administração</span>
                            </Link>
                        )}

                        <LogoutButton />
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-blue-100 text-sm md:text-lg">
                        {subtitle}
                    </p>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
