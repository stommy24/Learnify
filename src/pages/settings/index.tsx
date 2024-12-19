import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Settings() {
  return (
    <MainLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Profile Settings</h2>
          {/* Add profile form */}
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Preferences</h2>
          {/* Add preferences form */}
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Notifications</h2>
          {/* Add notification settings */}
        </Card>
      </div>
    </MainLayout>
  );
} 