import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { googleSignUp } from "@/api/authApi";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Password validation states
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const validatePassword = (pwd: string) => {
    return {
      length: pwd.length >= 6,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValidations(validatePassword(value));
  };

  const allValid = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({
        title: "Missing Fields",
        description:
          "Full Name, Email, and Password are mandatory. Please fill all fields.",
        variant: "destructive",
      });
      return;
    }
    if (!allValid) {
      toast({
        title: "Invalid Password",
        description: "Password must meet all requirements before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await signup(fullName, email, password);
      toast({
        title: "Account created!",
        description: "Please complete your profile setup.",
      });
      navigate("/complete-profile");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description:
          error?.response?.data?.msg ||
          "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    googleSignUp()
      .then((data) => {
        localStorage.setItem(
          "cusp-user",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.username,
            profileImage: data.user.profile_photo,
            password: data.password,
            profileCompleted: true,
            joinedDate: new Date().toISOString(),
            socialCareWork: [],
            phone: "",
            que1: "",
            que2: "",
            tag_id: [],
          })
        );
        localStorage.setItem("cusp-token", data.token);
        toast({
          title: "Google Sign-Up Successful",
          description: data.msg || "You are now signed up with Google.",
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        toast({
          title: "Google Sign-Up Failed",
          description: error.message || "Could not sign up with Google.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-2 py-6 sm:px-4 md:px-6">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 sm:h-16 rounded-lg flex items-center justify-center">
              <img
                src={
                  theme === "dark"
                    ? "/cusp-logo-dark.png"
                    : "/cusp-logo-light.png"
                }
                alt="CUSP Logo"
                className="h-10 sm:h-14 md:h-16 w-auto "
              />
            </div>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">
            Join the social care community
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Sign up to start connecting with fellow social care professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="mt-1 pr-10"
                  />

                  <button
                    type="button"
                    className="absolute right-2 top-5 -translate-y-1/2 text-muted-foreground focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      // Lucide EyeOff
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.67 1.87-3.21 3.32-4.47" />
                        <path d="M9.53 9.53A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .47-.09.92-.26 1.33" />
                        <path d="M14.47 14.47A3.5 3.5 0 0 1 12 15.5c-1.93 0-3.5-1.57-3.5-3.5 0-.47.09-.92.26-1.33" />
                        <line
                          x1="2"
                          x2="22"
                          y1="2"
                          y2="22"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      // Lucide Eye
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M2 12S5.818 5 12 5s10 7 10 7-3.818 7-10 7S2 12 2 12z" />
                      </svg>
                    )}
                  </button>

                  {/* Password requirements */}
                  <ul className="mt-2 mb-2 text-sm">
                    <li className="flex items-center gap-2">
                      {passwordValidations.length ? (
                        <span className="text-green-600">&#10003;</span>
                      ) : (
                        <span className="text-red-400">&#10007;</span>
                      )}
                      Minimum 6 characters
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordValidations.uppercase ? (
                        <span className="text-green-600">&#10003;</span>
                      ) : (
                        <span className="text-red-400">&#10007;</span>
                      )}
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordValidations.lowercase ? (
                        <span className="text-green-600">&#10003;</span>
                      ) : (
                        <span className="text-red-400">&#10007;</span>
                      )}
                      At least one lowercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordValidations.number ? (
                        <span className="text-green-600">&#10003;</span>
                      ) : (
                        <span className="text-red-400">&#10007;</span>
                      )}
                      At least one number
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordValidations.special ? (
                        <span className="text-green-600">&#10003;</span>
                      ) : (
                        <span className="text-red-400">&#10007;</span>
                      )}
                      At least one special character
                    </li>
                  </ul>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              {/* Disable button if password is not valid */}
              <style>{`
                button[type='submit']:disabled {
                  opacity: 0.6;
                  cursor: not-allowed;
                }
              `}</style>
            </form>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleSignUp}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
            </div> */}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
