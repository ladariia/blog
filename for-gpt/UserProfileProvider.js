import React, { useState, useEffect, createContext, useContext } from "react";
import { useSession } from "next-auth/client";
import { apiCall } from "lib/api/vms";

const UserStateContext = createContext();
const UserDispatchContext = createContext();

function UserProfileProvider({ children }) {
    const [session, loading] = useSession();
    const [userState, setUserState] = useState(null);

    useEffect(() => {
        if (session && !userState) {
            const {
                user: { uk },
            } = session;

            apiCall(
                {
                    rootService: "portal",
                    service: "UserProfileWS",
                    // method: "getCurrentObjectByEmail",
                    method: "getCurrentObjectByUK",
                },
                uk
            )
                .then((res) => {
                    setUserState(res);
                })
                .catch((err) => {
                    setUserState(session.user);
                });
        }
    }, [session, userState]);

    if (loading) {
        return null;
    }

    return (
        <UserStateContext.Provider value={userState}>
            <UserDispatchContext.Provider value={setUserState}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
}

function useProfile() {
    const context = useContext(UserStateContext);
    if (context === undefined) {
        throw new Error("useProfile must be used within a UserProfileProvider");
    }
    return context;
}

function useProfileDispatch() {
    const context = useContext(UserDispatchContext);
    if (context === undefined) {
        throw new Error("useProfileDispatch must be used within a UserProfileProvider");
    }
    return context;
}

export { UserProfileProvider, useProfile, useProfileDispatch };
