import Button from '../components/ui/Button';
import { Ghost } from 'lucide-react';

function NotFoundPage() {
  return (
    <section className="bg-bg py-32">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6 animate-bounce"><Ghost className="w-20 h-20 text-primary" /></div>
        <h1 className="text-6xl font-extrabold text-text font-heading">404</h1>
        <p className="mt-4 text-xl text-text-light">
          Oops! This page seems to have wandered off to play.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/" variant="primary" size="lg">
            Back to Home
          </Button>
          <Button href="/collection" variant="outline" size="lg">
            Browse Collection
          </Button>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
