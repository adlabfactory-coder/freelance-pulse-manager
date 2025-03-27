
import React from 'react';
import UserForm from '@/components/settings/UserForm';
import { User } from '@/types';

interface AddUserFormProps {
  onSuccess: (newUser: User) => void;
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onCancel }) => {
  return <UserForm onSuccess={onSuccess} onCancel={onCancel} />;
};

export default AddUserForm;
