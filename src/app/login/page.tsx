import LoginForm from '@/components/LoginForm';
import AuthGuard from '@/components/AuthGuard';

export default function LoginPage() {
    return (
        <AuthGuard requireAuth={false}>
            <LoginForm />
        </AuthGuard>
    );
}
