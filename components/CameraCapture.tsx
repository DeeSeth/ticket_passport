'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel?: () => void;
  facingMode?: 'user' | 'environment';
  captureLabel?: string;
  title?: string;
  subtitle?: string;
  showGuideCircle?: boolean;
}

export default function CameraCapture({
  onCapture,
  onCancel,
  facingMode = 'user',
  captureLabel = 'Capture Photo',
  title,
  subtitle,
  showGuideCircle = false,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'captured'>('loading');
  const [error, setError] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Mark as ready - only once
  const markReady = useCallback(() => {
    setStatus(prev => {
      if (prev === 'loading') {
        console.log('Camera is ready!');
        return 'ready';
      }
      return prev;
    });
  }, []);

  // Initialize camera
  useEffect(() => {
    let mounted = true;

    async function setupCamera() {
      try {
        console.log('Requesting camera access...');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });

        console.log('Camera access granted, stream:', mediaStream);

        if (!mounted) {
          console.log('Component unmounted, stopping stream');
          mediaStream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = mediaStream;

        const video = videoRef.current;
        if (video) {
          console.log('Setting video srcObject');
          video.srcObject = mediaStream;

          // Try to play immediately
          try {
            await video.play();
            console.log('Video playing successfully');
            if (mounted) markReady();
          } catch (playErr) {
            console.log('Play error (will retry on user interaction):', playErr);
            // Set ready anyway - user can click to capture which will trigger play
            if (mounted) markReady();
          }
        }

        // Fallback: if still loading after 2 seconds, force ready
        setTimeout(() => {
          if (mounted) {
            markReady();
          }
        }, 2000);

      } catch (err) {
        console.error('Camera setup error:', err);
        if (!mounted) return;

        const e = err as Error;
        if (e.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera access.');
        } else if (e.name === 'NotFoundError') {
          setError('No camera found.');
        } else {
          setError('Could not access camera: ' + e.message);
        }
        setStatus('error');
      }
    }

    setupCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [facingMode, markReady]);

  // Handle video playing event - most reliable indicator
  const handlePlaying = () => {
    console.log('Video is playing');
    markReady();
  };

  // Handle video loadeddata event
  const handleLoadedData = () => {
    console.log('Video data loaded');
    markReady();
  };

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Mirror for selfie
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    setStatus('captured');
  };

  // Capture with countdown
  const handleCapture = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setStatus('ready');
  };

  // Confirm photo
  const handleConfirm = () => {
    if (capturedImage) {
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      onCapture(capturedImage);
    }
  };

  // Cancel
  const handleCancel = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    onCancel?.();
  };

  // Error state
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-400 text-center mb-4">{error}</p>
        {onCancel && (
          <Button onClick={handleCancel} variant="outline" className="border-neutral-600 text-neutral-300">
            Go Back
          </Button>
        )}
      </div>
    );
  }

  // Captured image preview
  if (status === 'captured' && capturedImage) {
    return (
      <div className="flex flex-col items-center">
        {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}
        <p className="text-neutral-400 mb-4">Does this look good?</p>

        <div className="relative rounded-xl overflow-hidden mb-6 border-2 border-neutral-600">
          <img src={capturedImage} alt="Captured" className="w-full max-w-xs" />
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          <Button onClick={handleRetake} variant="outline" className="flex-1 border-neutral-600 text-neutral-300">
            Retake
          </Button>
          <Button onClick={handleConfirm} variant="gold" className="flex-1">
            Use Photo
          </Button>
        </div>
      </div>
    );
  }

  // Camera view
  return (
    <div className="flex flex-col items-center">
      {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}
      {subtitle && <p className="text-neutral-400 mb-4">{subtitle}</p>}

      <div className="relative rounded-xl overflow-hidden mb-6 border-2 border-neutral-600 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onPlaying={handlePlaying}
          onLoadedData={handleLoadedData}
          style={{
            width: '320px',
            height: '240px',
            objectFit: 'cover',
            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
          }}
        />

        {/* Loading overlay */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <div className="w-10 h-10 border-4 border-neutral-700 border-t-amber-200 rounded-full animate-spin mb-3" />
            <p className="text-neutral-400 text-sm">Starting camera...</p>
          </div>
        )}

        {/* Guide circle */}
        {showGuideCircle && status === 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 border-4 border-amber-200/50 rounded-full" />
          </div>
        )}

        {/* Countdown */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-6xl font-bold text-amber-200">{countdown}</span>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="flex gap-3 w-full max-w-xs">
        {onCancel && (
          <Button onClick={handleCancel} variant="outline" className="flex-1 border-neutral-600 text-neutral-300">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleCapture}
          variant="gold"
          className="flex-1"
          disabled={status !== 'ready' || countdown !== null}
        >
          {countdown !== null ? countdown : captureLabel}
        </Button>
      </div>

      <p className="text-xs text-neutral-500 mt-4 text-center">
        {status === 'loading' ? 'Waiting for camera access...' : 'Position your face in the frame'}
      </p>
    </div>
  );
}
