'use client'
import { Button } from '@/components/ui/button';

import UserDashboard from '@/components/user/dashborad'
import { LogOut } from 'lucide-react';
import React from 'react'

export default function User() {
  return (
    <div>
      <UserDashboard />
    </div>
  );
}
