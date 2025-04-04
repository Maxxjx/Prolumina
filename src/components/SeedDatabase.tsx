
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { seedTestData } from '@/utils/seedHelpers';

export default function SeedDatabase() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const executeSeeding = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if we already have data to avoid duplicates
      const { data: existingProjects } = await supabase.from('projects').select('*').limit(1);
      
      if (existingProjects && existingProjects.length > 0) {
        toast({
          title: "Database already contains data",
          description: "To avoid duplicates, please clear the database first before seeding",
          variant: "destructive",
        });
        setError("Database already contains data. Clear it first before seeding again.");
        return;
      }
      
      // Call our helper function to seed the data
      const result = await seedTestData();
      
      if (result.success) {
        setSuccess(true);
        toast({
          title: "Success!",
          description: result.message,
          variant: "default",
        });
        
        // After successful seeding, reload the page to refresh data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      console.error('Error seeding database:', err);
      setError(err.message || 'Failed to seed database. Check console for details.');
      toast({
        title: "Error",
        description: "Failed to seed the database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Seed Database</CardTitle>
        <CardDescription>
          Populate your database with sample Indian context data for testing and development
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>Database successfully seeded with sample data!</AlertDescription>
          </Alert>
        )}
        
        <div className="text-sm space-y-2">
          <p className="font-medium">This will create sample data including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Indian tech professionals as users with different roles</li>
            <li>Projects like "Mumbai Smart City Initiative" and "Bangalore Tech Park"</li>
            <li>Tasks with realistic Indian context and deadlines</li>
            <li>Project team assignments and task comments</li>
            <li>Activity logs with sample user actions</li>
          </ul>
          
          <p className="mt-4 text-amber-600 font-medium">
            Note: This seeding process will create both Auth users and database records in a single operation.
            All users will be created with the password "password123" for testing purposes.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 text-sm">
          <p className="font-medium mb-2">About the seeding process:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Creates Supabase Auth users with email/password authentication</li>
            <li>Inserts user profiles in the users table with matching UUIDs</li>
            <li>Creates projects, tasks, comments and other data</li>
            <li>Links everything together with proper relationships</li>
            <li>All test accounts use the password "password123"</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="secondary" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        <Button 
          onClick={executeSeeding}
          disabled={loading || success}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding Database...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Database Seeded
            </>
          ) : (
            "Seed Database"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
