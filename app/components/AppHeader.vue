<template>
  <div class="AppHeader flex items-center justify-between p-4 ">
    <div class="flex items-center">
      <img src="/小小波奇_透明.png" alt="头像" class="h-10 w-10" />
      <span class="ml-2 text-xl font-bold">olive的博客</span>
    </div>
    <NavigationMenu.Root class="relative text-nowrap" disableHoverTrigger disablePointerLeaveClose>
      <NavigationMenu.List class="flex justify-between items-center">
        <NavigationMenu.Item class="flex items-center" v-for="nav in NavLinks" :key="nav.name" :value="nav.name">
          <NavigationMenu.Trigger class="p-4 flex items-center gap-2 data-[state=open]:bg-accent"
            :as="nav.isUrl ? 'a' : nav.isFolder ? undefined : RouterLink" :href="nav.isUrl ? nav.url : undefined"
            :to="!nav.isUrl && !nav.isFolder ? nav.path : undefined">
            <Icon :name="nav.icon" />
            {{ nav.name }}
          </NavigationMenu.Trigger>
          <NavigationMenu.Content class="absolute top-0 left-0 w-full sm:w-auto" >
            <NavigationMenu.Sub v-if="nav.children">
              <NavigationMenu.List class="flex flex-col justify-center">
                <NavigationMenu.Item v-for="navv in nav.children">
                  <NavigationMenu.Trigger class="p-4 flex items-center gap-2" v-if="navv.isFolder">
                    <Icon :name="navv.icon" />{{ navv.name }}
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Link class="p-4 flex items-center gap-2" v-else-if="navv.isUrl" :href="navv.url">
                    <Icon :name="navv.icon" />{{ navv.name }}
                  </NavigationMenu.Link>
                  <NavigationMenu.Link class="p-4 flex items-center gap-2" v-else :as="RouterLink" :to="navv.path">
                    <Icon :name="navv.icon" />{{ navv.name }}
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Sub>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Indicator
          class="absolute bg-black h-px w-(--reka-navigation-menu-indicator-size) left-(--reka-navigation-menu-indicator-position) transition-[width,left]">
        </NavigationMenu.Indicator>
      </NavigationMenu.List>
      <div class="perspective-[2000px] absolute top-full left-0 flex w-full">
        <NavigationMenu.Viewport
          class="data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative left-(--reka-navigation-menu-viewport-left) mt-2.5 h-(--reka-navigation-menu-viewport-height) w-full origin-[top_center] overflow-hidden rounded-xl bg-white transition-[width,height,left] duration-300 sm:w-(--reka-navigation-menu-viewport-width) shadow-sm" />
      </div>
    </NavigationMenu.Root>
    <div>工具栏</div>
  </div>
</template>

<script setup lang="ts">
import { NavigationMenu } from 'reka-ui/namespaced';
import { RouterLink } from 'vue-router';

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
      { name: '新建文章', icon: 'tabler:file-plus', path: '/write', isFolder: false, isUrl: false },
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
</script>