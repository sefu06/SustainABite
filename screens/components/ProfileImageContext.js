import React, { createContext, useContext, useState } from "react";

const ProfileImageContext = createContext();

export function ProfileImageProvider({ children }) {
    const [profileImage, setProfileImage] = useState(null);

    return (
        <ProfileImageContext.Provider value={{ profileImage, setProfileImage }}>
            {children}
        </ProfileImageContext.Provider>
    );
}

export function useProfileImage() {
    return useContext(ProfileImageContext);
}
