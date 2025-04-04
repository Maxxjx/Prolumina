
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { CheckCheck, ShieldCheck, Bell, Moon, Languages, User, UserCog } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("english");
  
  const saveSuccess = () => {
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully.",
      variant: "default"
    });
  };
  
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="bg-dark-400 border-none w-full md:w-52 flex-shrink-0">
              <div className="p-2">
                <TabsList className="flex flex-col w-full bg-transparent space-y-1">
                  <TabsTrigger value="profile" className="w-full justify-start px-3">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="account" className="w-full justify-start px-3">
                    <UserCog className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="w-full justify-start px-3">
                    <Moon className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="w-full justify-start px-3">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="w-full justify-start px-3">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>
            </Card>
            
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
                <Card className="bg-dark-400 border-none">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue="John Doe" className="bg-dark-300 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" defaultValue="johndoe" className="bg-dark-300 border-white/10" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-dark-300 border-white/10" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" className="h-24 bg-dark-300 border-white/10" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button onClick={saveSuccess} className="bg-pulse-600 hover:bg-pulse-700">
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="account" className="mt-0">
                <Card className="bg-dark-400 border-none">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-400">Receive email about your account activity</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <Separator className="bg-white/5" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="outline" className="border-white/10">Enable</Button>
                      </div>
                      
                      <Separator className="bg-white/5" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Delete Account</p>
                          <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive">Delete</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="mt-0">
                <Card className="bg-dark-400 border-none">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Appearance</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-3">Theme</p>
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant={theme === "light" ? "default" : "outline"} 
                            className={theme === "light" ? "bg-pulse-600" : "border-white/10"} 
                            onClick={() => setTheme("light")}
                          >
                            Light
                          </Button>
                          <Button 
                            variant={theme === "dark" ? "default" : "outline"} 
                            className={theme === "dark" ? "bg-pulse-600" : "border-white/10"}
                            onClick={() => setTheme("dark")}
                          >
                            Dark
                          </Button>
                          <Button 
                            variant={theme === "system" ? "default" : "outline"} 
                            className={theme === "system" ? "bg-pulse-600" : "border-white/10"}
                            onClick={() => setTheme("system")}
                          >
                            System
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="bg-white/5" />
                      
                      <div>
                        <p className="font-medium mb-3">Language</p>
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant={language === "english" ? "default" : "outline"} 
                            className={language === "english" ? "bg-pulse-600" : "border-white/10"} 
                            onClick={() => setLanguage("english")}
                          >
                            English
                          </Button>
                          <Button 
                            variant={language === "spanish" ? "default" : "outline"} 
                            className={language === "spanish" ? "bg-pulse-600" : "border-white/10"}
                            onClick={() => setLanguage("spanish")}
                          >
                            Spanish
                          </Button>
                          <Button 
                            variant={language === "french" ? "default" : "outline"} 
                            className={language === "french" ? "bg-pulse-600" : "border-white/10"}
                            onClick={() => setLanguage("french")}
                          >
                            French
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button onClick={saveSuccess} className="bg-pulse-600 hover:bg-pulse-700">
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card className="bg-dark-400 border-none">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      {["Task Updates", "Comments", "Mentions", "Project Updates", "System Notifications"].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item}</p>
                            <p className="text-sm text-gray-400">Receive notifications about {item.toLowerCase()}</p>
                          </div>
                          <Switch defaultChecked={i < 3} />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button onClick={saveSuccess} className="bg-pulse-600 hover:bg-pulse-700">
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card className="bg-dark-400 border-none">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">Current Password</Label>
                        <Input id="current_password" type="password" className="bg-dark-300 border-white/10" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input id="new_password" type="password" className="bg-dark-300 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">Confirm Password</Label>
                          <Input id="confirm_password" type="password" className="bg-dark-300 border-white/10" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button onClick={saveSuccess} className="bg-pulse-600 hover:bg-pulse-700">
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
