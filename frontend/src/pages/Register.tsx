import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

export function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (formData.username.length < 3) {
      errors.username = '用户名至少3个字符';
    }
    if (!formData.email.includes('@')) {
      errors.email = '请输入有效的邮箱';
    }
    if (formData.password.length < 6) {
      errors.password = '密码至少6个字符';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '两次密码输入不一致';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      const { user, tokens } = response.data.data;

      // Store tokens
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);

      // Set user
      setUser(user);

      // Redirect to post
      navigate('/post');
    } catch (err: any) {
      setError(
        err.response?.data?.error || '注册失败，请重试或联系管理员'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-beige bg-vintage-grain flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl font-serif font-bold text-rust mb-2">
            Daily Fit
          </div>
          <p className="text-navy/70 text-lg">加入我们的穿搭社区</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm rounded-lg shadow-vintage border-2 border-rust/20 p-8"
        >
          <h1 className="text-3xl font-serif font-bold text-rust mb-6">
            注册
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-navy mb-2"
            >
              用户名
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="你的用户名"
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none transition ${
                validationErrors.username
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-beige focus:border-rust'
              }`}
              required
            />
            {validationErrors.username && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-navy mb-2"
            >
              邮箱
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none transition ${
                validationErrors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-beige focus:border-rust'
              }`}
              required
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-navy mb-2"
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none transition ${
                validationErrors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-beige focus:border-rust'
              }`}
              required
            />
            {validationErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-navy mb-2"
            >
              确认密码
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none transition ${
                validationErrors.confirmPassword
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-beige focus:border-rust'
              }`}
              required
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rust text-cream font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 mb-4"
          >
            {loading ? '注册中...' : '✨ 开始你的穿搭之旅'}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-navy/70">
              已有账户？
              <Link to="/login" className="text-rust font-semibold hover:underline">
                立即登录
              </Link>
            </p>
          </div>
        </form>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-navy/50">
          <p>
            注册表示你同意我们的
            <a href="#" className="text-rust hover:underline">
              服务条款
            </a>
            和
            <a href="#" className="text-rust hover:underline">
              隐私政策
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
