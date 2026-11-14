"use client";

import { CaptureStep } from "@/components/CaptureStep";
import { FaceShapeStep } from "@/components/FaceShapeStep";
import { CutsStep } from "@/components/CutsStep";
import { CompareStep } from "@/components/CompareStep";
import { useSession } from "@/contexts/SessionContext";

export function TryOnFlow() {
  const { step } = useSession();

  switch (step) {
    case "capture":
      return <CaptureStep />;
    case "face":
      return <FaceShapeStep />;
    case "cuts":
      return <CutsStep />;
    case "compare":
      return <CompareStep />;
    default:
      return <CaptureStep />;
  }
}
