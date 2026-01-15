'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';

type VerificationStep =
  | 'intro'
  | 'phone_entry'
  | 'phone_verify'
  | 'phone_complete'
  | 'id_intro'
  | 'id_front'
  | 'id_back'
  | 'selfie'
  | 'processing'
  | 'complete';

const PROCESSING_STEPS = [
  { label: 'Scanning document...', duration: 800 },
  { label: 'Checking document authenticity...', duration: 1200 },
  { label: 'Extracting information...', duration: 800 },
  { label: 'Matching face to ID photo...', duration: 1200 },
  { label: 'Creating verified passport...', duration: 800 },
];

export default function VerifyPage() {
  const router = useRouter();
  const { user, verifyPhone, sendPhoneCode, completeIdVerification, isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState<VerificationStep>('intro');

  // Phone verification state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneResent, setPhoneResent] = useState(false);

  // ID verification state
  const [idFrontUploaded, setIdFrontUploaded] = useState(false);
  const [idBackUploaded, setIdBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Redirect if email not verified
  useEffect(() => {
    if (user && !user.verification?.emailVerified) {
      router.push('/verify-email');
    }
  }, [user, router]);

  // Set initial step based on verification status
  useEffect(() => {
    if (user?.verification) {
      const { emailVerified, phoneVerified, idVerified } = user.verification;

      // Fully verified - show complete
      if (emailVerified && phoneVerified && idVerified) {
        setStep('complete');
      }
      // Has ID but missing phone - go to phone verification
      else if (idVerified && !phoneVerified) {
        setStep('phone_entry');
      }
      // Has phone but missing ID - go to ID verification
      else if (phoneVerified && !idVerified) {
        setStep('id_intro');
      }
      // Otherwise start at intro (email only)
    }
  }, [user]);

  const handleSendPhoneCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneError('Please enter a valid phone number');
      return;
    }
    setPhoneSending(true);
    setPhoneError('');
    await sendPhoneCode(phoneNumber);
    setPhoneSending(false);
    setStep('phone_verify');
  };

  const handleVerifyPhone = async () => {
    setPhoneVerifying(true);
    setPhoneError('');
    const success = await verifyPhone(phoneNumber, phoneCode);
    if (success) {
      setStep('phone_complete');
    } else {
      setPhoneError('Invalid code. Please try again.');
    }
    setPhoneVerifying(false);
  };

  const handleResendPhoneCode = async () => {
    await sendPhoneCode(phoneNumber);
    setPhoneResent(true);
    setTimeout(() => setPhoneResent(false), 3000);
  };

  const simulateUpload = async (
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>,
    nextStep: VerificationStep
  ) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUploaded(true);
    setTimeout(() => setStep(nextStep), 500);
  };

  const handleProcessing = async () => {
    setStep('processing');

    // Animate through processing steps
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, PROCESSING_STEPS[i].duration));
    }

    // Complete ID verification
    await completeIdVerification();
    setStep('complete');
  };

  const handleSkip = () => {
    router.push('/wallet');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderProgressIndicator = () => {
    const emailDone = user?.verification?.emailVerified;
    const phoneDone = user?.verification?.phoneVerified;
    const idDone = user?.verification?.idVerified;

    return (
      <div className="flex items-center justify-center gap-3 mb-8">
        {/* Email */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${emailDone ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
            {emailDone ? (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="text-xs text-neutral-400">1</span>
            )}
          </div>
          <span className={`text-sm ${emailDone ? 'text-emerald-400' : 'text-neutral-500'}`}>Email</span>
        </div>

        <div className={`w-8 h-0.5 ${phoneDone ? 'bg-emerald-500' : 'bg-neutral-700'}`} />

        {/* Phone */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            phoneDone ? 'bg-emerald-500' : step.startsWith('phone') ? 'bg-amber-200' : 'bg-neutral-700'
          }`}>
            {phoneDone ? (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className={`text-xs ${step.startsWith('phone') ? 'text-neutral-900' : 'text-neutral-400'}`}>2</span>
            )}
          </div>
          <span className={`text-sm ${phoneDone ? 'text-emerald-400' : step.startsWith('phone') ? 'text-amber-200' : 'text-neutral-500'}`}>Phone</span>
        </div>

        <div className={`w-8 h-0.5 ${idDone ? 'bg-emerald-500' : 'bg-neutral-700'}`} />

        {/* ID */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            idDone ? 'bg-emerald-500' : (step.startsWith('id') || step === 'selfie' || step === 'processing') ? 'bg-amber-200' : 'bg-neutral-700'
          }`}>
            {idDone ? (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className={`text-xs ${(step.startsWith('id') || step === 'selfie' || step === 'processing') ? 'text-neutral-900' : 'text-neutral-400'}`}>3</span>
            )}
          </div>
          <span className={`text-sm ${idDone ? 'text-emerald-400' : (step.startsWith('id') || step === 'selfie' || step === 'processing') ? 'text-amber-200' : 'text-neutral-500'}`}>ID</span>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-200/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Complete Your Verification</h2>
            <p className="text-neutral-400 mb-6">
              Verify your phone and ID to unlock the marketplace and Entry Guarantee protection.
            </p>

            {/* Verification checklist */}
            <div className="bg-neutral-800/50 rounded-xl p-4 mb-6 text-left border border-neutral-700/50">
              <div className="space-y-3">
                {/* Email - done */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white">Email Verified</span>
                  </div>
                  <span className="text-emerald-400 text-sm">+15 pts</span>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-neutral-300">Phone Verification</span>
                  </div>
                  <span className="text-neutral-500 text-sm">+20 pts</span>
                </div>

                {/* ID */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                      </svg>
                    </div>
                    <span className="text-neutral-300">ID Verification</span>
                  </div>
                  <span className="text-neutral-500 text-sm">+45 pts</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Current Score</span>
                  <span className="text-amber-200 font-bold">{user?.passportScore || 0}/80</span>
                </div>
              </div>
            </div>

            <Button onClick={() => setStep('phone_entry')} variant="gold" className="w-full" size="lg">
              Continue to Phone Verification
            </Button>
            <button
              onClick={handleSkip}
              className="mt-4 text-neutral-500 hover:text-neutral-300 text-sm"
            >
              Skip for now (marketplace access limited)
            </button>
          </div>
        );

      case 'phone_entry':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Phone</h2>
            <p className="text-neutral-400 mb-6">
              We&apos;ll send a verification code to your phone number.
            </p>

            <div className="space-y-4">
              <Input
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your phone number"
                dark
              />
              {phoneError && (
                <p className="text-red-400 text-sm">{phoneError}</p>
              )}
            </div>

            <Button
              onClick={handleSendPhoneCode}
              variant="gold"
              className="w-full mt-6"
              size="lg"
              disabled={phoneSending}
            >
              {phoneSending ? 'Sending Code...' : 'Send Verification Code'}
            </Button>
            <button
              onClick={() => setStep('id_intro')}
              className="mt-4 text-neutral-500 hover:text-neutral-300 text-sm block mx-auto"
            >
              Skip phone verification
            </button>

            {/* Demo hint */}
            <div className="mt-6 p-3 bg-neutral-700/30 rounded-lg">
              <p className="text-xs text-neutral-400 text-center">
                <span className="text-amber-200">Demo:</span> Enter any 10+ digit number
              </p>
            </div>
          </div>
        );

      case 'phone_verify':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Enter Verification Code</h2>
            <p className="text-neutral-400 mb-6">
              We sent a 6-digit code to {phoneNumber}
            </p>

            <div className="space-y-4">
              <Input
                label="Verification Code"
                type="text"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                dark
              />
              {phoneError && (
                <p className="text-red-400 text-sm">{phoneError}</p>
              )}
            </div>

            <Button
              onClick={handleVerifyPhone}
              variant="gold"
              className="w-full mt-6"
              size="lg"
              disabled={phoneCode.length !== 6 || phoneVerifying}
            >
              {phoneVerifying ? 'Verifying...' : 'Verify Phone'}
            </Button>

            <div className="mt-4">
              {phoneResent ? (
                <p className="text-emerald-400 text-sm">Code resent!</p>
              ) : (
                <button
                  onClick={handleResendPhoneCode}
                  className="text-amber-200 hover:text-amber-300 text-sm"
                >
                  Didn&apos;t receive the code? Resend
                </button>
              )}
            </div>

            {/* Demo hint */}
            <div className="mt-6 p-3 bg-neutral-700/30 rounded-lg">
              <p className="text-xs text-neutral-400 text-center">
                <span className="text-amber-200">Demo:</span> Use code <span className="font-mono text-white">123456</span>
              </p>
            </div>
          </div>
        );

      case 'phone_complete':
        // Check if ID is already verified - if so, user is now fully verified
        const isNowFullyVerified = user?.verification?.idVerified;

        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Phone Verified!</h2>
            <p className="text-neutral-400 mb-2">Your phone number has been verified.</p>
            <p className="text-amber-200 font-semibold mb-6">+20 points added to your Passport Score</p>

            <div className="bg-neutral-800/50 rounded-xl p-4 mb-6 border border-neutral-700/50">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Current Score</span>
                <span className="text-amber-200 font-bold">{user?.passportScore || 50}/80</span>
              </div>
              <div className="mt-2 h-2 bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-200 to-amber-300 transition-all duration-500"
                  style={{ width: `${((user?.passportScore || 50) / 80) * 100}%` }}
                />
              </div>
            </div>

            {isNowFullyVerified ? (
              <Button onClick={() => setStep('complete')} variant="gold" className="w-full" size="lg">
                View Full Verification
              </Button>
            ) : (
              <>
                <Button onClick={() => setStep('id_intro')} variant="gold" className="w-full" size="lg">
                  Continue to ID Verification
                </Button>
                <button
                  onClick={handleSkip}
                  className="mt-4 text-neutral-500 hover:text-neutral-300 text-sm"
                >
                  Skip for now (marketplace access limited)
                </button>
              </>
            )}
          </div>
        );

      case 'id_intro':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-200/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your ID</h2>
            <p className="text-neutral-400 mb-6">
              Complete ID verification to unlock the marketplace and Entry Guarantee.
            </p>

            <div className="bg-neutral-800/50 rounded-xl p-4 mb-6 text-left border border-neutral-700/50">
              <h3 className="font-semibold text-white mb-3">What you&apos;ll need:</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Government-issued ID (passport, driver&apos;s license, or national ID)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  A selfie for face matching
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Good lighting and a clear camera
                </li>
              </ul>
            </div>

            <Button onClick={() => setStep('id_front')} variant="gold" className="w-full" size="lg">
              Start ID Verification
            </Button>
            <button
              onClick={handleSkip}
              className="mt-4 text-neutral-500 hover:text-neutral-300 text-sm"
            >
              Skip for now (marketplace access limited)
            </button>
          </div>
        );

      case 'id_front':
        return (
          <div className="text-center">
            <div className="mb-4 flex justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-200"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-600"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-600"></div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Front of ID</h2>
            <p className="text-neutral-400 mb-6">Take a photo of the front of your ID</p>

            <div className="border-2 border-dashed border-neutral-600 rounded-xl p-8 mb-6 bg-neutral-800/50">
              {idFrontUploaded ? (
                <div className="text-emerald-400">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">ID Front Uploaded</p>
                </div>
              ) : (
                <>
                  <svg className="w-16 h-16 mx-auto text-neutral-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-neutral-500">Position your ID within the frame</p>
                </>
              )}
            </div>

            <Button
              onClick={() => simulateUpload(setIdFrontUploaded, 'id_back')}
              variant="gold"
              className="w-full"
              size="lg"
              disabled={idFrontUploaded}
            >
              {idFrontUploaded ? 'Uploaded!' : 'Capture Photo'}
            </Button>
          </div>
        );

      case 'id_back':
        return (
          <div className="text-center">
            <div className="mb-4 flex justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-200"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-600"></div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Back of ID</h2>
            <p className="text-neutral-400 mb-6">Take a photo of the back of your ID</p>

            <div className="border-2 border-dashed border-neutral-600 rounded-xl p-8 mb-6 bg-neutral-800/50">
              {idBackUploaded ? (
                <div className="text-emerald-400">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">ID Back Uploaded</p>
                </div>
              ) : (
                <>
                  <svg className="w-16 h-16 mx-auto text-neutral-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-neutral-500">Flip your ID and position it within the frame</p>
                </>
              )}
            </div>

            <Button
              onClick={() => simulateUpload(setIdBackUploaded, 'selfie')}
              variant="gold"
              className="w-full"
              size="lg"
              disabled={idBackUploaded}
            >
              {idBackUploaded ? 'Uploaded!' : 'Capture Photo'}
            </Button>
          </div>
        );

      case 'selfie':
        return (
          <div className="text-center">
            <div className="mb-4 flex justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-200"></div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Take a Selfie</h2>
            <p className="text-neutral-400 mb-6">We&apos;ll match your face with your ID photo</p>

            <div className="border-2 border-dashed border-neutral-600 rounded-xl p-8 mb-6 bg-neutral-800/50">
              {selfieUploaded ? (
                <div className="text-emerald-400">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">Selfie Captured</p>
                </div>
              ) : (
                <>
                  <div className="w-32 h-32 mx-auto border-4 border-neutral-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-neutral-500">Position your face in the circle</p>
                </>
              )}
            </div>

            <Button
              onClick={async () => {
                await simulateUpload(setSelfieUploaded, 'selfie');
                setTimeout(handleProcessing, 500);
              }}
              variant="gold"
              className="w-full"
              size="lg"
              disabled={selfieUploaded}
            >
              {selfieUploaded ? 'Processing...' : 'Capture Selfie'}
            </Button>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <svg className="animate-spin w-20 h-20 text-amber-200" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verifying Your Identity</h2>
            <p className="text-neutral-400 mb-6">This usually takes just a few seconds...</p>

            {/* Animated processing steps */}
            <div className="space-y-3 max-w-xs mx-auto">
              {PROCESSING_STEPS.map((procStep, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                    index < processingStep
                      ? 'text-emerald-400'
                      : index === processingStep
                        ? 'text-amber-200'
                        : 'text-neutral-600'
                  }`}
                >
                  {index < processingStep ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : index === processingStep ? (
                    <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-neutral-600 rounded-full" />
                  )}
                  <span>{procStep.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You&apos;re Fully Verified!</h2>
            <p className="text-neutral-400 mb-6">
              Your Concert Passport is now active with full marketplace access.
            </p>

            {/* Entry Guarantee badge */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Entry Guarantee Active</span>
              </div>
              <p className="text-sm text-emerald-400/80 mt-1">
                If denied entry with a cleared ticket, you get an automatic refund.
              </p>
            </div>

            {/* Score display */}
            <div className="bg-neutral-800/50 rounded-xl p-4 mb-6 border border-neutral-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400">Passport Score</span>
                <span className="text-amber-200 font-bold text-xl">{user?.passportScore || 80}</span>
              </div>
              <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-200 to-emerald-400 w-full" />
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => router.push('/marketplace')} variant="gold" className="w-full" size="lg">
                Browse Marketplace
              </Button>
              <Button onClick={() => router.push('/wallet')} variant="outline" className="w-full border-neutral-600 text-neutral-300">
                Go to My Wallet
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
            <span className="text-amber-200 font-bold text-xl">P</span>
          </div>
          <span className="font-medium text-white text-lg tracking-wide">PASSPORT</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {step !== 'processing' && step !== 'complete' && renderProgressIndicator()}

          <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50">
            {renderStep()}
          </div>
        </div>
      </main>
    </div>
  );
}
