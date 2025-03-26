import ResetPasswordForm from '@/app/ui/rest-password-form';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-blackbg-500 text-white">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <ResetPasswordForm />
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="text-sm flex flex-col items-center space-y-2">
            <a 
            href="/login" 
            className="text-orange-400 hover:text-blue-800 transition-colors duration-200 hover:underline text-center"
            >Login</a>
            <div className="text-sm text-center">
              Don't have an account?{' '}
              <a href="/signup" 
              className="font-medium text-orange-400 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}