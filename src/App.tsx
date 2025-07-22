import Learn from "@/pages/Learn";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import CompleteProfile from "@/pages/CompleteProfile";
import Dashboard from "@/pages/Dashboard";
import Events from "@/pages/Events";
import Members from "@/pages/Members";
import Leaderboard from "@/pages/Leaderboard";
import Directories from "@/pages/Directories";
import Tools from "@/pages/Tools";

import NotFound from "@/pages/NotFound";
import Chats from "@/pages/Chats";
import Resources from "@/pages/Resources";
import Courses from "@/pages/Courses";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Profile completion (semi-private) */}
              <Route path="/complete-profile" element={<CompleteProfile />} />

              {/* Protected routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Events />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/members"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Members />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Leaderboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/directories"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Directories />
                    </Layout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/tools"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Tools />
                    </Layout>
                  </PrivateRoute>
                }
              />

              {/* Courses page */}
              {/* Learn PPT page */}
              <Route
                path="/learn/:topicId"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Learn />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Courses />
                    </Layout>
                  </PrivateRoute>
                }
              />

              {/* Resources page */}
              <Route
                path="/resources"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Resources />
                    </Layout>
                  </PrivateRoute>
                }
              />

              {/* Chats page */}
              <Route
                path="/chats"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Chats />
                    </Layout>
                  </PrivateRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
