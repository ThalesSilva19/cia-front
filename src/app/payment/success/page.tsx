'use client';

import AuthGuard from '@/components/AuthGuard';
import AppHeader from '@/components/AppHeader';
import Link from 'next/link';

export default function PaymentSuccessPage() {

    return (
        <AuthGuard requireAuth={true}>
            <main className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-blue-50">
                <AppHeader
                    title="Pagamento Confirmado - Meraki"
                    subtitle="Seu pagamento foi processado com sucesso!"
                />

                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Success Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                            <div className="text-center">
                                {/* Success Icon */}
                                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    Pagamento Confirmado!
                                </h1>

                                <p className="text-lg text-gray-600 mb-8">
                                    Obrigado por adquirir seus ingressos para o espetáculo <strong>Meraki - O respiro das telas</strong>
                                </p>
                            </div>

                            {/* Information Cards */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Validation Info */}
                                <div className="bg-blue-50 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-blue-900">
                                            Validação dos Ingressos
                                        </h3>
                                    </div>
                                    <ul className="text-blue-800 space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2">•</span>
                                            <span>Ingressos serão validados em até <strong>24 horas</strong></span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2">•</span>
                                            <span>Ingressos comprados no dia do evento serão validados <strong>até o horário do espetáculo</strong></span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-600 mr-2">•</span>
                                            <span>Após validação, você receberá o ingresso por <strong>email</strong></span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Ticket Access Info */}
                                <div className="bg-green-50 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-green-900">
                                            Acesso aos Ingressos
                                        </h3>
                                    </div>
                                    <ul className="text-green-800 space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-green-600 mr-2">•</span>
                                            <span>Seus ingressos aparecerão em <strong>&quot;Meus Ingressos&quot;</strong> após validação</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-600 mr-2">•</span>
                                            <span>Você receberá um <strong>email com o ingresso</strong> em PDF</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-600 mr-2">•</span>
                                            <span>Apresente o ingresso na entrada do evento</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                    📅 Detalhes do Evento
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl mb-2">🎭</div>
                                        <div className="font-semibold text-gray-800">Meraki</div>
                                        <div className="text-sm text-gray-600">O respiro das telas</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl mb-2">📅</div>
                                        <div className="font-semibold text-gray-800">01 de Novembro</div>
                                        <div className="text-sm text-gray-600">Data do espetáculo</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl mb-2">🏫</div>
                                        <div className="font-semibold text-gray-800">Colégio La Salle</div>
                                        <div className="text-sm text-gray-600">Local do evento</div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-yellow-50 rounded-xl p-6 mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-yellow-900">
                                        Precisa de Ajuda?
                                    </h3>
                                </div>
                                <p className="text-yellow-800 mb-4">
                                    Se você tiver qualquer dúvida sobre seus ingressos ou o evento, entre em contato conosco:
                                </p>
                                <a
                                    href="https://wa.me/5571991241714?text=Olá! Tenho uma dúvida sobre meus ingressos para o espetáculo Meraki - O respiro das telas."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                    Entrar em Contato via WhatsApp
                                </a>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/tickets"
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                                >
                                    Ver Meus Ingressos
                                </Link>
                                <Link
                                    href="/"
                                    className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center font-medium"
                                >
                                    Voltar ao Início
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}
