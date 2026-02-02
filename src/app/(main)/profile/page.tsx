
import ProfileClient from '@/components/profile/profile-info';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50/20 via-orange-50/10 to-red-50/10 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-amber-50/5 border-amber-200/30 shadow-lg shadow-amber-500/5">
          <div className="p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6 font-serif tracking-wider border-b border-amber-200/40 pb-3">
              MY PROFILE
            </h1>
            <ProfileClient />
          </div>
        </Card>
      </div>
    </div>
  );
}