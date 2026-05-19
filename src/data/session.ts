const selectedWorkspaceKey = 'hemo.selectedWorkspace';

export function saveSelectedWorkspace(workspace: string): void {
  window.sessionStorage.setItem(selectedWorkspaceKey, workspace);
}

export function getSelectedWorkspace(): string | null {
  return window.sessionStorage.getItem(selectedWorkspaceKey);
}

export function clearSelectedWorkspace(): void {
  window.sessionStorage.removeItem(selectedWorkspaceKey);
}
