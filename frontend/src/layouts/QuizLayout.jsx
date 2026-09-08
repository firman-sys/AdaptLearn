import { Outlet } from 'react-router-dom';

const QuizLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 md:p-8">
      <Outlet />
    </div>
  );
};

export default QuizLayout;