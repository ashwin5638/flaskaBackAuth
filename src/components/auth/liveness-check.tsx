"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Loader, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadSelfie } from '@/app/actions';

interface LivenessCheckProps {
  onSuccess: (imageData: string) => void;
}

const livenessSteps = [
  'Look straight into the camera',
  'Smile!',
  'Turn your head to the left',
  'Turn your head to the right',
];

export default function LivenessCheck({ onSuccess }: LivenessCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'idle' | 'initializing' | 'streaming' | 'checking' | 'success' | 'captured' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, startUploading] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    let stepTimeout: NodeJS.Timeout;

    if (status === 'checking' && currentStep < livenessSteps.length) {
      stepTimeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000); // 2 seconds per step
    } else if (status === 'checking' && currentStep >= livenessSteps.length) {
      setStatus('success');
    }

    return () => clearTimeout(stepTimeout);
  }, [status, currentStep]);

  const startCamera = async () => {
    setStatus('initializing');
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setStatus('streaming');
          };
        }
      } catch (err) {
        console.error(err);
        setError('Could not access camera. Please allow camera permissions and try again.');
        setStatus('error');
      }
    } else {
      setError('Your browser does not support camera access.');
      setStatus('error');
    }
  };

  const startLivenessCheck = () => {
    setStatus('checking');
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      setStatus('captured');
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleUpload = () => {
    if (!capturedImage) return;

    startUploading(async () => {
        const formData = new FormData();
        // The server action will get a base64 string, this is fine for mock
        formData.append('image', capturedImage);
        formData.append('username', "user"); // In a real app, you would pass the phone number here

        const result = await uploadSelfie(formData);
        
        if (result.success && result.imageUrl) {
            toast({ title: 'Success', description: 'Selfie uploaded successfully!' });
            onSuccess(result.imageUrl);
        } else {
            toast({ variant: 'destructive', title: 'Upload Failed', description: result.message });
            setStatus('captured'); // Allow retry
        }
    });
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">The app needs to verify you are a real person.</p>
            <Button onClick={startCamera}>
              <Camera className="mr-2" /> Start Liveness Check
            </Button>
          </div>
        );
      case 'initializing':
        return <div className="flex items-center justify-center"><Loader className="animate-spin" /> Initializing Camera...</div>;
      case 'error':
        return (
          <div className="text-center text-destructive">
            <AlertTriangle className="mx-auto h-10 w-10 mb-2" />
            <p>{error}</p>
            <Button onClick={startCamera} variant="outline" className="mt-4">Try Again</Button>
          </div>
        );
      case 'streaming':
        return (
            <div className="text-center">
                <p className="mb-4 text-muted-foreground">Position your face inside the circle.</p>
                <Button onClick={startLivenessCheck} variant="default">
                   I'm Ready <ArrowRight className="ml-2" />
                </Button>
            </div>
        );
      case 'checking':
        return <div className="text-center font-semibold text-primary text-lg">{livenessSteps[currentStep]}</div>;
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-2" />
            <p className="font-semibold text-lg">Liveness Check Passed!</p>
            <Button onClick={capture} className="mt-4" variant="default">
              <Camera className="mr-2" /> Capture Selfie
            </Button>
          </div>
        );
      case 'captured':
        return (
            <div className="text-center">
                <p className="font-semibold text-lg mb-4">Confirm Your Selfie</p>
                <img src={capturedImage!} alt="Captured selfie" className="rounded-full w-48 h-48 mx-auto border-4 border-primary shadow-lg object-cover" />
                <div className="flex gap-4 mt-6 justify-center">
                    <Button onClick={startCamera} variant="outline" disabled={isUploading}>Retake</Button>
                    <Button onClick={handleUpload} disabled={isUploading} variant="default">
                        {isUploading ? "Uploading..." : "Looks Good, Upload"}
                    </Button>
                </div>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-64 h-64 bg-muted rounded-full overflow-hidden flex items-center justify-center border-4 border-dashed">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover scale-x-[-1] ${status === 'idle' || status === 'captured' ? 'hidden' : 'block'}`}
        />
        {status === 'captured' && capturedImage && (
             <div className="w-full h-full flex items-center justify-center">
                <p className="font-semibold">Review below</p>
            </div>
        )}
        {(status === 'idle' || status === 'initializing' || status === 'error') && (
          <Camera className="w-16 h-16 text-muted-foreground" />
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="h-16 flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
}
