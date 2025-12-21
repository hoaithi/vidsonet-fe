'use client';

import apiClient from '@/services/api-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/identity/auth/forget-password', { email });
      
      // Show success toast
      const toastDiv = document.createElement('div');
      toastDiv.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toastDiv.textContent = 'OTP sent to your email.';
      document.body.appendChild(toastDiv);
      setTimeout(() => toastDiv.remove(), 3000);
      
      setStep(2);
    } catch (error) {
      // Show error toast
      const toastDiv = document.createElement('div');
      toastDiv.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toastDiv.textContent = 'Failed to send OTP. Please try again.';
      document.body.appendChild(toastDiv);
      setTimeout(() => toastDiv.remove(), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      const toastDiv = document.createElement('div');
      toastDiv.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toastDiv.textContent = 'Passwords do not match. Please try again.';
      document.body.appendChild(toastDiv);
      setTimeout(() => toastDiv.remove(), 3000);
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/identity/auth/reset-password', { email, otp, newPassword });
      
      // Show success toast
      const toastDiv = document.createElement('div');
      toastDiv.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toastDiv.textContent = 'Password reset successfully. Redirecting to login...';
      document.body.appendChild(toastDiv);
      router.push('/login');
      setTimeout(() => toastDiv.remove(), 3000);
    } catch (error) {
      // Show error toast
      const toastDiv = document.createElement('div');
      toastDiv.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toastDiv.textContent = 'Failed to reset password. Please check your OTP and try again.';
      document.body.appendChild(toastDiv);
      setTimeout(() => toastDiv.remove(), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {step === 1 ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">Forget Password</h1>
            <p className="text-gray-500 text-center mb-8">
              Enter your email to receive a verification code
            </p>

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSendCode}
                disabled={!email || isLoading}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>

              <div className="text-center pt-4">
                <a href="/login" className="text-gray-600 hover:text-gray-900">
                  Back to login
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
            <p className="text-gray-500 text-center mb-8">
              Enter the code sent to your email and your new password
            </p>

            <div className="space-y-6">
              <div>
                <label htmlFor="email-display" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  id="email-display"
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-900 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the code"
                  className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={!otp || !newPassword || !confirmPassword || isLoading}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Confirming...' : 'Confirm'}
              </button>

              <div className="text-center pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Back to previous step
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}