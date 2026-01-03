import { useRef, useState } from "react";
import Button from "../Button";

export default function CameraCapture({
  onAnswer,
  
}: {
  onAnswer: (url: Blob) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");

  const openCamera = async () => {
    setShowCamera(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current as HTMLVideoElement;
    const canvas = canvasRef.current as HTMLCanvasElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // Convert to Blob
    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "captured-image.png", {
        type: "image/png",
      });

      setCapturedImage(URL.createObjectURL(file));
      onAnswer(file); // ⬅️ send Blob/File instead of URL

      // stop webcam
      if (video.srcObject instanceof MediaStream) {
        video.srcObject.getTracks().forEach((t) => t.stop());
      }

      setShowCamera(false);
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!showCamera && (
        <Button variant="primary" size="md" onClick={openCamera}>
          📸 Capture Image
        </Button>
      )}

      {showCamera && (
        <div className="camera-modal flex-col flex justify-center items-center ">
          <video ref={videoRef} autoPlay playsInline className="rounded" />
          <Button
            variant="primary"
            size="md"
            onClick={capturePhoto}
            className="mt-4"
          >
            Capture
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {capturedImage && (
        <img
          src={capturedImage}
          className="mt-4 rounded-lg border max-h-64 object-contain"
        />
      )}
    </div>
  );
}
