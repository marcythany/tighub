export const API_URL = import.meta.env.VITE_API_URL;

export const handleLoginWithGithub = () => {
  window.open(`/api/auth/github`, '_self');
};
