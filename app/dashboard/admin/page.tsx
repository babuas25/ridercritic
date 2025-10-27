'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  Crown,
  User as UserIcon
} from 'lucide-react'
import { canManageRoles, UserRole, UserSubRole } from '@/lib/auth'

interface User {
  uid: string
  email: string
  displayName: string
  role: UserRole
  subRole: UserSubRole
  createdAt: Date
  lastLogin?: Date
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Fetch real users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        // Convert date strings back to Date objects
        const usersWithDates = data.users.map((user: User & { createdAt: string | Date; lastLogin?: string | Date }) => ({
          ...user,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        }))
        setUsers(usersWithDates)
      } catch (error) {
        console.error('Error fetching users:', error)
        // Fallback to empty array on error
        setUsers([])
      }
    }

    fetchUsers()
  }, [])

  if (!session) {
    return null
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Super Admin': return <Crown className="w-4 h-4" />
      case 'Admin': return <Shield className="w-4 h-4" />
      default: return <UserIcon className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-800'
      case 'Admin': return 'bg-red-100 text-red-800'
      case 'Sponsor Admin': return 'bg-blue-100 text-blue-800'
      case 'Supplier Admin': return 'bg-green-100 text-green-800'
      case 'Partner Admin': return 'bg-yellow-100 text-yellow-800'
      case 'Freelancer Admin': return 'bg-indigo-100 text-indigo-800'
      case 'User Admin': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user })
    setIsEditUserOpen(true)
  }

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        // Update via API
        const response = await fetch('/api/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: editingUser.uid,
            displayName: editingUser.displayName,
            role: editingUser.role,
            subRole: editingUser.subRole,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update user')
        }

        // Update local state
        setUsers(users.map(user =>
          user.uid === editingUser.uid ? editingUser : user
        ))
        
        setIsEditUserOpen(false)
        setEditingUser(null)
      } catch (error) {
        console.error('Error updating user:', error)
        alert('Failed to update user. Please try again.')
      }
    }
  }

  const handleEditingNameChange = (name: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, displayName: name })
    }
  }

  const handleEditingRoleChange = (role: UserRole) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, role })
    }
  }

  const handleEditingSubRoleChange = (subRole: UserSubRole) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, subRole })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
          </div>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => canManageRoles(u.role)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                With management access
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.lastLogin && u.lastLogin > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Week</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Recent registrations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Sponsor Admin">Sponsor Admin</SelectItem>
                    <SelectItem value="Supplier Admin">Supplier Admin</SelectItem>
                    <SelectItem value="Partner Admin">Partner Admin</SelectItem>
                    <SelectItem value="Freelancer Admin">Freelancer Admin</SelectItem>
                    <SelectItem value="User Admin">User Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sub Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.displayName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.subRole}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and assign initial role.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User Admin">User Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Sponsor Admin">Sponsor Admin</SelectItem>
                    <SelectItem value="Supplier Admin">Supplier Admin</SelectItem>
                    <SelectItem value="Partner Admin">Partner Admin</SelectItem>
                    <SelectItem value="Freelancer Admin">Freelancer Admin</SelectItem>
                    {session.user.role === 'Super Admin' && (
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsAddUserOpen(false)}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input id="edit-email" value={editingUser.email} className="col-span-3" disabled />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input 
                    id="edit-name" 
                    value={editingUser.displayName} 
                    onChange={(e) => handleEditingNameChange(e.target.value)}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value) => handleEditingRoleChange(value as UserRole)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User Admin">User Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Sponsor Admin">Sponsor Admin</SelectItem>
                      <SelectItem value="Supplier Admin">Supplier Admin</SelectItem>
                      <SelectItem value="Partner Admin">Partner Admin</SelectItem>
                      <SelectItem value="Freelancer Admin">Freelancer Admin</SelectItem>
                      {session.user.role === 'Super Admin' && (
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-subrole" className="text-right">
                    Sub Role
                  </Label>
                  <Select
                    value={editingUser.subRole}
                    onValueChange={(value) => handleEditingSubRoleChange(value as UserSubRole)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NewStar">NewStar</SelectItem>
                      <SelectItem value="CriticStar">CriticStar</SelectItem>
                      <SelectItem value="CriticMaster">CriticMaster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateUser}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
