
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PencilLine, Mail, Phone, MapPin, Calendar, Briefcase, User, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout title="My Profile">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-dark-400 border-none shadow-lg lg:col-span-1">
          <div className="p-6 text-center">
            <div className="flex justify-end mb-2">
              <Button variant="ghost" size="icon">
                <PencilLine className="h-4 w-4" />
              </Button>
            </div>
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user?.name || 'User Name'}</h2>
            <p className="text-sm text-gray-400 mt-1">Senior Developer</p>
            
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" className="border-white/10">Message</Button>
              <Button variant="default" className="bg-pulse-600 hover:bg-pulse-700">Edit Profile</Button>
            </div>
            
            <div className="mt-6 border-t border-white/5 pt-6">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-4 w-4 mr-2 text-pulse-500" />
                <span className="text-sm">{user?.role || 'User'} Account</span>
              </div>
              <p className="text-sm text-gray-400">Member since January 2023</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-dark-400 border-none shadow-lg lg:col-span-2">
          <div className="p-6">
            <Tabs defaultValue="info">
              <TabsList className="bg-dark-300 border-white/10 mb-6">
                <TabsTrigger value="info">Personal Info</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-300">Full Name</h3>
                        <p className="mt-1">{user?.name || 'User Name'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-300">Email</h3>
                        <p className="mt-1">{user?.email || 'email@example.com'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-300">Phone</h3>
                        <p className="mt-1">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-300">Location</h3>
                        <p className="mt-1">San Francisco, CA</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-300">Joined</h3>
                        <p className="mt-1">January 15, 2023</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-300">Department</h3>
                        <p className="mt-1">Engineering</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/5 pt-6">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">About</h3>
                    <p className="text-sm text-gray-400">
                      Senior developer with over 6 years of experience in building web applications.
                      Specializing in React, Node.js, and cloud infrastructure. Passionate about creating
                      intuitive user experiences and solving complex problems.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-4 pb-4 border-b border-white/5">
                      <div className="h-10 w-10 rounded-full bg-dark-300 flex items-center justify-center">
                        <span className="text-pulse-500">A{i}</span>
                      </div>
                      <div>
                        <p className="text-sm">Completed task <span className="font-medium">Design Updates</span></p>
                        <p className="text-xs text-gray-400 mt-1">{i} day{i > 1 ? 's' : ''} ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <p className="text-sm text-gray-400">
                  Account settings would be shown here with options to change email, password, and notification preferences.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
