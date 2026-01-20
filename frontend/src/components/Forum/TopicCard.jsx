import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../../data/mockForum';

const TopicCard = ({ topic }) => {
  const navigate = useNavigate();

  // 根据话题ID生成不同的高度比例，形成错落效果
  const aspectRatios = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[5/6]'];
  const aspectRatio = aspectRatios[topic.id % 3];

  return (
    <div
      onClick={() => navigate(`/forum/${topic.id}`)}
      className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 active:scale-[0.98]"
    >
      {/* 主图 - 不同比例形成瀑布流效果 */}
      {topic.images && topic.images.length > 0 ? (
        <div className={`relative bg-zinc-200 dark:bg-zinc-700 ${aspectRatio}`}>
          <img
            src={topic.images[0]}
            alt={topic.title}
            className="w-full h-full object-cover"
          />
          
          {/* 渐变遮罩 - 底部文字区域 */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none" />
          
          {/* 多图标识 */}
          {topic.images.length > 1 && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg flex items-center gap-1 z-10">
              <span className="material-symbols-outlined text-white text-sm">photo_library</span>
              <span className="text-white text-xs font-medium">{topic.images.length}</span>
            </div>
          )}
          
          {/* 分类标签 - 覆盖在图片上 */}
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-primary text-xs font-bold rounded-lg">
              {topic.category}
            </span>
          </div>

          {/* 底部信息覆盖在图片上 - 小红书风格 */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            {/* 标题 - 2-3行 */}
            <h3 className="text-sm font-bold text-white mb-2 line-clamp-3 leading-tight drop-shadow-lg">
              {topic.title}
            </h3>

            {/* 标签 */}
            {topic.tags && topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {topic.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md border border-white/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 内容预览 - 1-2行 */}
            <p className="text-xs text-white/90 mb-2 line-clamp-2 leading-relaxed drop-shadow">
              {topic.content}
            </p>

            {/* 用户信息和互动数据 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="size-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 overflow-hidden flex-shrink-0">
                  <img
                    src={topic.author.avatar}
                    alt={topic.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-white font-medium truncate drop-shadow">
                  {topic.author.name}
                </span>
              </div>
              
              {/* 互动数据 - 突出显示 */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className={`material-symbols-outlined text-sm ${topic.isLiked ? 'fill text-red-400' : 'text-white'}`}>
                    {topic.isLiked ? 'favorite' : 'favorite_border'}
                  </span>
                  <span className="text-xs text-white font-bold">{topic.likes}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm text-white">comment</span>
                  <span className="text-xs text-white font-bold">{topic.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative bg-gradient-to-br from-primary/20 to-warm-beige/20 ${aspectRatio}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-warm-beige opacity-50">image</span>
          </div>
          
          {/* 无图时的信息展示 */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-sm font-bold text-white mb-2 line-clamp-3 leading-tight">
              {topic.title}
            </h3>
            {topic.tags && topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {topic.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-white/90 mb-2 line-clamp-2">
              {topic.content}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-white/20 overflow-hidden">
                  <img
                    src={topic.author.avatar}
                    alt={topic.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-white font-medium">{topic.author.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className={`material-symbols-outlined text-sm ${topic.isLiked ? 'fill text-red-400' : 'text-white'}`}>
                    {topic.isLiked ? 'favorite' : 'favorite_border'}
                  </span>
                  <span className="text-xs text-white font-bold">{topic.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-white">comment</span>
                  <span className="text-xs text-white font-bold">{topic.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicCard;
