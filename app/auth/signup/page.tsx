import SignupForm from '@/app/ui/auth/signup-form';
import FireDNSLogo from "@/app/ui/firedns-logo";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-blackbg-500 text-white flex flex-col items-center justify-start pt-12 px-4">
      
      {/* Centered logo at the top */}
      <Link href="/" className="mb-8">
        <FireDNSLogo />
      </Link>

      {/* Signup form content */}
      <main className="w-full max-w-[400px]">
        <SignupForm />
        <div className="flex flex-col items-center justify-center">
          <div className="text-sm flex flex-col items-center space-y-2">
            <div className="text-sm text-center">
              Already have an account?{' '}
              <a 
                href="/auth/login" 
                className="font-medium text-orange-400 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
