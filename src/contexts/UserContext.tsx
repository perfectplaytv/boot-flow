import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define o tipo para os dados do usuário e o contexto
interface UserContextType {
  userName: string;
  userEmail: string;
  avatar: string;
  setAvatar: (newAvatar: string) => void;
  // Adicione outros campos do perfil aqui se necessário
}

// URL do avatar padrão
const defaultAvatar = 'https://ui-avatars.com/api/?name=Admin&background=7e22ce&color=fff&size=128';

// Cria o contexto com um valor padrão
const UserContext = createContext<UserContextType>({
  userName: 'Admin',
  userEmail: 'admin@email.com',
  avatar: defaultAvatar,
  setAvatar: () => { }, // função vazia como padrão
});

// Hook customizado para facilitar o uso do contexto
export const useUser = () => useContext(UserContext);

// Componente Provedor que vai englobar a aplicação
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [avatar, setAvatar] = useState<string>(defaultAvatar);

  // Em um aplicativo real, estes dados viriam de uma API após o login
  const [userName, setUserName] = useState('Admin');
  const [userEmail, setUserEmail] = useState('admin@email.com');

  const value = {
    userName,
    userEmail,
    avatar,
    setAvatar,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 