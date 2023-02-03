import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export const Context = React.createContext();

export const useGlobal = () => useContext(Context);

export const Provider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    session &&
      axios
        .get("/api/messages", { params: { recipientId: session?.user?._id } })
        .then((response) => {
          setMessages(response.data);
          setIsLoading(false);
        });
  }, [session]);

  return (
    <Context.Provider
      value={{
        messages,
        setMessages,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};
