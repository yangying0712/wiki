import { z, defineCollection, reference } from 'astro:content';

// 角色集合 - 角色档案
const characters = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    alias: z.array(z.string()).optional(), // 别名/昵称
    color: z.string(), // 代表色 (hex)
    avatar: z.string().optional(), // 头像路径
    portrait: z.string().optional(), // 角色立绘路径
    role: z.enum(['protagonist', 'love_interest', 'supporting', 'antagonist']),
    description: z.string(),
    // 属性雷达图数据
    attributes: z.object({
      intelligence: z.number().min(0).max(100),
      strength: z.number().min(0).max(100),
      charm: z.number().min(0).max(100),
      loyalty: z.number().min(0).max(100),
      cunning: z.number().min(0).max(100),
      emotional: z.number().min(0).max(100),
    }).optional(),
    // 分面标签
    tags: z.array(z.string()).optional(),
    // 情感历程数据点 (章节号: 好感度)
    emotionTimeline: z.array(z.object({
      chapter: z.number(),
      value: z.number(),
      event: z.string().optional(),
    })).optional(),
  }),
});

// 章节集合 - 时间轴锚点
const chapters = defineCollection({
  type: 'content',
  schema: z.object({
    number: z.number(),
    title: z.string(),
    arc: z.string().optional(), // 所属篇章
    summary: z.string(),
    keyEvents: z.array(z.string()).optional(),
    publishedAt: z.date().optional(),
    // 关联角色
    featuredCharacters: z.array(reference('characters')).optional(),
  }),
});

// 关系集合 - CP/组合记录 (核心)
const relationships = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(), // 组合名称
    members: z.array(reference('characters')), // 成员关联
    type: z.enum([
      'romantic',     // 恋人
      'rivals',       // 宿敌
      'frenemies',    // 亦敌亦友
      'siblings',     // 兄弟/姐妹
      'mentor',       // 师徒
      'complicated',  // 复杂
    ]),
    // 代表配色
    colors: z.object({
      primary: z.string(),   // 主色
      secondary: z.string(), // 辅色
    }).optional(),
    // 情感基调数值
    vibeScore: z.number().min(0).max(100), // 甜蜜指数
    angstScore: z.number().min(0).max(100), // 虐心指数
    // 关系性质 (用于关系图连线颜色)
    nature: z.enum(['pure', 'twisted', 'utilize', 'mutual']),
    // 当前股价状态
    stockStatus: z.object({
      current: z.number(),
      trend: z.enum(['up', 'down', 'stable']),
      history: z.array(z.object({
        chapter: z.number(),
        value: z.number(),
      })).optional(),
    }),
    // 关键剧情节点
    keyMoments: z.array(z.object({
      chapter: reference('chapters'),
      description: z.string(),
      impact: z.enum(['positive', 'negative', 'neutral']),
    })).optional(),
    // 重要元素/道具/信物
    keepsakes: z.array(z.object({
      name: z.string(),
      description: z.string(),
      image: z.string().optional(),
    })).optional(),
    // 关系相关剧情配图
    storyImages: z.array(z.object({
      src: z.string(),
      caption: z.string(),
      chapter: z.number().optional(),
    })).optional(),
    // 标签
    tags: z.array(z.string()).optional(),
  }),
});

// 伏笔集合 - 侦探墙模式 (核心)
const clues = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['planted', 'recovered', 'abandoned']), // 未回收/已回收/弃用
    // 埋线章节
    plantedIn: reference('chapters'),
    // 回收章节 (可选)
    recoveredIn: reference('chapters').optional(),
    // 重要性评级
    importance: z.enum(['minor', 'moderate', 'major', 'critical']),
    // 相关角色
    relatedCharacters: z.array(reference('characters')).optional(),
    // 相关关系
    relatedRelationships: z.array(reference('relationships')).optional(),
    // 预测/理论
    theories: z.array(z.string()).optional(),
  }),
});

// 附加内容集合 - 短篇/随笔
const extras = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // 扩展类型：原有类型 + 新增4种细分类型
    type: z.enum([
      'essay',           // 随笔
      'analysis',        // 分析
      'fanfic',          // 同人
      'meta',            // Meta
      'review',          // 书评
      'plot_analysis',   // 个人剧情/CP情感分析
      'korean_trans',    // 韩网翻译
      'brain_hole',      // 小段子脑洞记录
      'dark_zone',       // 鹿压抑专区（阴间泥塑嬷预警）
    ]),
    description: z.string(),
    publishedAt: z.date(),
    // 主题角色 (用于动态主题色)
    featuredCharacter: reference('characters').optional(),
    // 标签
    tags: z.array(z.string()).optional(),
    // 是否剧透
    containsSpoilers: z.boolean().default(false),
    // 是否包含敏感内容（用于鹿压抑专区）
    sensitiveContent: z.boolean().default(false),
  }),
});

// 图片集合 - 本子翻译和模型截图
const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // 图集类型
    category: z.enum([
      'doujinshi',  // 本子翻译
      'model',      // 模型记录及截图集
    ]),
    // 子分类（用于本子翻译的具体漫画分类）
    subCategory: z.string().optional(),
    description: z.string(),
    // 封面图片
    coverImage: z.string(),
    // 图片列表
    images: z.array(z.object({
      src: z.string(),
      caption: z.string().optional(),
      page: z.number().optional(), // 用于本子翻译的页码
    })),
    // 发布日期
    publishedAt: z.date(),
    // 标签
    tags: z.array(z.string()).optional(),
    // 原作信息（用于本子翻译）
    originalWork: z.object({
      title: z.string(),
      author: z.string().optional(),
      source: z.string().optional(),
    }).optional(),
    // 是否NSFW
    isNSFW: z.boolean().default(false),
  }),
});

// 金句集合 - 名台词记录
const quotes = defineCollection({
  type: 'content',
  schema: z.object({
    quote: z.string(), // 金句内容
    speaker: reference('characters'), // 说话角色
    chapter: z.number().optional(), // 出自章节
    context: z.string().optional(), // 语境说明
    // 标签
    tags: z.array(z.string()).optional(),
    // 重要性
    importance: z.enum(['normal', 'memorable', 'iconic']).default('normal'),
    // 创建时间
    createdAt: z.date().optional(),
  }),
});

export const collections = {
  characters,
  chapters,
  relationships,
  clues,
  extras,
  quotes,
  gallery,
};
