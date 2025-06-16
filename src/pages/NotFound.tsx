import { Link } from 'react-router-dom';
import { ParkingSquareIcon } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center">
        <ParkingSquareIcon className="h-20 w-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Page Not Found</h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            to="/"
            variant="primary"
          >
            Go to Dashboard
          </Button>
          <Button
            to="/buildings"
            variant="outline"
          >
            Manage Buildings
          </Button>
        </div>
      </div>
    </div>
  );
}