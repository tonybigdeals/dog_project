import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [applicationsCount, setApplicationsCount] = useState(0);
    const [submissionsCount, setSubmissionsCount] = useState(0);
    const [applications, setApplications] = useState([]);
    const [showApplications, setShowApplications] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.id) {
                setLoading(false);
                return;
            }

            try {
                const [favoritesRes, applicationsRes, submissionsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/favorites/${user.id}`).catch(err => ({ ok: false, error: err })),
                    fetch(`${API_BASE_URL}/applications/${user.id}`).catch(err => ({ ok: false, error: err })),
                    fetch(`${API_BASE_URL}/dog-submissions`).catch(err => ({ ok: false, error: err }))
                ]);

                if (favoritesRes.ok) {
                    const favoritesData = await favoritesRes.json();
                    setFavoritesCount(Array.isArray(favoritesData) ? favoritesData.length : 0);
                } else {
                    console.error('Failed to fetch favorites:', favoritesRes.error);
                }

                if (applicationsRes.ok) {
                    const applicationsData = await applicationsRes.json();
                    const appsArray = Array.isArray(applicationsData) ? applicationsData : [];
                    setApplications(appsArray);
                    setApplicationsCount(appsArray.length);
                } else {
                    console.error('Failed to fetch applications:', applicationsRes.error);
                }

                if (submissionsRes.ok) {
                    const submissionsData = await submissionsRes.json();
                    const submissionsArray = Array.isArray(submissionsData) ? submissionsData : [];
                    // 只统计当前用户的提交
                    const userSubmissions = submissionsArray.filter(sub => sub.user_id === user.id);
                    setSubmissionsCount(userSubmissions.length);
                } else {
                    console.error('Failed to fetch submissions:', submissionsRes.error);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    // 计算待审核申请数量
    const pendingCount = applications.filter(app => app.status === 'pending').length;

    // 状态徽章样式函数
    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        };
        const labels = {
            pending: '待审核',
            approved: '已通过',
            rejected: '已拒绝'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
                {labels[status] || '未知'}
            </span>
        );
    };

    // 格式化日期
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    return (
        <div className="mx-auto max-w-[430px] min-h-screen bg-background-light dark:bg-background-dark text-[#1b120e] dark:text-white font-sans relative pb-32">
            <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <div className="text-primary flex size-12 shrink-0 items-center justify-start">
                        <span className="material-symbols-outlined text-[28px]">settings</span>
                    </div>
                    <h2 className="text-[#1b120e] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">个人中心</h2>
                    <div className="flex w-12 items-center justify-end">
                        <button className="relative flex items-center justify-center rounded-xl h-12 w-12 bg-transparent text-[#1b120e] dark:text-white">
                            <span className="material-symbols-outlined text-[28px]">notifications</span>
                            <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex p-6">
                <div className="flex w-full flex-col gap-4 items-center">
                    <div className="flex gap-4 flex-col items-center">
                        <div className="relative">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-white dark:border-zinc-800 shadow-lg"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnyCbPkHaqVhl20l_uOiYaedgNE7IHr2N40Rx4bfwA7cyy-yB9wSbAx4LQnecLiv9KhP0owjiC5laFu_oQ3yLKDPqI5E7xrskwWdjBAH2m9zv-FsxrvgmgJW9QlP_DfRXOp4G2ZLGFZQLZEimczVneStODNogQF2R3ThkGopvRaEQ_Sv7srEP00BLiS2D-7m2U9y7wzeDUG3IQInvB5W67lN03goakvkeqbyjCjxHPZg8t1moUoAV3o6Kir27BEr11h9j_am2cJOw")' }}
                            />
                            <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1.5 border-2 border-white dark:border-zinc-800">
                                <span className="material-symbols-outlined text-[16px] block">edit</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[#1b120e] dark:text-white text-[24px] font-bold leading-tight tracking-tight text-center">{user?.email?.split('@')[0] || '小王'} (PawMate 领养人)</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                                <p className="text-warm-beige text-sm font-medium leading-normal text-center">加入 PawMate 第 125 天</p>
                            </div>
                            <p className="text-warm-beige text-sm font-normal leading-normal text-center mt-2 italic">“愿每一只狗狗都有温暖的家”</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-2">
                <div className="flex gap-3 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-[#f3ebe7] dark:border-zinc-700">
                    <div 
                        onClick={() => navigate('/favorites')}
                        className="flex flex-1 flex-col gap-1 items-center text-center cursor-pointer active:scale-95 transition-transform"
                    >
                        <p className="text-primary tracking-tight text-2xl font-bold">
                            {loading ? '...' : favoritesCount}
                        </p>
                        <p className="text-warm-beige text-xs font-bold tracking-wider">我的收藏</p>
                    </div>
                    <div className="w-[1px] bg-[#e7d7d0] dark:bg-zinc-700 my-2" />
                    <div 
                        onClick={() => setShowApplications(true)}
                        className="flex flex-1 flex-col gap-1 items-center text-center cursor-pointer active:scale-95 transition-transform"
                    >
                        <p className="text-[#1b120e] dark:text-white tracking-tight text-2xl font-bold">
                            {loading ? '...' : applicationsCount}
                        </p>
                        <p className="text-warm-beige text-xs font-bold tracking-wider">已领养</p>
                    </div>
                    <div className="w-[1px] bg-[#e7d7d0] dark:bg-zinc-700 my-2" />
                    <div 
                        onClick={() => navigate('/admin-submissions')}
                        className="flex flex-1 flex-col gap-1 items-center text-center cursor-pointer active:scale-95 transition-transform"
                    >
                        <p className="text-[#1b120e] dark:text-white tracking-tight text-2xl font-bold">
                            {loading ? '...' : submissionsCount}
                        </p>
                        <p className="text-warm-beige text-xs font-bold tracking-wider">已发布</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 px-4 space-y-4">
                <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm border border-[#f3ebe7] dark:border-zinc-700">
                    <h3 className="text-[#1b120e] dark:text-white text-xs font-bold leading-tight tracking-wider px-4 pt-5 pb-2 opacity-50">领养管理</h3>
                    {[
                        { 
                            icon: 'pending_actions', 
                            label: '领养进度', 
                            sub: pendingCount > 0 ? `${pendingCount} 个新提醒` : null, 
                            highlight: true,
                            action: () => setShowApplications(true)
                        },
                        { 
                            icon: 'forum', 
                            label: '交流论坛',
                            action: () => navigate('/forum')
                        },
                    ].map((item, i, arr) => (
                        <React.Fragment key={i}>
                            <div 
                                onClick={item.action}
                                className="flex items-center gap-4 px-4 min-h-[64px] justify-between cursor-pointer active:bg-primary/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${item.highlight ? 'bg-primary/10 text-primary' : 'bg-surface-light dark:bg-zinc-700 text-[#1b120e] dark:text-white'}`}>
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[#1b120e] dark:text-white text-base font-semibold leading-normal">{item.label}</p>
                                        {item.sub && <p className="text-primary text-[11px] font-bold">{item.sub}</p>}
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-warm-beige">chevron_right</span>
                            </div>
                            {i < arr.length - 1 && <div className="h-[1px] bg-background-light dark:bg-background-dark mx-4" />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm border border-[#f3ebe7] dark:border-zinc-700">
                    <h3 className="text-[#1b120e] dark:text-white text-xs font-bold leading-tight tracking-wider px-4 pt-5 pb-2 opacity-50">互动与支持</h3>
                    {[
                        { icon: 'assignment', label: '领养管理系统', action: () => navigate('/admin'), highlight: true },
                        { icon: 'publish', label: '发布管理系统', action: () => navigate('/admin-submissions'), highlight: true },
                        { icon: 'pets', label: '发布小狗', action: () => navigate('/submit-dog') },
                        { icon: 'chat_bubble', label: '消息历史' },
                        { icon: 'help_center', label: '帮助中心' },
                        { icon: 'shield', label: '隐私与协议' },
                        { icon: 'settings', label: '设置' },
                    ].map((item, i, arr) => (
                        <React.Fragment key={i}>
                            <div
                                onClick={item.action}
                                className="flex items-center gap-4 px-4 min-h-[64px] justify-between cursor-pointer active:bg-primary/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center justify-center rounded-lg shrink-0 size-10 ${item.highlight ? 'bg-primary/10 text-primary' : 'bg-surface-light dark:bg-zinc-700 text-[#1b120e] dark:text-white'}`}>
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <p className="text-[#1b120e] dark:text-white text-base font-semibold leading-normal">{item.label}</p>
                                </div>
                                <span className="material-symbols-outlined text-warm-beige">chevron_right</span>
                            </div>
                            {i < arr.length - 1 && <div className="h-[1px] bg-background-light dark:bg-background-dark mx-4" />}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 text-[#e54b4b] font-bold py-4 rounded-xl shadow-sm border border-[#f3ebe7] dark:border-zinc-700 active:scale-[0.98] transition-transform"
                >
                    <span className="material-symbols-outlined">logout</span>
                    退出登录
                </button>
            </div>

            <div className="fixed top-0 right-0 -z-10 opacity-[0.03] pointer-events-none rotate-12">
                <span className="material-symbols-outlined text-[300px] text-primary">pets</span>
            </div>

            {/* 领养进度弹窗 */}
            {showApplications && (
                <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark">
                    <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                        <div className="flex items-center p-4 pb-2 justify-between">
                            <button
                                onClick={() => setShowApplications(false)}
                                className="flex size-12 shrink-0 items-center justify-start text-[#1b120e] dark:text-white"
                            >
                                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
                            </button>
                            <h2 className="text-[#1b120e] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">领养进度</h2>
                            <div className="w-12" />
                        </div>
                    </div>

                    <div className="px-4 py-4 max-h-[calc(100vh-80px)] overflow-y-auto pb-24">
                        {applications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                <span className="material-symbols-outlined text-6xl mb-4">inbox</span>
                                <p className="text-lg font-medium">暂无申请记录</p>
                                <button
                                    onClick={() => {
                                        setShowApplications(false);
                                        navigate('/');
                                    }}
                                    className="mt-4 text-primary font-bold"
                                >
                                    去申请领养
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div
                                        key={app.id}
                                        onClick={() => {
                                            setShowApplications(false);
                                            navigate(`/application/${app.id}`);
                                        }}
                                        className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-[#f3ebe7] dark:border-zinc-700 cursor-pointer active:scale-[0.98] transition-transform"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-[#1b120e] dark:text-white mb-1">
                                                    {app.dogs?.name || '未知小狗'}
                                                </h3>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {formatDate(app.created_at)}
                                                </p>
                                            </div>
                                            {getStatusBadge(app.status)}
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-500 dark:text-zinc-400 min-w-[80px]">申请人：</span>
                                                <span className="text-[#1b120e] dark:text-white font-medium">{app.full_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-500 dark:text-zinc-400 min-w-[80px]">联系电话：</span>
                                                <span className="text-[#1b120e] dark:text-white">{app.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-500 dark:text-zinc-400 min-w-[80px]">居住地址：</span>
                                                <span className="text-[#1b120e] dark:text-white">{app.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-500 dark:text-zinc-400 min-w-[80px]">住房类型：</span>
                                                <span className="text-[#1b120e] dark:text-white">{app.housing_type}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-500 dark:text-zinc-400 min-w-[80px]">已有宠物：</span>
                                                <span className="text-[#1b120e] dark:text-white">{app.has_pets ? '是' : '否'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export default Profile;
