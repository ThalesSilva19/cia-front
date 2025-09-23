'use client';

import SeatMap from "@/components/SeatMap";
import AuthGuard from "@/components/AuthGuard";
import PaymentButton from "@/components/PaymentButton";
import AppHeader from "@/components/AppHeader";
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
          <AppHeader
            title="Meraki - O respiro das telas"
            subtitle="Selecione seu assento para o espetáculo da Cia de Dança Ufscar"
          />

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
