import { createContext } from 'react';

export type GlobalUserName = {
    userName: string
    setUserName:(c: string) => void
  }

const UsernameContext = createContext<GlobalUserName>({
    userName: 'You',
    setUserName: ()=>{}
});

export default UsernameContext