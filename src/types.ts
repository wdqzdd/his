export type Step = 'login' | 'workspace';
export type LoginMethod = 'account' | 'phone' | 'face';
export type Tone = 'blue' | 'green' | 'orange' | 'red';
export type MenuIcon = 'home' | 'data' | 'files' | 'lock' | 'office' | 'setting';

export interface UserWorkspace {
  label: string;
  role: string;
  department: string;
}

export interface StationMenu {
  index: string;
  title: string;
  icon: MenuIcon;
  children?: Array<{
    index: string;
    title: string;
  }>;
}

export interface PageContext {
  workspace: string;
  menuKey: string;
  menuTitle: string;
  role: string;
  department: string;
  identitySummary: string;
}
