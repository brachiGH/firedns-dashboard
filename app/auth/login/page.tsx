import LoginForm from '@/app/ui/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-blackbg-500 text-white">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <LoginForm />
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="text-sm flex flex-col items-center space-y-2">
            <a 
            href="/auth/rest-password" 
            className="text-orange-400 hover:text-blue-800 transition-colors duration-200 hover:underline text-center"
            >Forgot password?</a>
            <div className="text-sm text-center">
              Don&apos;t have an account?{' '}
              <a href="/auth/signup" 
              className="font-medium text-orange-400 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}