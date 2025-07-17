export const ALLOWED_CATEGORIES = ['Work', 'Personal', 'Random'];
export type CategoryType = typeof ALLOWED_CATEGORIES[number];
export const CATEGORY_COLORS: Record<CategoryType, string> = {
  Work: '#4A90E2',
  Personal: '#50E3C2',
  Random: '#F5A623',
};