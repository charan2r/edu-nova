'use client'

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface Course {
  id: string
  name: string
  category: string
  instructor: string
  students: number
  duration: string
  status: 'active' | 'inactive' | 'completed'
}

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Web Development Fundamentals',
    category: 'Technology',
    instructor: 'Jane Smith',
    students: 45,
    duration: '8 weeks',
    status: 'active',
  },
  {
    id: '2',
    name: 'Business Strategy 101',
    category: 'Business',
    instructor: 'Lisa Anderson',
    students: 32,
    duration: '12 weeks',
    status: 'active',
  },
  {
    id: '3',
    name: 'Organic Chemistry',
    category: 'Science',
    instructor: 'Sarah Williams',
    students: 28,
    duration: '16 weeks',
    status: 'active',
  },
  {
    id: '4',
    name: 'Digital Marketing',
    category: 'Business',
    instructor: 'Lisa Anderson',
    students: 52,
    duration: '6 weeks',
    status: 'active',
  },
  {
    id: '5',
    name: 'Python for Data Science',
    category: 'Technology',
    instructor: 'Jane Smith',
    students: 38,
    duration: '10 weeks',
    status: 'active',
  },
  {
    id: '6',
    name: 'Introduction to Art History',
    category: 'Arts',
    instructor: 'Sarah Williams',
    students: 22,
    duration: '8 weeks',
    status: 'completed',
  },
  {
    id: '7',
    name: 'Advanced Statistics',
    category: 'Science',
    instructor: 'Sarah Williams',
    students: 0,
    duration: '12 weeks',
    status: 'inactive',
  },
  {
    id: '8',
    name: 'Project Management Essentials',
    category: 'Business',
    instructor: 'Lisa Anderson',
    students: 41,
    duration: '8 weeks',
    status: 'active',
  },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Course Name',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'instructor',
      label: 'Instructor',
    },
    {
      key: 'students',
      label: 'Students',
    },
    {
      key: 'duration',
      label: 'Duration',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(value)}`}>
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
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage all educational courses</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          <span>Add Course</span>
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={courses.map((course) => ({
          ...course,
          actions: null,
        }))}
        searchPlaceholder="Search courses..."
        rowsPerPage={10}
      />
    </div>
  )
}
