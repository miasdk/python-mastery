import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, LogOut, Settings, Trophy, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface UserMenuProps {
  user: any;
  size?: "sm" | "md" | "lg";
}

export function UserMenu({ user, size = "md" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return response.json();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Redirect to home/landing page
      window.location.href = '/';
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Force redirect even if logout fails
      window.location.href = '/';
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Avatar sizes
  const avatarSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  // User avatar component
  const UserAvatar = () => {
    if (user?.profileImageUrl && !imageError) {
      return (
        <img
          src={user.profileImageUrl}
          alt={`${user.username} profile`}
          className={`${avatarSizes[size]} rounded-full object-cover border-2 border-blue-200 cursor-pointer hover:border-blue-300 transition-colors`}
          onError={() => setImageError(true)}
          onClick={() => setIsOpen(!isOpen)}
        />
      );
    }
    
    // Fallback to initials
    return (
      <div 
        className={`${avatarSizes[size]} bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-200 cursor-pointer hover:bg-blue-700 transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-white font-medium ${textSizes[size]}`}>
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>
    );
  };

  if (!user) {
    return (
      <div className={`${avatarSizes[size]} bg-gray-400 rounded-full flex items-center justify-center animate-pulse`}>
        <span className={`text-white font-medium ${textSizes[size]}`}>...</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <UserAvatar />
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 z-50 animate-in slide-in-from-top-1 duration-200">
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-0">
              {/* User Info Header */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12">
                    {user.profileImageUrl && !imageError ? (
                      <img
                        src={user.profileImageUrl}
                        alt={`${user.username} profile`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-200">
                        <span className="text-white font-medium text-lg">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user.email}
                    </p>
                    {user.firstName && user.lastName && (
                      <p className="text-xs text-gray-500 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Quick View */}
              <div className="p-3 border-b border-gray-100 bg-gray-50">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{user.total_xp || 0}</div>
                    <div className="text-xs text-gray-600">XP</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{user.total_problems || 0}</div>
                    <div className="text-xs text-gray-600">Solved</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{user.current_streak || 0}</div>
                    <div className="text-xs text-gray-600">Streak</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to profile page when implemented
                    console.log("Profile clicked");
                  }}
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span>View Profile</span>
                </button>

                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to achievements page when implemented
                    console.log("Achievements clicked");
                  }}
                >
                  <Trophy className="w-4 h-4 text-gray-500" />
                  <span>Achievements</span>
                </button>

                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to progress page when implemented  
                    console.log("Progress clicked");
                  }}
                >
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <span>Progress</span>
                </button>

                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to settings page when implemented
                    console.log("Settings clicked");
                  }}
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Settings</span>
                </button>

                {/* Divider */}
                <div className="my-2 border-t border-gray-100"></div>

                {/* Logout Button */}
                <button
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}