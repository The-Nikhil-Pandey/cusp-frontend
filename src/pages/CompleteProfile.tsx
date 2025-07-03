import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchTags, Tag } from "@/api/tags";
import { ArrowLeft, X } from "lucide-react";

const timezones = [
  "UTC",
  "EST",
  "CST",
  "MST",
  "PST",
  "GMT",
  "CET",
  "JST",
  "AEST",
  "IST",
];

const languages = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Russian",
  "Portuguese",
];

const CompleteProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [timezone, setTimezone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("");
  const [headline, setHeadline] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [que1, setQue1] = useState<string>("");
  const [que2, setQue2] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");

  React.useEffect(() => {
    fetchTags().then(setTags);
  }, []);

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const isFormValid =
    timezone &&
    jobTitle &&
    company &&
    selectedTagIds.length > 0 &&
    agreedToTerms &&
    language &&
    headline &&
    phone &&
    address &&
    que1 &&
    que2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", user?.fullName || "");
      formData.append("email", user?.email || "");
      formData.append("password", user?.password || "");
      formData.append("phone", phone);
      formData.append("job_title", jobTitle);
      formData.append("company_name", company);
      if (profileImage) formData.append("profile_photo", profileImage);
      formData.append("timezone", timezone);
      formData.append("language", language);
      formData.append("headline", headline);
      formData.append("tag_id", JSON.stringify(selectedTagIds));
      formData.append("address", address);
      formData.append("que1", que1);
      formData.append("que2", que2);

      const { registerUser } = await import("@/api");
      const res = await registerUser(formData);

      toast({
        title: "Profile completed!",
        description:
          "Welcome to CUSP! Your profile has been set up successfully.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.msg ||
          "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Please select a valid image file.");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setImageError("Image size should not exceed 3MB.");
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImage(null);
      setProfileImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    setImageError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full bg-background border border-primary/20 shadow transition-colors hover:bg-primary/10 hover:border-primary/40 focus:ring-2 focus:ring-primary/30"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
        </Button>
      </div>
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            Help us personalize your CUSP experience
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Setup</CardTitle>
            <CardDescription>
              Please fill in the required information to complete your
              registration
            </CardDescription>
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
                  onChange={handleProfileImageChange}
                  className="mt-1"
                  disabled={!!profileImage}
                />
                {imageError && (
                  <div className="text-red-500 text-xs mt-1">{imageError}</div>
                )}
                {profileImagePreview && (
                  <div className="relative mt-3 w-32 h-32 rounded-lg overflow-hidden border border-primary/30 bg-muted flex items-center justify-center">
                    <img
                      src={profileImagePreview}
                      alt="Profile Preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveImage();
                        // Also clear the file input value
                        const input = document.getElementById(
                          "profileImage"
                        ) as HTMLInputElement | null;
                        if (input) input.value = "";
                      }}
                      className="absolute top-1 right-1 bg-background rounded-full p-1 shadow hover:bg-primary/10 transition"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                )}
              </div>

              {/* Full Name (Editable) */}
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={user?.fullName !== undefined ? user.fullName : ""}
                  onChange={(e) => user && (user.fullName = e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 bg-background border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  required
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
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
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

              {/* Tags (Social Care Work) */}
              <div>
                <Label>
                  What Social Care Work Do You Do? * (Select at least one)
                </Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`cursor-pointer p-2 rounded-md border text-sm transition-colors ${
                        selectedTagIds.includes(tag.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-accent"
                      }`}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
                {selectedTagIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tags
                      .filter((tag) => selectedTagIds.includes(tag.id))
                      .map((tag) => (
                        <Badge key={tag.id} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>

              {/* Language */}
              <div>
                <Label>Language *</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Headline */}
              <div>
                <Label htmlFor="headline">Headline *</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g., Passionate Social Worker, Community Leader"
                  className="mt-1"
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +91 9876543210"
                  required
                  className="mt-1 bg-background border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="mt-1 bg-background border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  required
                />
              </div>

              {/* Question 1 */}
              <div>
                <Label>Are you planning to open a squat practice? *</Label>
                <div className="flex gap-4 mt-1">
                  <Button
                    type="button"
                    variant={que1 === "yes" ? "default" : "outline"}
                    onClick={() => setQue1("yes")}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={que1 === "no" ? "default" : "outline"}
                    onClick={() => setQue1("no")}
                  >
                    No
                  </Button>
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <Label>Are you a supplier? *</Label>
                <div className="flex gap-4 mt-1">
                  <Button
                    type="button"
                    variant={que2 === "yes" ? "default" : "outline"}
                    onClick={() => setQue2("yes")}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={que2 === "no" ? "default" : "outline"}
                    onClick={() => setQue2("no")}
                  >
                    No
                  </Button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked as boolean)
                  }
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
                {isLoading ? "Completing Profile..." : "Confirm & Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteProfile;
