import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {App_Data, SOCIAL_USER, User, UserContextType} from '@/Types/User';
import axios from 'axios';

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserContextProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>();
  const [appData, setAppData] = useState<App_Data | undefined>();
  const [socailUser, setSocialUser] = useState<SOCIAL_USER | undefined>();

  return (
    <UserContext.Provider
      value={{user, setUser, appData, setAppData, socailUser, setSocialUser}}>
      {children}
    </UserContext.Provider>
  );
};
