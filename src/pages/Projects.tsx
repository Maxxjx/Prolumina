import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Plus,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Clock,
  CalendarClock
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/stores/projectStore";
import ProjectForm from "@/components/projects/ProjectForm";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import AssignTeamDialog from "@/components/projects/AssignTeamDialog";

export default function Projects() {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  
  const { projects, fetchProjects, addProject, updateProject, deleteProject } = useProjectStore();
  
  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = (projectData: any) => {
    addProject(projectData);
    setShowAddDialog(false);
    toast({
      title: "Project created",
      description: "The project has been successfully created.",
    });
  };

  const handleEditProject = (projectData: any) => {
    updateProject(currentProject.id, projectData);
    setShowEditDialog(false);
    toast({
      title: "Project updated",
      description: "The project has been successfully updated.",
    });
  };

  const handleDeleteProject = () => {
    deleteProject(currentProject.id);
    setShowDeleteDialog(false);
    toast({
      title: "Project deleted",
      description: "The project has been successfully deleted.",
    });
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const openEditDialog = (project: any) => {
    setCurrentProject(project);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (project: any) => {
    setCurrentProject(project);
    setShowDeleteDialog(true);
  };

  const openAssignDialog = (project: any) => {
    setCurrentProject(project);
    setShowAssignDialog(true);
  };

  return (
    <DashboardLayout title="Projects">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Project Management</h2>
            <p className="text-sm text-gray-400">Manage your projects and track their progress</p>
          </div>
          {isAdmin && (
            <Button className="bg-pulse-600 hover:bg-pulse-700" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      </div>
      
      <Card className="bg-dark-400 border-none shadow-lg mb-8">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search projects..." 
                className="pl-9 bg-dark-300 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="border-white/10">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-dark-300">
                  <TableHead className="text-gray-400">Project Name</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Team</TableHead>
                  <TableHead className="text-gray-400">Deadline</TableHead>
                  <TableHead className="text-gray-400">Progress</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      No projects found. Create your first project to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map(project => (
                    <TableRow key={project.id} className="border-white/5 hover:bg-dark-300">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="cursor-pointer hover:text-pulse-500" onClick={() => handleViewProject(project.id)}>
                            {project.name}
                          </span>
                          <span className="text-xs text-gray-400">{project.description.substring(0, 50)}...</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          project.status === "Completed" ? "outline" : 
                          project.status === "In Progress" ? "default" : 
                          "secondary"
                        } className={
                          project.status === "Completed" ? "border-green-500 text-green-500" : 
                          project.status === "In Progress" ? "bg-pulse-600" : 
                          "bg-gray-700"
                        }>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member: any, index: number) => (
                            <div key={index} className="h-8 w-8 rounded-full bg-pulse-500/30 flex items-center justify-center border border-dark-400 overflow-hidden text-xs font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {project.team.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-dark-300 flex items-center justify-center border border-dark-400 overflow-hidden text-xs">
                              +{project.team.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-2 text-gray-400" />
                          {project.deadline}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-dark-300 rounded-full h-2.5">
                          <div className="bg-pulse-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{project.progress}% Complete</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-dark-300 border-white/10">
                            <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleViewProject(project.id)}>
                              <Clock className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {isAdmin && (
                              <>
                                <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => openEditDialog(project)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => openAssignDialog(project)}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Assign Team
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center text-red-500 cursor-pointer" onClick={() => openDeleteDialog(project)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Add Project Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-dark-400 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm onSubmit={handleAddProject} />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-dark-400 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm initialData={currentProject} onSubmit={handleEditProject} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone and will also delete all tasks associated with this project."
      />

      {/* Assign Team Dialog */}
      <AssignTeamDialog
        isOpen={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        project={currentProject}
      />
    </DashboardLayout>
  );
}
