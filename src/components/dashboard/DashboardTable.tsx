
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type Person = {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  date: string;
};

const people: Person[] = [
  {
    id: '1',
    name: 'Michael Johnson',
    email: 'tech.reviews.by.johnson.com',
    role: 'Manager',
    organization: 'Organization',
    date: '17/03/2024',
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'Programmer',
    organization: 'Developers',
    date: '24/04/2024',
  },
];

export function DashboardTable() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Data Table</h2>
      
      <div className="rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-dark-200">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="w-[40px] text-gray-400"></TableHead>
              <TableHead className="text-gray-400">AUTHOR</TableHead>
              <TableHead className="text-gray-400">FUNCTION</TableHead>
              <TableHead className="text-gray-400">DATE</TableHead>
              <TableHead className="text-right text-gray-400">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person) => (
              <TableRow key={person.id} className="border-white/5 hover:bg-dark-200/40">
                <TableCell className="w-[40px]">
                  <div className="w-8 h-8 rounded-full bg-pulse-600 flex items-center justify-center">
                    <span className="text-white text-xs">{person.name.charAt(0)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-white">{person.name}</div>
                    <div className="text-sm text-gray-400">{person.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-white">{person.role}</div>
                    <div className="text-sm text-gray-400">{person.organization}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-white">{person.date}</div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" className="h-8 px-2 text-pulse-500">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
