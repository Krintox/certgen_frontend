import React, { createContext, useContext, useState } from 'react';
const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projectId, setProjectId] = useState(null);
  const [userId, setUserId] = useState(null);

  const contextValue = {
    projectId,
    setProjectId,
    userId,
    setUserId
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};