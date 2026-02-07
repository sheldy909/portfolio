# Portfolio Next.js with Supabase

Next.js 13 App Router проект для портфолио с базовой админкой и Supabase.

## Структура проекта

```
portfolio/
├── app/                          # Next.js App Router
│   ├── portfolio/page.tsx        # страница Портфолио
│   ├── archive/page.tsx          # страница Архив
│   ├── useful/page.tsx           # страница Полезное
│   ├── projects/[slug]/page.tsx  # страница отдельного проекта
│   ├── admin/page.tsx            # админка
│   ├── layout.tsx               # корневой layout
│   └── page.tsx                 # главная страница
├── src/
│   ├── lib/
│   │   └── supabaseClient.ts    # Supabase клиент
│   └── components/
│       ├── ProjectList.tsx      # компонент списка проектов
│       ├── ProjectForm.tsx       # форма добавления/редактирования проекта
│       └── ProjectImagesForm.tsx # форма для загрузки изображений
├── .env.local                   # переменные окружения
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd portfolio
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения в `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Запустите разработческий сервер:
```bash
npm run dev
```

## Настройка Supabase

1. Создайте проект в [Supabase](https://supabase.com)
2. Создайте таблицу `projects` со следующей структурой:
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('portfolio', 'archive', 'useful')),
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Создайте таблицу `project_images`:
```sql
CREATE TABLE project_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Создайте хранилище для изображений:
```sql
CREATE STORAGE "project-images";
```

5. Настройте RLS (Row Level Security) для таблиц:
```sql
-- Для таблицы projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

-- Для таблицы project_images
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public project images are viewable by everyone" ON project_images
  FOR SELECT USING (true);
```

## Функционал

### Фронтенд
- **Портфолио**: Отображает проекты из категории "portfolio"
- **Архив**: Отображает проекты из категории "archive"
- **Полезное**: Отображает проекты из категории "useful"
- **Страница проекта**: Детальная страница с описанием и изображениями
- **Админка**: Панель управления для CRUD операций с проектами

### Админка
- Добавление новых проектов
- Редактирование существующих проектов
- Изменение категории проектов
- Загрузка и управление изображениями
- Удаление проектов

## Использование

### Добавление проекта
1. Перейдите в админку: `/admin`
2. Нажмите "Add New Project"
3. Заполните форму: title, description, category, slug, image_url
4. Сохраните проект

### Управление изображениями
1. В админке нажмите "Images" для нужного проекта
2. Загрузите изображения с подписями
3. Настройте порядок отображения
4. Сохраните изменения

### Изменение категории
1. В админке выберите проект
2. Измените выпадающий список категории
3. Категория обновится автоматически

## Технологии

- Next.js 13 (App Router)
- React 18
- TypeScript
- Supabase (PostgreSQL + Storage)
- Tailwind CSS (базовые стили)

## Запуск в продакшене

1. Соберите проект:
```bash
npm run build
```

2. Запустите сервер:
```bash
npm start
```

## Лицензия

MIT