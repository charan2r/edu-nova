'use client'

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'instructor' | 'student'
  institute: string
  joined: string
  status: 'active' | 'inactive'
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    institute: 'Tech Institute',
    joined: '2023-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'instructor',
    institute: 'Tech Institute',
    joined: '2023-02-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'student',
    institute: 'Business Academy',
    joined: '2023-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'instructor',
    institute: 'Science Hub',
    joined: '2023-04-05',
    status: 'active',
  },
  {
    id: '5',
    name: 'Robert Brown',
    email: 'robert@example.com',
    role: 'student',
    institute: 'Arts Institute',
    joined: '2023-05-12',
    status: 'inactive',
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'admin',
    institute: 'Medical College',
    joined: '2023-06-01',
    status: 'active',
  },
  {
    id: '7',
    name: 'David Miller',
    email: 'david@example.com',
    role: 'student',
    institute: 'Tech Institute',
    joined: '2023-07-18',
    status: 'active',
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    role: 'instructor',
    institute: 'Business Academy',
    joined: '2023-08-22',
    status: 'active',
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'instructor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'student':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'institute',
      label: 'Institute',
    },
    {
      key: 'joined',
      label: 'Joined',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Edit2 size={16} className="text-muted-foreground" />
          </button>
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Trash2 size={16} className="text-destructive" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage system users and their roles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users.map((user) => ({
          ...user,
          actions: null,
        }))}
        searchPlaceholder="Search users..."
        rowsPerPage={10}
      />
    </div>
  )
}
