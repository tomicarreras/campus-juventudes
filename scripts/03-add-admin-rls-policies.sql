-- Add RLS Policies for Admin Access
-- This script allows admins to view all records while maintaining teacher isolation

-- Admin can view all teachers
CREATE POLICY "Admins can view all teachers" ON teachers 
FOR SELECT 
USING (
  auth.uid() IN (SELECT id FROM teachers WHERE role = 'admin')
);

-- Admin can view all groups
CREATE POLICY "Admins can view all groups" ON groups 
FOR SELECT 
USING (
  auth.uid() IN (SELECT id FROM teachers WHERE role = 'admin')
);

-- Admin can view all students
CREATE POLICY "Admins can view all students" ON students 
FOR SELECT 
USING (
  auth.uid() IN (SELECT id FROM teachers WHERE role = 'admin')
);

-- Admin can view all attendance records
CREATE POLICY "Admins can view all attendance" ON attendance 
FOR SELECT 
USING (
  auth.uid() IN (SELECT id FROM teachers WHERE role = 'admin')
);

-- esto no usar 