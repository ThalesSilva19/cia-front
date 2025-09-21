import PaymentForm from '@/components/PaymentForm';
import AuthGuard from '@/components/AuthGuard';

export default function PaymentPage() {
    return (
        <AuthGuard requireAuth={true}>
            <PaymentForm />
        </AuthGuard>
    );
}
