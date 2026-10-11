import React, { useEffect } from 'react';
import { useUser } from '@clerk/react';
import { useAuth } from '../../context/AuthContext';

/**
 * ClerkSessionBridge synchronizes Clerk authentication sessions into Algorise's
 * AuthContext so that signed-in Clerk users seamlessly inherit platform privileges,
 * problem solver access, and progress persistence.
 *
 * NOTE: This component is only mounted when Clerk is configured and active.
 */
export const ClerkSessionBridge: React.FC = () => {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { user, loginWithClerk, logout } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && clerkUser) {
      if (!user || user.id !== clerkUser.id) {
        loginWithClerk({
          id: clerkUser.id,
          name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || 'User',
          username: clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 'user',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          avatar: clerkUser.imageUrl
        });
      }
    } else if (!isSignedIn && user?.authProvider === 'clerk') {
      logout();
    }
  }, [isLoaded, isSignedIn, clerkUser, user, loginWithClerk, logout]);

  return null;
};
