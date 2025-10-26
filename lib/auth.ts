// User roles and permissions system
export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Sponsor Admin'
  | 'Supplier Admin'
  | 'Partner Admin'
  | 'Freelancer Admin'
  | 'User Admin'

export type UserSubRole = 'NewStar' | 'CriticStar' | 'CriticMaster'

export interface User {
  uid: string
  email: string
  displayName: string
  gender: string
  dob: string
  role: UserRole
  subRole: UserSubRole
  createdAt: Date
  updatedAt?: Date
}

// Role hierarchy and permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'Super Admin': 7,
  'Admin': 6,
  'Sponsor Admin': 5,
  'Supplier Admin': 5,
  'Partner Admin': 5,
  'Freelancer Admin': 5,
  'User Admin': 1,
}

// Default role assignment
export const DEFAULT_ROLE: UserRole = 'User Admin'
export const DEFAULT_SUB_ROLE: UserSubRole = 'NewStar'

// Permission checks
export const canManageUsers = (role: UserRole): boolean => {
  return ['Super Admin', 'Admin'].includes(role)
}

export const canManageRoles = (role: UserRole): boolean => {
  return role === 'Super Admin' || role === 'Admin'
}

export const canAssignSuperAdmin = (role: UserRole): boolean => {
  return role === 'Super Admin'
}

export const canAccessAdminPanel = (role: UserRole): boolean => {
  return canManageUsers(role) || ['Sponsor Admin', 'Supplier Admin', 'Partner Admin', 'Freelancer Admin'].includes(role)
}

// Route access permissions
export const getAccessibleRoutes = (role: UserRole, subRole: UserSubRole): string[] => {
  const routes: string[] = []

  // All users can access their own dashboard
  routes.push(`/dashboard/user`)

  // Subrole-specific routes
  if (subRole === 'NewStar') {
    routes.push('/dashboard/user/newstar')
  } else if (subRole === 'CriticStar') {
    routes.push('/dashboard/user/criticstar')
  } else if (subRole === 'CriticMaster') {
    routes.push('/dashboard/user/criticmaster')
  }

  // Role-specific routes
  switch (role) {
    case 'Super Admin':
      routes.push('/dashboard/super-admin')
      break
    case 'Admin':
      routes.push('/dashboard/admin')
      break
    case 'Sponsor Admin':
      routes.push('/dashboard/sponsor')
      break
    case 'Supplier Admin':
      routes.push('/dashboard/supplier')
      break
    case 'Partner Admin':
      routes.push('/dashboard/partner')
      break
    case 'Freelancer Admin':
      routes.push('/dashboard/freelancer')
      break
    case 'User Admin':
      // User Admin only has access to user dashboard
      break
  }

  return routes
}
