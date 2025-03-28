import SignupForm from '@/app/ui/auth/signup-form';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-blackbg-500">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <SignupForm />
      </div>
    </main>
  );
}