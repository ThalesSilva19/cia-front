'use client';

import SeatMap from "@/components/SeatMap";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import LogoutButton from "@/components/LogoutButton";
import PaymentButton from "@/components/PaymentButton";
import { seatService, Seat } from "@/services/api";
import { useEffect, useState, useCallback } from "react";

const Home = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const seatsData = await seatService.getSeats();
      setSeats(seatsData);
    } catch (err) {
      console.error('Erro ao buscar assentos:', err);
      setError('Erro ao carregar assentos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  return (
    <AuthGuard requireAuth={true}>
      <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="h-screen flex flex-col">
          <header className="text-center py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm tracking-tight">
                Seat Map Reservation
              </h1>
              <div className="flex space-x-4">
                <a
                  href="/tickets"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Meus Ingressos
                </a>
                <LogoutButton />
              </div>
            </div>
            <p className="text-lg text-gray-500">
              Select your seat from the beautiful interactive map below.
            </p>
          </header>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : (
                <>
                  <SeatMap seats={seats} />
                  <PaymentButton />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
};


export default Home;
