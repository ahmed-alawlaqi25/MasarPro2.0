import { Trophy } from "lucide-react";

const AcceptedCelebration = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center animate-bounce">
        <Trophy size={100} className="text-yellow-500" />
        <h2 className="mt-4 text-2xl font-bold">
          Congratulations! 🎉
        </h2>
        <p>You got the job!</p>
      </div>
    </div>
  );
};

export default AcceptedCelebration;