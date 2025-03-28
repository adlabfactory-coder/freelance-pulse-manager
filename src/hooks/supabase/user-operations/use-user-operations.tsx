
import { useCallback } from 'react';
import { useFetchUsers } from './use-user-fetch';
import { useCreateUser } from './use-user-create';
import { useUpdateUser } from './use-user-update';
import { useDeleteUser } from './use-user-delete';

export const useUserOperations = () => {
  const { isLoading: isFetchLoading, fetchUsers, fetchUserById, getMockUsers } = useFetchUsers();
  const { isLoading: isCreateLoading, createUser } = useCreateUser();
  const { isLoading: isUpdateLoading, updateUser, updateUserProfile } = useUpdateUser();
  const { isLoading: isDeleteLoading, deleteUser } = useDeleteUser();
  
  const isLoading = isFetchLoading || isCreateLoading || isUpdateLoading || isDeleteLoading;

  return {
    isLoading,
    fetchUsers,
    fetchUserById,
    updateUser,
    createUser,
    getMockUsers,
    updateUserProfile,
    deleteUser
  };
};
