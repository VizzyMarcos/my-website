const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const res = await axios.post('/api/auth/login', formData);
    localStorage.setItem('vicmart-user', JSON.stringify(res.data.user));
    router.push(redirect);
    router.refresh();
  } catch (err: any) {
    setError(err.response?.data?.error || 'Login failed');
  } finally {
    setLoading(false);
  }
};