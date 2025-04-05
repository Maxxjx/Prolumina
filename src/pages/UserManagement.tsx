import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ChevronDown, 
  Users, 
  Search, 
  Plus,
  Filter,
  MoreHorizontal,
  Shield,
  Eye,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  UserPlus,
  RefreshCw,
  UserCheck,
  BadgeCheck
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/stores/userStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import UserForm from "@/components/users/UserForm";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActivityLogStore } from "@/stores/activityLogStore";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function UserManagement() {
  const { users, loading: usersLoading, fetchUsers, addUser, updateUser, deleteUser } = useUserStore();
  const { logs, loading: logsLoading, fetchLogs } = useActivityLogStore();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    console.log("UserManagement: Fetching users and logs");
    fetchUsers();
    fetchLogs(10);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    await fetchLogs(10);
    setIsRefreshing(false);
    
    toast({
      title: "Refreshed",
      description: "User data has been updated",
    });
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (userData: any) => {
    addUser(userData);
    setShowAddDialog(false);
    toast({
      title: "User created",
      description: "The user has been successfully created.",
      variant: "default",
    });
  };

  const handleEditUser = (userData: any) => {
    updateUser(currentUser.id, userData);
    setShowEditDialog(false);
    toast({
      title: "User updated",
      description: "The user has been successfully updated.",
    });
  };

  const handleDeleteUser = () => {
    deleteUser(currentUser.id);
    setShowDeleteDialog(false);
    toast({
      title: "User deleted",
      description: "The user has been successfully deleted.",
      variant: "destructive",
    });
  };

  const openEditDialog = (user: any) => {
    setCurrentUser(user);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (user: any) => {
    setCurrentUser(user);
    setShowDeleteDialog(true);
  };
  
  const formatTimeDifference = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours === 1) {
      return "1 hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <DashboardLayout title="User Management">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center">
              <Users className="h-6 w-6 mr-2 text-pulse-500" />
              User Management
            </h2>
            <p className="text-sm text-gray-400">Add, edit and manage user permissions</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={isRefreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-pulse-600 hover:bg-pulse-700 transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="bg-dark-400 border-none shadow-lg mb-8 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search users..." 
                  className="pl-9 bg-dark-300 border-white/10 focus:border-pulse-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-white/10 w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    {roleFilter === "all" ? "All Roles" : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-dark-300 border-white/10">
                    <DropdownMenuItem 
                      onClick={() => setRoleFilter("all")}
                      className={roleFilter === "all" ? "bg-pulse-600/20 text-pulse-400" : ""}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      All Roles
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setRoleFilter("admin")}
                      className={roleFilter === "admin" ? "bg-pulse-600/20 text-pulse-400" : ""}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setRoleFilter("team")}
                      className={roleFilter === "team" ? "bg-pulse-600/20 text-pulse-400" : ""}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Team
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setRoleFilter("client")}
                      className={roleFilter === "client" ? "bg-pulse-600/20 text-pulse-400" : ""}
                    >
                      <BadgeCheck className="h-4 w-4 mr-2" />
                      Client
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
            <div className="overflow-auto rounded-lg shadow-inner">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-dark-300">
                  <TableHead className="text-gray-400">Name</TableHead>
                  {!isMobile && <TableHead className="text-gray-400">Email</TableHead>}
                  <TableHead className="text-gray-400">Role</TableHead>
                  {!isMobile && <TableHead className="text-gray-400">Status</TableHead>}
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading ? (
                    Array(5).fill(null).map((_, index) => (
                      <TableRow key={index} className="border-white/5">
                        <TableCell>
                          <div className="flex items-center">
                            <Skeleton className="h-8 w-8 rounded-full mr-2" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                    </TableCell>
                        {!isMobile && <TableCell><Skeleton className="h-4 w-40" /></TableCell>}
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        {!isMobile && <TableCell><Skeleton className="h-5 w-16" /></TableCell>}
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                    ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 3 : 5} className="text-center py-8 text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="h-10 w-10 text-gray-500 mb-2" />
                          <p>No users found. Create a new user to get started.</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3" 
                            onClick={() => setShowAddDialog(true)}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Add User
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence>
                      {filteredUsers.map((user, index) => (
                        <TableRow 
                          key={user.id}
                          className="border-white/5 hover:bg-dark-300 transition-colors group"
                        >
                          <motion.td
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="font-medium p-4"
                          >
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3 border border-white/10">
                                {user.avatar_url ? (
                                  <AvatarImage src={user.avatar_url} alt={user.name} />
                                ) : null}
                                <AvatarFallback className="bg-pulse-500/20 text-pulse-500 text-sm">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-white transition-colors group-hover:text-pulse-400">
                                  {user.name}
                                </span>
                                {isMobile && (
                                  <span className="text-xs text-gray-400 block">
                                    {user.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.td>
                          {!isMobile && (
                            <motion.td 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 + 0.05 }}
                              className="text-gray-300 p-4"
                            >
                              {user.email}
                            </motion.td>
                          )}
                          <motion.td
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                            className="p-4"
                          >
                            <Badge 
                              variant={user.role === "admin" ? "default" : "secondary"} 
                              className={
                                user.role === "admin" 
                                  ? "bg-pulse-600 hover:bg-pulse-700" 
                                  : user.role === "team"
                                  ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                  : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              }
                            >
                          {user.role === "admin" ? (
                            <Shield className="h-3 w-3 mr-1" />
                              ) : user.role === "team" ? (
                                <UserCheck className="h-3 w-3 mr-1" />
                              ) : (
                                <BadgeCheck className="h-3 w-3 mr-1" />
                              )}
                          {user.role}
                        </Badge>
                          </motion.td>
                      {!isMobile && (
                            <motion.td
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 + 0.15 }}
                              className="p-4"
                            >
                              <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10">
                            active
                          </Badge>
                            </motion.td>
                          )}
                          <motion.td
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className="text-right p-4"
                          >
                            <TooltipProvider>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>User actions</p>
                                    </TooltipContent>
                                  </Tooltip>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-dark-300 border-white/10">
                            <DropdownMenuItem className="flex items-center cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                                    View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => openEditDialog(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-white/10" />
                                  <DropdownMenuItem 
                                    className="flex items-center text-red-500 cursor-pointer hover:bg-red-500/10" 
                                    onClick={() => openDeleteDialog(user)}
                                  >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                            </TooltipProvider>
                          </motion.td>
                    </TableRow>
                      ))}
                    </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-dark-400 border-none shadow-lg h-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-pulse-500" />
                  Recent Activity
                </h3>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/20">
                  {logs.length} Activities
                </Badge>
              </div>
              
              <ScrollArea className="h-[300px] pr-4">
                {logsLoading ? (
                  <div className="space-y-4">
                    {Array(5).fill(null).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {logs.map((log, index) => (
                      <motion.div 
                        key={log.id} 
                        className="flex items-start relative group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        {index !== logs.length - 1 && (
                          <div className="absolute left-4 top-8 w-px h-full bg-gray-800 -z-10" />
                        )}
                        <div className="w-8 h-8 rounded-full bg-dark-300 border border-white/10 flex items-center justify-center shrink-0">
                          {log.action === 'created' ? (
                            <Plus className="h-4 w-4 text-green-500" />
                          ) : log.action === 'updated' ? (
                            <Edit className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm text-white">
                            <span className="font-medium text-pulse-400">{log.userName}</span> {log.action} a {log.entityType?.toLowerCase() || 'record'}
                            {log.details && <span className="text-gray-400"> - {log.details}</span>}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeDifference(new Date(log.timestamp || new Date()))}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="bg-dark-400 border-none shadow-lg h-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-pulse-500" />
                User Stats
              </h3>
              
              <div className="space-y-5">
                <div className="bg-dark-300 rounded-lg p-4 border border-white/5">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-gray-400">Total Users</p>
                    <p className="text-sm font-medium text-white">{users.length}</p>
                  </div>
                  <div className="w-full bg-dark-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pulse-500 h-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-dark-300 rounded-lg p-3 border border-white/5">
                    <div className="mb-1 flex justify-center">
                      <Shield className="h-5 w-5 text-pulse-500" />
                    </div>
                    <p className="text-xl font-bold text-center text-white">
                      {users.filter(user => user.role === 'admin').length}
                    </p>
                    <p className="text-xs text-gray-400 text-center">Admins</p>
                  </div>
                  
                  <div className="bg-dark-300 rounded-lg p-3 border border-white/5">
                    <div className="mb-1 flex justify-center">
                      <UserCheck className="h-5 w-5 text-blue-500" />
                      </div>
                    <p className="text-xl font-bold text-center text-white">
                      {users.filter(user => user.role === 'team').length}
                        </p>
                    <p className="text-xs text-gray-400 text-center">Team</p>
                      </div>
                  
                  <div className="bg-dark-300 rounded-lg p-3 border border-white/5">
                    <div className="mb-1 flex justify-center">
                      <BadgeCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xl font-bold text-center text-white">
                      {users.filter(user => user.role === 'client').length}
                    </p>
                    <p className="text-xs text-gray-400 text-center">Clients</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">User Role Distribution</p>
                  <div className="flex h-4 rounded-full overflow-hidden">
                    {users.length > 0 ? (
                      <>
                        <div 
                          className="bg-pulse-500 h-full"
                          style={{ 
                            width: `${(users.filter(u => u.role === 'admin').length / users.length) * 100}%`,
                            minWidth: users.filter(u => u.role === 'admin').length > 0 ? '10%' : '0' 
                          }}
                        ></div>
                        <div 
                          className="bg-blue-500 h-full"
                          style={{ 
                            width: `${(users.filter(u => u.role === 'team').length / users.length) * 100}%`,
                            minWidth: users.filter(u => u.role === 'team').length > 0 ? '10%' : '0'
                          }}
                        ></div>
                        <div 
                          className="bg-green-500 h-full"
                          style={{ 
                            width: `${(users.filter(u => u.role === 'client').length / users.length) * 100}%`,
                            minWidth: users.filter(u => u.role === 'client').length > 0 ? '10%' : '0'
                          }}
                        ></div>
                      </>
                    ) : (
                      <div className="bg-dark-200 h-full w-full"></div>
                    )}
                  </div>
                  <div className="flex text-xs justify-between mt-1">
                    <span className="text-pulse-400">Admin</span>
                    <span className="text-blue-400">Team</span>
                    <span className="text-green-400">Client</span>
                  </div>
                </div>
              </div>
          </div>
        </Card>
        </motion.div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px] bg-dark-400 border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-pulse-500" />
              Create New User
            </DialogTitle>
            <DialogDescription>
              Add a new user to the system with specific roles and permissions.
            </DialogDescription>
          </DialogHeader>
          <UserForm onSubmit={handleAddUser} />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px] bg-dark-400 border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2 text-blue-500" />
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user details and permissions.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <UserForm 
              initialData={currentUser} 
              onSubmit={handleEditUser} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[450px] bg-dark-400 border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user and all associated data.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
      <DeleteConfirmation
              title={`Delete User: ${currentUser.name}`}
              description={`Are you sure you want to delete this user? This will remove all of their data from the system.`}
              onConfirm={handleDeleteUser}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
