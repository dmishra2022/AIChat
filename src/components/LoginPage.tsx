import React from 'react';
import { Github, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, loading, error } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => login('github')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </button>

          <button
            onClick={() => login('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="h-5 w-5" />
            Continue with Google
          </button>
        </div>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            By signing in, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}