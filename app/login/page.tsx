import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="text-sm flex flex-col items-center space-y-2">
            <a 
            href="/forgot-password" 
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline text-center"
            >Forgot password?</a>
            <div className="text-sm text-center">
              Don't have an account?{' '}
              <a href="/signup" 
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}