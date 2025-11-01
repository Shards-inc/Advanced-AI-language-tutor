import React, { useState } from 'react';

// --- ICONS ---
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-secondary"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>);
const EyeIcon = () => (<svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-secondary"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const EyeSlashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-secondary"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-400"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>);
const EmailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-secondary"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>);
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,36.173,44,30.655,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);
const AppleIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.229 6.422c-.613-1.523-1.928-2.6-3.229-2.6s-2.616 1.077-3.229 2.6c-1.339.113-2.738.761-3.645 1.838-.988 1.185-1.442 2.738-1.289 4.283.132 1.408.829 2.973 1.848 3.968 1.028 1.005 2.228 1.481 3.447 1.481.503 0 1.115-.132 1.688-.344.593-.211 1.077-.333 1.625-.333s1.031.122 1.625.333c.573.211 1.185.344 1.688.344 1.219 0 2.419-.476 3.447-1.481 1.019-.995 1.716-2.56 1.848-3.968.153-1.545-.301-3.098-1.289-4.283-.907-1.077-2.306-1.725-3.645-1.838zm-3.229-1.422c.988 0 1.956.513 2.529 1.432.532-.907 1.545-1.432 2.529-1.432.062 0 .143.02.224.041-1.049.522-1.817 1.535-1.817 2.651 0 1.028.603 2.019 1.596 2.56.092.051.173.102.254.163-1.049.522-2.14 1.175-3.596 1.175-1.348 0-2.372-.513-3.292-1.185-.928-.682-1.535-1.705-1.535-2.748 0-1.125.758-2.119 1.817-2.651.081-.02.162-.041.224-.041z"></path>
    </svg>
);


interface SignInProps {
    onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6">
            <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold">Profile</h1>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onSignIn(); }} className="space-y-5">
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <EmailIcon />
                        </div>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Email"
                            defaultValue="user@google.com" 
                            className="w-full bg-background-secondary border border-background-tertiary rounded-lg py-3 pl-12 pr-4 text-text-primary placeholder-text-secondary/70 focus:ring-2 focus:ring-accent-primary focus:outline-none" />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockIcon />
                        </div>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id="password" 
                            placeholder="Password"
                            defaultValue="password123" 
                            className="w-full bg-background-secondary border border-background-tertiary rounded-lg py-3 pl-12 pr-12 text-text-primary placeholder-text-secondary/70 focus:ring-2 focus:ring-accent-primary focus:outline-none" />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </form>

                <div className="text-right mt-2">
                    <a href="#" className="text-sm text-accent-primary hover:underline">Forgot Password?</a>
                </div>
                
                <button onClick={onSignIn} style={{ backgroundColor: '#6366f1' }} className="w-full mt-6 text-white font-bold py-3 px-5 rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </button>
                
                <div className="relative my-6 flex items-center">
                    <div className="flex-grow border-t border-background-tertiary"></div>
                    <span className="flex-shrink mx-4 text-xs text-text-secondary">OR</span>
                    <div className="flex-grow border-t border-background-tertiary"></div>
                </div>

                <div className="space-y-3">
                    <button onClick={onSignIn} className="w-full bg-background-tertiary text-text-primary font-semibold py-3 px-5 rounded-lg hover:bg-background-tertiary/70 transition-colors duration-200 flex items-center justify-center gap-3">
                        <GoogleIcon />
                        <span>Continue with Google</span>
                    </button>
                    <button onClick={onSignIn} className="w-full bg-background-tertiary text-text-primary font-semibold py-3 px-5 rounded-lg hover:bg-background-tertiary/70 transition-colors duration-200 flex items-center justify-center gap-3">
                        <AppleIcon />
                        <span>Continue with Apple</span>
                    </button>
                </div>

                <p className="text-center text-sm text-text-secondary mt-6">
                    Don't have an account? <a href="#" className="font-semibold text-accent-primary hover:underline">Sign Up</a>
                </p>

                <div className="mt-8 bg-background-secondary p-6 rounded-lg border border-background-tertiary/50">
                    <h2 className="font-bold text-text-primary mb-4">Why join LinguaMate?</h2>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <CheckIcon />
                            <span className="text-text-secondary text-sm">AI-powered personalized lessons</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckIcon />
                            <span className="text-text-secondary text-sm">Track your progress & streaks</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckIcon />
                            <span className="text-text-secondary text-sm">Interactive conversations</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckIcon />
                            <span className="text-text-secondary text-sm">Multiple language support</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SignIn;