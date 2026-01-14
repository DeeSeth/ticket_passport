'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';

type VerificationStep = 'intro' | 'id_front' | 'id_back' | 'selfie' | 'processing' | 'complete';

export default function VerifyPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState<VerificationStep>('intro');
  const [idFrontUploaded, setIdFrontUploaded] = useState(false);
  const [idBackUploaded, setIdBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  const simulateUpload = async (
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>,
    nextStep: VerificationStep
  ) => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUploaded(true);
    setTimeout(() => setStep(nextStep), 500);
  };

  const handleProcessing = async () => {
    setStep('processing');
    // Simulate verification processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Update user as verified
    updateUser({
      isVerified: true,
      passportScore: (user?.passportScore || 50) + 30,
      membershipStatus: 'active',
      membershipExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    });
    setStep('complete');
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
            <p className="text-gray-600 mb-6">
              Complete a quick identity verification to unlock your full Concert Passport benefits including Entry Guarantee.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">What you&apos;ll need:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Government-issued ID (passport, driver&apos;s license, or national ID)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  A selfie for face matching
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Good lighting and a clear camera
                </li>
              </ul>
            </div>
            <Button onClick={() => setStep('id_front')} className="w-full" size="lg">
              Start Verification
            </Button>
            <button
              onClick={() => router.push('/wallet')}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip for now
            </button>
          </div>
        );

      case 'id_front':
        return (
          <div className="text-center">
            <div className="mb-4 flex justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-900"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Front of ID</h2>
            <p className="text-gray-600 mb-6">Take a photo of the front of your ID</p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 bg-gray-50">
              {idFrontUploaded ? (
                <div className="text-green-600">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">ID Front Uploaded</p>
                </div>
              ) : (
                <>
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-500">Position your ID within the frame</p>
                </>
              )}
            </div>

            <Button
              onClick={() => simulateUpload(setIdFrontUploaded, 'id_back')}
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
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-blue-900"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Back of ID</h2>
            <p className="text-gray-600 mb-6">Take a photo of the back of your ID</p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 bg-gray-50">
              {idBackUploaded ? (
                <div className="text-green-600">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">ID Back Uploaded</p>
                </div>
              ) : (
                <>
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-500">Flip your ID and position it within the frame</p>
                </>
              )}
            </div>

            <Button
              onClick={() => simulateUpload(setIdBackUploaded, 'selfie')}
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
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-blue-900"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Take a Selfie</h2>
            <p className="text-gray-600 mb-6">We&apos;ll match your face with your ID photo</p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 bg-gray-50">
              {selfieUploaded ? (
                <div className="text-green-600">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">Selfie Captured</p>
                </div>
              ) : (
                <>
                  <div className="w-32 h-32 mx-auto border-4 border-gray-300 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Position your face in the circle</p>
                </>
              )}
            </div>

            <Button
              onClick={async () => {
                await simulateUpload(setSelfieUploaded, 'selfie');
                setTimeout(handleProcessing, 500);
              }}
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
              <svg className="animate-spin w-20 h-20 text-blue-900" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Your Identity</h2>
            <p className="text-gray-600">This usually takes just a few seconds...</p>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-500">Checking document authenticity...</p>
              <p className="text-sm text-gray-500">Matching face to ID...</p>
              <p className="text-sm text-gray-500">Creating your verified passport...</p>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your Concert Passport is now active. You&apos;re eligible for Entry Guarantee on all cleared tickets.
            </p>

            <div className="bg-emerald-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Entry Guarantee Active</span>
              </div>
              <p className="text-sm text-emerald-600 mt-1">
                If denied entry with a cleared ticket, you get an automatic refund.
              </p>
            </div>

            <Button onClick={() => router.push('/wallet')} className="w-full" size="lg">
              Go to My Wallet
            </Button>
          </div>
        );
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      {renderStep()}
    </Card>
  );
}
