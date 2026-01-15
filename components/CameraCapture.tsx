'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error('Camera error:', err);
      setIsLoading(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access was denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is in use by another application. Please close other apps using the camera.');
      } else {
        setError('Unable to access camera. Please check your browser settings.');
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas (mirror for selfie mode)
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    // Convert to data URL
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
  }, [facingMode]);

  const handleCaptureWithCountdown = useCallback(() => {
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [capturePhoto]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (capturedImage) {
      stopCamera();
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture, stopCamera]);

  const handleCancel = useCallback(() => {
    stopCamera();
    onCancel?.();
  }, [stopCamera, onCancel]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-neutral-700 border-t-amber-200 rounded-full animate-spin mb-4" />
        <p className="text-neutral-400">Starting camera...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-400 text-center mb-4">{error}</p>
        <div className="flex gap-3">
          <Button onClick={startCamera} variant="gold">
            Try Again
          </Button>
          {onCancel && (
            <Button onClick={handleCancel} variant="outline" className="border-neutral-600 text-neutral-300">
              Cancel
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Captured image preview
  if (capturedImage) {
    return (
      <div className="flex flex-col items-center">
        {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}
        <p className="text-neutral-400 mb-4">Does this look good?</p>

        <div className="relative rounded-xl overflow-hidden mb-6 border-2 border-neutral-600">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full max-w-sm"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />
          {showGuideCircle && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-4 border-emerald-400/50 rounded-full" />
            </div>
          )}
        </div>

        <div className="flex gap-3 w-full">
          <Button onClick={handleRetake} variant="outline" className="flex-1 border-neutral-600 text-neutral-300">
            Retake
          </Button>
          <Button onClick={handleConfirm} variant="gold" className="flex-1">
            Use This Photo
          </Button>
        </div>
      </div>
    );
  }

  // Live camera view
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
          className="w-full max-w-sm"
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
        />

        {/* Guide circle overlay for selfie */}
        {showGuideCircle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-4 border-amber-200/50 rounded-full" />
          </div>
        )}

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-6xl font-bold text-amber-200 animate-pulse">{countdown}</span>
          </div>
        )}
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3 w-full">
        {onCancel && (
          <Button onClick={handleCancel} variant="outline" className="flex-1 border-neutral-600 text-neutral-300">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleCaptureWithCountdown}
          variant="gold"
          className="flex-1"
          disabled={countdown !== null}
        >
          {countdown !== null ? `${countdown}...` : captureLabel}
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-neutral-700/30 rounded-lg w-full">
        <p className="text-xs text-neutral-400 text-center">
          {showGuideCircle
            ? 'Position your face within the circle for best results'
            : 'Make sure the image is clear and well-lit'}
        </p>
      </div>
    </div>
  );
}
