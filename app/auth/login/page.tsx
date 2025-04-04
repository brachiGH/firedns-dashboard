import LoginForm from '@/app/ui/auth/login-form';
import FireDNSLogo from "../../ui/firedns-logo";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-blackbg-500 text-white flex flex-col items-center justify-start pt-12 px-4">
      
      {/* Centered logo at the top */}
      <Link href="/">
        <FireDNSLogo />
      </Link>

      {/* Main login content */}
      <main className="w-full max-w-[400px]">
        <LoginForm />
        
        <div className="flex flex-col items-center justify-center">
          <div className="text-sm flex flex-col items-center space-y-2">
            <a 
              href="/auth/rest-password" 
              className="text-orange-400 hover:text-blue-800 transition-colors duration-200 hover:underline text-center"
            >
              Forgot password?
            </a>
            <div className="text-sm text-center">
              Don&apos;t have an account?{' '}
              <a 
                href="/auth/signup" 
                className="font-medium text-orange-400 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
