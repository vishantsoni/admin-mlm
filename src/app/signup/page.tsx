import SignUpForm from '@/components/auth/SignUpForm';
import SignUpStepForm from '@/components/auth/SignUpStepForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="min-h-screen flex flex-col p-5">
        <div className="flex flex-1">
          {/* <SignUpForm /> */}
          <SignUpStepForm />
          {/* <div className="hidden lg:flex flex-1 items-center justify-center p-10">
            <div className="max-w-md">
              <img 
                src="/images/logo/logo.svg" 
                alt="Sign Up" 
                className="w-64 h-64 mx-auto mb-8 opacity-75"
              />
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                Join Admin Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Create account (Demo signup - login with demo accounts)
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

