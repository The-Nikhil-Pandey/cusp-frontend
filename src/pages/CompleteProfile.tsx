
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const timezones = [
  'UTC', 'EST', 'CST', 'MST', 'PST', 'GMT', 'CET', 'JST', 'AEST', 'IST'
];

const socialCareOptions = [
  'Healthcare', 'Counseling', 'Childcare', 'Elder Care', 'Mental Health',
  'Disability Support', 'Social Work', 'Community Outreach', 'Education Support', 'Crisis Intervention'
];

const CompleteProfile = () => {
  const { user, completeProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [timezone, setTimezone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [selectedCareWork, setSelectedCareWork] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCareWork = (option: string) => {
    setSelectedCareWork(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const isFormValid = timezone && jobTitle && company && selectedCareWork.length > 0 && agreedToTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      // API Call Here: /api/user/complete-profile
      await completeProfile({
        timezone,
        jobTitle,
        company,
        socialCareWork: selectedCareWork,
        profileImage: profileImage ? URL.createObjectURL(profileImage) : undefined
      });

      toast({
        title: "Profile completed!",
        description: "Welcome to CUSP! Your profile has been set up successfully.",
      });

      // Show welcome modal here (we'll implement it later)
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Help us personalize your CUSP experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Setup</CardTitle>
            <CardDescription>Please fill in the required information to complete your registration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div>
                <Label htmlFor="profileImage">Profile Image (Optional)</Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              {/* Full Name (Pre-filled, read-only) */}
              <div>
                <Label>Full Name</Label>
                <Input
                  value={user?.fullName || ''}
                  readOnly
                  className="mt-1 bg-muted"
                />
              </div>

              {/* Timezone */}
              <div>
                <Label>Timezone *</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Title */}
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Social Worker, Care Coordinator"
                  className="mt-1"
                />
              </div>

              {/* Company */}
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., City Health Services"
                  className="mt-1"
                />
              </div>

              {/* Social Care Work */}
              <div>
                <Label>What Social Care Work Do You Do? * (Select at least one)</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {socialCareOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => toggleCareWork(option)}
                      className={`cursor-pointer p-2 rounded-md border text-sm transition-colors ${
                        selectedCareWork.includes(option)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-accent'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                {selectedCareWork.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedCareWork.map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I've read and agree to the Terms and Conditions
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? 'Completing Profile...' : 'Confirm & Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteProfile;
