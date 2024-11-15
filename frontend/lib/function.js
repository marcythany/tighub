export const handleLoginWithGithub = () => {
  window.open(`${import.meta.env.VITE_API_URL}/api/auth/github`, '_self');
};
