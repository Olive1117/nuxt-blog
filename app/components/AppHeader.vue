<template>
  <div class="AppHeader flex items-center justify-between p-4 ">
    <div class="flex items-center">
      <NuxtImg src="/小小波奇_透明.png" alt="头像" class="h-10 w-10 object-cover rounded-full scale-150" />
      <span class="ml-2 text-xl font-bold">olive的博客</span>
    </div>
    <NavigationMenu.Root class="relative text-nowrap" disableHoverTrigger disablePointerLeaveClose
      v-model="currentNavValue">
      <NavigationMenu.List class="flex justify-between items-center">
        <NavigationMenu.Item class="flex items-center" v-for="nav in NavLinks" :key="nav.name" :value="nav.name">
          <NavigationMenu.Trigger class="p-4 flex items-center gap-2" :as="nav.isFolder ? 'button' : NuxtLink"
            :to="nav.isUrl ? nav.url : nav.path" @click="handleNavClick(nav)">
            <Icon :name="nav.icon" />
            {{ nav.name }}
          </NavigationMenu.Trigger>
          <NavigationMenu.Content class="absolute top-0 left-0 w-full sm:w-auto">
            <NavigationMenu.Sub v-if="nav.children">
              <NavigationMenu.List class="flex flex-col justify-center">
                <NavigationMenu.Item v-for="chiNav in nav.children">
                  <NavigationMenu.Trigger class="p-4 flex items-center gap-2" :as="chiNav.isFolder ? 'button' : NuxtLink"
                    :to="chiNav.isUrl ? chiNav.url : chiNav.path" @click="handleNavClick(chiNav)">
                    <Icon :name="chiNav.icon" />
                    {{ chiNav.name }}
                  </NavigationMenu.Trigger>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Sub>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Indicator
          class="absolute top-0 h-full border rounded-xl w-(--reka-navigation-menu-indicator-size) left-(--reka-navigation-menu-indicator-position) transition-[width,left]">
        </NavigationMenu.Indicator>
      </NavigationMenu.List>
      <div class="perspective-[2000px] absolute top-full left-0 flex w-full">
        <NavigationMenu.Viewport
          class="data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative left-(--reka-navigation-menu-viewport-left) mt-2.5 h-(--reka-navigation-menu-viewport-height) w-full origin-[top_center] overflow-hidden rounded-xl bg-white transition-[width,height,left] duration-300 sm:w-(--reka-navigation-menu-viewport-width) shadow-sm" />
      </div>
    </NavigationMenu.Root>
    <div class="flex items-center gap-4 relative">
      <button class="h-8 w-8 flex items-center justify-center" @click="openLogin">
        <Icon name="tabler:edit-circle" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NavigationMenu } from 'reka-ui/namespaced';
import { NuxtLink } from '#components'

interface NavLink {
  name: string
  icon: string
  path?: string
  url?: string
  isFolder: boolean
  isUrl: boolean
  children?: NavLink[]
}
const NavLinks: NavLink[] = [
  { name: '首页', icon: 'tabler:home', path: '/', isFolder: false, isUrl: false },
  {
    name: '文章', icon: 'tabler:folders', isFolder: true, isUrl: false, children: [
      { name: '文章列表', icon: 'tabler:list', path: '/list', isFolder: false, isUrl: false },
      { name: '归档', icon: 'tabler:archive', path: '/archive', isFolder: false, isUrl: false },
      { name: '分类', icon: 'tabler:folders', path: '/category', isFolder: false, isUrl: false },
      { name: '新建文章', icon: 'tabler:file-plus', path: '/post/write', isFolder: false, isUrl: false },
    ]
  },
  {
    name: '我的', icon: 'tabler:user', isFolder: true, isUrl: false, children: [
      { name: '日记', icon: 'tabler:notebook', path: '/diary', isFolder: false, isUrl: false },
      { name: '图库', icon: 'tabler:photo', path: '/gallery', isFolder: false, isUrl: false },
      { name: '赞助', icon: 'tabler:heart', path: '/sponsor', isFolder: false, isUrl: false },
      { name: '关于', icon: 'tabler:info-circle', path: '/about', isFolder: false, isUrl: false },
    ]
  },
  {
    name: '社交', icon: 'tabler:social', isFolder: true, isUrl: false, children: [
      { name: '友链', icon: 'tabler:link', path: '/friendlink', isFolder: false, isUrl: false },
      { name: '留言', icon: 'tabler:message', path: '/guestbook', isFolder: false, isUrl: false },
    ]
  },
  { name: '主站', icon: 'tabler:sitemap', url: 'https://olivetint.com', isFolder: false, isUrl: true },
]

const currentNavValue = ref<string>('');

const handleNavClick = (nav: NavLink) => {
  // 如果是叶子节点（没有子菜单），点击后清空导航
  if (!nav.children || nav.children.length === 0) {
    currentNavValue.value = '';
  }
};
const { openLogin } = useAuth()
</script>