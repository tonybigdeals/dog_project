import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await register(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || '注册失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-[430px] mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#1b120e] dark:text-[#fcf9f8] p-6">
            <header className="py-12 text-center">
                <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 -rotate-6">
                    <span className="material-symbols-outlined text-4xl text-primary rotate-6">person_add</span>
                </div>
                <h1 className="text-3xl font-bold">创建账号</h1>
                <p className="text-warm-beige mt-2">加入 PawMate 大家庭</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">{error}</p>}

                <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 opacity-70">邮箱 / 账号</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 px-4 rounded-xl border border-[#e7d7d0] dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        placeholder="无需校验格式"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 opacity-70">设置密码</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 px-4 rounded-xl border border-[#e7d7d0] dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        placeholder="请输入密码"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary text-white font-bold rounded-xl mt-6 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                >
                    {isSubmitting ? '正在注册...' : '立即注册'}
                </button>
            </form>

            <p className="text-center mt-8 text-sm">
                已有账号？
                <Link to="/login" className="text-primary font-bold ml-1">直接登录</Link>
            </p>
        </div>
    );
};

export default Register;
