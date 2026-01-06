import { Card, CardContent } from "../Card/index";

export default function AssessmentComplete() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-6">
          <p className="text-lg font-medium text-gray-800">
            Your assessment is complete.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Your neuroprofiling report is being generated.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
