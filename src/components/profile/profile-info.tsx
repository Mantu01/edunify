'use client';

import { useState } from 'react';
import { useUser } from '@/contexts/user-context';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Mail, User, Shield, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ProfileContent() {
  const { user, isLoading, updateUser, uploadProfilePic, uploadBanner } = useUser();
  const [username, setUsername] = useState('');
  const [updating, setUpdating] = useState(false);
  const [previewProfilePic, setPreviewProfilePic] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
          <p className="text-lg font-medium text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md border-amber-200 bg-amber-50/30">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-lg font-medium">User not found. Please log in.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewProfilePic(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUpdating(true);
      await uploadProfilePic(file);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewBanner(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUpdating(true);
      await uploadBanner(file);
    } catch (error) {
      console.error('Failed to upload banner:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      await updateUser({ username });
      setUsername('');
      toast.success('Username updated successfully');
    } catch (error) {
      console.error('Failed to update username:', error);
      toast.error('Failed to update username');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/10 to-orange-50/10 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Card className="overflow-hidden border-2 border-amber-200 bg-linear-to-br from-white to-amber-50/20 shadow-lg">
          <div className="relative h-48 bg-linear-to-r from-amber-100 to-orange-100 md:h-56">
            {previewBanner || user.banner ? (
              <img
                src={previewBanner || user.banner}
                alt="Banner"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-amber-400" />
                  <p className="mt-2 text-sm text-amber-600">No banner uploaded</p>
                </div>
              </div>
            )}
            <div className="absolute -bottom-16 left-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                {previewProfilePic || user.profilePic ? (
                  <AvatarImage src={previewProfilePic || user.profilePic} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-linear-to-br from-amber-100 to-orange-100 text-amber-800">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>

          <CardContent className="pt-20">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="banner-upload" className="mb-2 block text-sm font-medium">
                    Banner Image
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                      disabled={updating}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('banner-upload')?.click()}
                      disabled={updating}
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {updating ? 'Uploading...' : 'Change Banner'}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="profile-upload" className="mb-2 block text-sm font-medium">
                    Profile Picture
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="hidden"
                      disabled={updating}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('profile-upload')?.click()}
                      disabled={updating}
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {updating ? 'Uploading...' : 'Change Photo'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">User Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">Email:</span>
                      <span className="text-sm text-gray-600">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">Username:</span>
                      <span className="text-sm text-gray-600">{user.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">Role:</span>
                      <span className="text-sm text-gray-600">{user.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700">Verified:</span>
                      <span className="text-sm text-gray-600">{user.isVerified ? 'Yes' : 'No'}</span>
                    </div>
                    {user.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">Member Since:</span>
                        <span className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-linear-to-br from-white to-amber-50/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-amber-600" />
              Update Username
            </CardTitle>
            <CardDescription>Choose a new username for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter new username"
                  disabled={updating}
                  className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <Button
                onClick={handleUsernameUpdate}
                disabled={updating || !username.trim()}
                className="bg-linear-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Username'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}