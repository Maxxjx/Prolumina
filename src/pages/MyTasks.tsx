
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskStore } from "@/stores/taskStore";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm from "@/components/tasks/TaskForm";

export default function MyTasks() {
  const { tasks, fetchTasks, updateTask } = useTaskStore();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks that are assigned to the current user
  const myTasks = tasks.filter(task => 
    task.assignedTo && task.assignedTo.some(assignee => assignee.id === user?.id)
  );

  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    await updateTask(id, { 
      status: completed ? 'completed' : 'todo' 
    });
  };

  const filteredTasks = myTasks.filter(task => {
    // Search filter
    if (searchText && !task.title.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filter === "all") return true;
    if (filter === "completed") return task.status === 'completed';
    if (filter === "active") return task.status !== 'completed';
    return true;
  });

  return (
    <DashboardLayout title="My Tasks">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9 bg-dark-400 border-white/10"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-pulse-600 hover:bg-pulse-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm 
                onTaskCreated={() => {
                  setIsFormOpen(false);
                  fetchTasks(); // Refresh tasks after creating a new one
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-dark-400 border-white/10 mb-6">
          <TabsTrigger value="all" onClick={() => setFilter("all")}>All Tasks</TabsTrigger>
          <TabsTrigger value="active" onClick={() => setFilter("active")}>Active</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <Card className="bg-dark-400 border-none shadow-lg">
            <div className="p-0">
              <div className="divide-y divide-white/5">
                {filteredTasks.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-400">No tasks found</p>
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggleCompletion={toggleTaskCompletion} 
                    />
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="mt-0">
          <Card className="bg-dark-400 border-none shadow-lg">
            <div className="p-0">
              <div className="divide-y divide-white/5">
                {filteredTasks.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-400">No active tasks found</p>
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggleCompletion={toggleTaskCompletion} 
                    />
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          <Card className="bg-dark-400 border-none shadow-lg">
            <div className="p-0">
              <div className="divide-y divide-white/5">
                {filteredTasks.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-400">No completed tasks found</p>
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggleCompletion={toggleTaskCompletion} 
                    />
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

// Extract TaskItem into a separate component for better readability
function TaskItem({ task, onToggleCompletion }) {
  const isCompleted = task.status === 'completed';
  
  return (
    <div className="p-4 flex items-start gap-4">
      <Checkbox 
        checked={isCompleted} 
        onCheckedChange={(checked) => onToggleCompletion(task.id, checked === true)}
        className="mt-1"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          <Badge 
            variant={
              task.priority === "Critical" ? "destructive" : 
              task.priority === "High" ? "default" :
              task.priority === "Medium" ? "secondary" : 
              "outline"
            }
            className="ml-2"
          >
            {task.priority}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
          <span>{task.projectId}</span>
          <span>•</span>
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          <span>•</span>
          <span className={
            task.status === "completed" ? "text-green-400" :
            task.status === "in-progress" ? "text-blue-400" :
            task.status === "review" ? "text-yellow-400" :
            "text-gray-400"
          }>
            {task.status === 'todo' ? 'To Do' : 
             task.status === 'in-progress' ? 'In Progress' : 
             task.status === 'review' ? 'In Review' : 
             'Completed'}
          </span>
        </div>
      </div>
    </div>
  );
}
