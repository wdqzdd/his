<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowDown,
  Bell,
  Check,
  Close,
  DataLine,
  Files,
  FullScreen,
  House,
  Lock,
  Monitor,
  Notebook,
  OfficeBuilding,
  RefreshRight,
  Search,
  Setting,
} from '@element-plus/icons-vue';
import ImplementationPlanDrawer from '../components/ImplementationPlanDrawer.vue';
import { clearSelectedWorkspace, getSelectedWorkspace, saveSelectedWorkspace } from '../data/session';
import { identity, stationMenus, userWorkstations } from '../data/workstations';

const route = useRoute();
const router = useRouter();
const selectedWorkspace = ref(getSelectedWorkspace());
const implementationDrawerVisible = ref(false);
const topWorkstations = computed(() => {
  if (!selectedWorkspace.value) {
    return userWorkstations;
  }
  return userWorkstations.filter((item) => item.label === selectedWorkspace.value);
});

const activeWorkspace = computed(() => decodeURIComponent(String(route.params.workspace || '科室看板')));
const effectiveWorkspace = computed(() => topWorkstations.value[0]?.label ?? activeWorkspace.value);
const activeStationMenus = computed(() => stationMenus[activeWorkspace.value] ?? stationMenus[effectiveWorkspace.value] ?? stationMenus.科室看板);
const activeMenu = computed(() => String(route.params.menu || activeStationMenus.value[0].index));
const activeWorkspaceInfo = computed(
  () => userWorkstations.find((item) => item.label === activeWorkspace.value) ?? topWorkstations.value[0] ?? userWorkstations[0],
);
const activeMenuTitle = computed(() => activeStationMenus.value.find((item) => item.index === activeMenu.value)?.title ?? activeStationMenus.value[0].title);
const activeTabKey = computed(() => `${activeWorkspace.value}:${activeMenu.value}`);
const identitySummary = computed(() =>
  [identity.hospital, identity.campus, identity.department, identity.domain, identity.specialty, activeWorkspace.value].join(' / '),
);
const pageContext = computed(() => ({
  workspace: activeWorkspace.value,
  menuKey: activeMenu.value,
  menuTitle: activeMenuTitle.value,
  role: activeWorkspaceInfo.value.role,
  department: activeWorkspaceInfo.value.department,
  identitySummary: identitySummary.value,
}));
const openTabs = ref<Array<{ key: string; title: string; path: string; workspace: string }>>([]);
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  key: '',
});

watch(
  [activeWorkspace, activeMenuTitle, activeMenu],
  () => {
    if (selectedWorkspace.value && activeWorkspace.value !== selectedWorkspace.value) {
      const firstMenu = stationMenus[selectedWorkspace.value]?.[0]?.index ?? 'board-home';
      router.replace(`/workspace/${encodeURIComponent(selectedWorkspace.value)}/${firstMenu}`);
      return;
    }

    const key = activeTabKey.value;
    const path = route.fullPath;
    if (!openTabs.value.some((item) => item.key === key)) {
      openTabs.value.push({
        key,
        title: activeMenuTitle.value,
        path,
        workspace: activeWorkspace.value,
      });
    }
  },
  { immediate: true },
);

function switchWorkspace(workspace: string): void {
  selectedWorkspace.value = workspace;
  saveSelectedWorkspace(workspace);
  openTabs.value = [];
  const firstMenu = stationMenus[workspace]?.[0]?.index ?? 'board-home';
  router.push(`/workspace/${encodeURIComponent(workspace)}/${firstMenu}`);
}

function openMenu(menu: string): void {
  router.push(`/workspace/${encodeURIComponent(activeWorkspace.value)}/${menu}`);
}

function activateTab(key: string): void {
  const tab = openTabs.value.find((item) => item.key === key);
  if (tab) {
    router.push(tab.path);
  }
}

function closeTab(key: string): void {
  const closingIndex = openTabs.value.findIndex((item) => item.key === key);
  if (closingIndex < 0) {
    return;
  }

  const closingCurrent = openTabs.value[closingIndex].key === activeTabKey.value;
  openTabs.value.splice(closingIndex, 1);

  if (openTabs.value.length === 0) {
    const firstMenu = activeStationMenus.value[0]?.index ?? 'board-home';
    router.push(`/workspace/${encodeURIComponent(activeWorkspace.value)}/${firstMenu}`);
    return;
  }

  if (closingCurrent) {
    const nextTab = openTabs.value[Math.max(0, closingIndex - 1)];
    router.push(nextTab.path);
  }
}

function refreshTab(key: string): void {
  const tab = openTabs.value.find((item) => item.key === key);
  if (tab) {
    router.replace(tab.path);
  }
}

function closeOtherTabs(key: string): void {
  const tab = openTabs.value.find((item) => item.key === key);
  if (!tab) {
    return;
  }
  openTabs.value = [tab];
  router.push(tab.path);
}

function closeAllTabs(): void {
  const currentKey = activeTabKey.value;
  const currentTab = openTabs.value.find((item) => item.key === currentKey) ?? openTabs.value[0];
  if (currentTab) {
    openTabs.value = [currentTab];
    router.push(currentTab.path);
  }
}

function openContextMenu(event: MouseEvent, key: string): void {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    key,
  };
}

function handleContextCommand(command: string): void {
  const key = contextMenu.value.key;
  contextMenu.value.visible = false;
  if (command === 'refresh') refreshTab(key);
  if (command === 'close') closeTab(key);
  if (command === 'closeOther') closeOtherTabs(key);
  if (command === 'closeAll') closeAllTabs();
}

function handleUserCommand(command: string): void {
  if (command === 'logout') {
    clearSelectedWorkspace();
    router.push('/login');
  }
}

function closeContextMenu(): void {
  contextMenu.value.visible = false;
}
</script>

<template>
  <el-container class="admin-layout" @click="closeContextMenu">
    <el-aside width="220px" class="admin-aside">
      <div class="admin-logo">
        <span class="admin-logo-mark" aria-hidden="true"></span>
        <strong>血透管理平台</strong>
      </div>
      <el-menu :key="activeWorkspace" :default-active="activeMenu" class="side-menu" @select="openMenu(String($event))">
        <el-menu-item v-for="menu in activeStationMenus" :key="menu.index" :index="menu.index">
          <el-icon>
            <House v-if="menu.icon === 'home'" />
            <DataLine v-else-if="menu.icon === 'data'" />
            <Files v-else-if="menu.icon === 'files'" />
            <Lock v-else-if="menu.icon === 'lock'" />
            <OfficeBuilding v-else-if="menu.icon === 'office'" />
            <Setting v-else />
          </el-icon>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="admin-content">
      <section class="layout-navbars-container">
        <el-header class="admin-header" height="50px">
          <div class="top-menu-wrap">
            <el-menu :default-active="activeWorkspace" mode="horizontal" class="top-menu" @select="switchWorkspace(String($event))">
              <el-menu-item v-for="workspace in topWorkstations" :key="workspace.label" :index="workspace.label">
                <el-icon><Monitor /></el-icon>
                {{ workspace.label }}
              </el-menu-item>
            </el-menu>
          </div>
          <div class="header-actions">
            <el-divider direction="vertical" />
            <el-dropdown class="workspace-identity-dropdown" trigger="click" @command="switchWorkspace">
              <button type="button" class="workspace-identity-trigger">
                <span class="workspace-identity-icon">
                  <el-icon><Monitor /></el-icon>
                </span>
                <span class="workspace-identity-main">
                  <small>我的工作站</small>
                  <strong>{{ activeWorkspace }}</strong>
                </span>
                <span class="workspace-identity-meta">{{ activeWorkspaceInfo.role }}</span>
                <el-icon class="workspace-identity-arrow"><ArrowDown /></el-icon>
              </button>
              <template #dropdown>
                <el-dropdown-menu class="workspace-identity-menu">
                  <el-dropdown-item
                    v-for="workspace in userWorkstations"
                    :key="workspace.label"
                    :command="workspace.label"
                    :class="{ active: workspace.label === activeWorkspace }"
                  >
                    <div class="workspace-option-card">
                      <span class="workspace-option-icon">
                        <el-icon><Monitor /></el-icon>
                      </span>
                      <span class="workspace-option-text">
                        <strong>{{ workspace.label }}</strong>
                        <small>{{ workspace.role }} / {{ workspace.department }}</small>
                      </span>
                      <el-icon v-if="workspace.label === activeWorkspace" class="workspace-option-check">
                        <Check />
                      </el-icon>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button class="implementation-plan-button" :icon="Notebook" plain @click="implementationDrawerVisible = true">
              血透落地方案
            </el-button>
            <el-dropdown trigger="click" @command="handleUserCommand">
              <button type="button" class="user-dropdown">
                <el-avatar :size="28">医</el-avatar>
                <span>医生</span>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <div class="tab-strip">
          <div
            v-for="tab in openTabs"
            :key="tab.key"
            class="tags-view-item"
            :class="{ 'is-active': tab.key === activeTabKey }"
            @click="activateTab(tab.key)"
            @contextmenu.prevent="openContextMenu($event, tab.key)"
          >
            <span v-if="tab.key === activeTabKey" class="active-dot"></span>
            {{ tab.workspace }} / {{ tab.title }}
            <el-icon v-if="tab.key === activeTabKey" class="tag-refresh" @click.stop="refreshTab(tab.key)">
              <RefreshRight />
            </el-icon>
            <el-icon v-if="openTabs.length > 1" class="tag-close" @click.stop="closeTab(tab.key)">
              <Close />
            </el-icon>
          </div>
          <div
            v-show="contextMenu.visible"
            class="tags-contextmenu"
            :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y + 5}px` }"
          >
            <button type="button" @click="handleContextCommand('refresh')">刷新</button>
            <button type="button" @click="handleContextCommand('close')">关闭</button>
            <button type="button" @click="handleContextCommand('closeOther')">关闭其它</button>
            <button type="button" @click="handleContextCommand('closeAll')">全部关闭</button>
            <button type="button" @click="contextMenu.visible = false">关闭全屏</button>
          </div>
        </div>
      </section>

      <el-main class="admin-main">
        <router-view :context="pageContext" />
      </el-main>
    </el-container>

    <ImplementationPlanDrawer v-model="implementationDrawerVisible" :context="pageContext" />
  </el-container>
</template>
