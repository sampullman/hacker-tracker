import Button from './ui/Button';
import TrackerCard from './TrackerCard';
import { mockTrackers } from '../data/mockTrackers';

const TrackPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Trackers</h1>
          <Button>New Tracker</Button>
        </div>
        <div className="grid gap-4">
          {mockTrackers.map((tracker) => (
            <TrackerCard key={tracker.id} tracker={tracker} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
