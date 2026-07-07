<template>
  <div class="AppHeader">
    <!-- 电脑导航 -->
    <div class="flex justify-center">
      <div
        class="hidden md:flex items-center justify-between transition-[flex-grow] duration-500 py-4 px-10"
        :class="isShorten ? ' grow-0' : ' grow'"
      >
        <NuxtLink
          class="flex items-center text-nowrap relative"
          to="/"
          @click="scrollToTop"
        >
          <NuxtImg
            alt="头像"
            class="h-10 w-10 object-cover rounded-full scale-150"
            src="/小小波奇_透明.png"
          />
          <span
            class="absolute left-full text-xl font-bold transition-[opacity,scale] duration-600 origin-[left_center]"
            :class="isShorten ? 'opacity-0 scale-0' : 'opacity-100 scale-100'"
            >olive的博客</span
          >
        </NuxtLink>
        <NavigationMenu.Root
          v-model="currentNavValue"
          class="relative text-nowrap"
          disable-hover-trigger
          disable-pointer-leave-close
        >
          <NavigationMenu.List class="flex justify-between items-center">
            <NavigationMenu.Item
              v-for="nav in NavLinks"
              :key="nav.name"
              class="flex items-center"
              :value="nav.name"
            >
              <NavigationMenu.Trigger
                :as="nav.isFolder ? 'button' : NuxtLink"
                class="p-4 flex items-center gap-2"
                :to="nav.isUrl ? nav.url : nav.path"
                @click="handleNavClick(nav)"
              >
                <Icon :name="nav.icon" />
                {{ nav.name }}
              </NavigationMenu.Trigger>
              <NavigationMenu.Content class="absolute top-0 left-0 w-full sm:w-auto">
                <NavigationMenu.Sub v-if="nav.children">
                  <NavigationMenu.List class="flex flex-col justify-center">
                    <NavigationMenu.Item
                      v-for="chiNav in nav.children"
                      :key="chiNav.name"
                    >
                      <NavigationMenu.Trigger
                        :as="chiNav.isFolder ? 'button' : NuxtLink"
                        class="p-4 flex items-center gap-2"
                        :to="chiNav.isUrl ? chiNav.url : chiNav.path"
                        @click="handleNavClick(chiNav)"
                      >
                        <Icon :name="chiNav.icon" />
                        {{ chiNav.name }}
                      </NavigationMenu.Trigger>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </NavigationMenu.Sub>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Indicator
              class="absolute top-0 h-full border rounded-xl w-(--reka-navigation-menu-indicator-size) left-(--reka-navigation-menu-indicator-position) transition-[width,left]"
            >
            </NavigationMenu.Indicator>
          </NavigationMenu.List>
          <div class="perspective-[2000px] absolute top-full left-0 flex w-full">
            <NavigationMenu.Viewport
              class="data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out relative left-(--reka-navigation-menu-viewport-left) mt-2.5 h-(--reka-navigation-menu-viewport-height) w-full origin-[top_center] overflow-hidden rounded-xl bg-white transition-[width,height,left] duration-300 sm:w-(--reka-navigation-menu-viewport-width) shadow-sm"
            />
          </div>
        </NavigationMenu.Root>
        <div class="flex items-center gap-4 relative">
          <ThemeToggle class="h-8 w-8" />
          <button
            aria-label="Sign in"
            class="h-8 w-8 flex items-center justify-center"
            @click="openLogin"
          >
            <Icon
              name="tabler:login"
              size="24"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- 手机导航 -->
    <div class="md:hidden flex justify-between py-4 px-4">
      <Drawer.Root swipe-direction="up">
        <Drawer.Trigger>
          <Icon
            name="tabler:align-justified"
            size="32"
          />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay class="DrawerOverlay fixed inset-0 z-30 bg-black/40" />
          <Drawer.Content
            class="DrawerContent fixed inset-x-0 top-0 z-100 mx-auto flex max-w-125 flex-col rounded-b-2xl bg-white outline-none p-6"
          >
            <VisuallyHidden>
              <Drawer.Title>导航栏</Drawer.Title>
            </VisuallyHidden>
            <Accordion.Root as="ul">
              <template
                v-for="nav in NavLinks"
                :key="nav.name"
              >
                <Accordion.Item
                  as="li"
                  :value="nav.name"
                >
                  <component
                    :is="nav.isFolder ? Accordion.Trigger : Drawer.Close"
                    :as="nav.isFolder ? 'button' : NuxtLink"
                    class="p-4 w-full flex items-center justify-between gap-2"
                    :to="nav.isUrl ? nav.url : nav.path"
                    @click="handleNavClick(nav)"
                  >
                    {{ nav.name }}
                    <Icon :name="nav.icon" />
                  </component>
                  <Accordion.Content>
                    <Accordion.Root as="ul">
                      <template
                        v-for="chiNav in nav.children"
                        :key="chiNav.name"
                      >
                        <Accordion.Item
                          as="li"
                          :value="chiNav.name"
                        >
                          <component
                            :is="chiNav.isFolder ? Accordion.Trigger : Drawer.Close"
                            :as="chiNav.isFolder ? 'button' : NuxtLink"
                            class="p-2 px-8 w-full flex items-center justify-between gap-2"
                            :to="chiNav.isUrl ? chiNav.url : chiNav.path"
                            @click="handleNavClick(chiNav)"
                          >
                            {{ chiNav.name }}
                            <Icon :name="chiNav.icon" />
                          </component>
                        </Accordion.Item>
                      </template>
                    </Accordion.Root>
                  </Accordion.Content>
                </Accordion.Item>
              </template>
            </Accordion.Root>
            <Drawer.Handle class="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-zinc-700" />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <NuxtLink
        class="flex items-center text-nowrap relative"
        to="/"
        @click="scrollToTop"
      >
        <NuxtImg
          alt="头像"
          class="h-10 w-10 object-cover rounded-full scale-150"
          src="/小小波奇_透明.png"
        />
        <span class="text-xl font-bold">olive的博客</span>
      </NuxtLink>
      <div class="flex items-center gap-4 relative">
        <ThemeToggle />
        <button
          class="h-8 w-8 flex items-center justify-center"
          @click="openLogin"
        >
          <Icon
            name="tabler:login"
            size="24"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { VisuallyHidden } from 'reka-ui'
  import { Accordion, Drawer, NavigationMenu } from 'reka-ui/namespaced'
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
      name: '文章',
      icon: 'tabler:folders',
      isFolder: true,
      isUrl: false,
      children: [
        { name: '文章列表', icon: 'tabler:list', path: '/list', isFolder: false, isUrl: false },
        { name: '归档', icon: 'tabler:archive', path: '/archive', isFolder: false, isUrl: false },
        { name: '分类', icon: 'tabler:folders', path: '/category', isFolder: false, isUrl: false },
        {
          name: '新建文章',
          icon: 'tabler:file-plus',
          path: '/post/write',
          isFolder: false,
          isUrl: false,
        },
      ],
    },
    {
      name: '我的',
      icon: 'tabler:user',
      isFolder: true,
      isUrl: false,
      children: [
        { name: '日记', icon: 'tabler:notebook', path: '/diary', isFolder: false, isUrl: false },
        { name: '图库', icon: 'tabler:photo', path: '/gallery', isFolder: false, isUrl: false },
        { name: '赞助', icon: 'tabler:heart', path: '/sponsor', isFolder: false, isUrl: false },
        { name: '关于', icon: 'tabler:info-circle', path: '/about', isFolder: false, isUrl: false },
      ],
    },
    {
      name: '社交',
      icon: 'tabler:mood-tongue',
      isFolder: true,
      isUrl: false,
      children: [
        { name: '友链', icon: 'tabler:link', path: '/friendlink', isFolder: false, isUrl: false },
        { name: '留言', icon: 'tabler:message', path: '/guestbook', isFolder: false, isUrl: false },
      ],
    },
    {
      name: '主站',
      icon: 'tabler:sitemap',
      url: 'https://olivetint.com',
      isFolder: false,
      isUrl: true,
    },
  ]

  const currentNavValue = ref<string>('')

  const handleNavClick = (nav: NavLink) => {
    // 如果是叶子节点（没有子菜单），点击后清空导航
    if (!nav.children || nav.children.length === 0) {
      currentNavValue.value = ''
    }
  }
  const { openLogin } = useAuth()

  const { y } = useWindowScroll()
  const isShorten = computed(() => y.value > 100)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<style scoped>
  .DrawerOverlay[data-state='open'] {
    animation: drawer-overlay-in 450ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .DrawerOverlay[data-state='closed'] {
    animation: drawer-overlay-out 450ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .DrawerContent {
    /* `--drawer-swipe-movement-y` is written by DrawerContent while dragging. */
    transform: translateY(var(--drawer-swipe-movement-y, 0px));
    transition: transform 450ms cubic-bezier(0.32, 0.72, 0, 1);
    will-change: transform;
  }

  /* Enter/exit keyframes animate the independent `translate` property so they
   compose with the inline `transform` carrying the live drag offset. */
  .DrawerContent[data-state='open'] {
    animation: drawer-slide-bottom-in 450ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .DrawerContent[data-state='closed'] {
    animation: drawer-slide-bottom-out 450ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  /* Silence the transform transition during an active drag so it tracks the
   pointer in real time. */
  .DrawerContent[data-swiping] {
    transition-duration: 0ms;
    user-select: none;
  }

  @keyframes drawer-overlay-in {
    from {
      opacity: 0;
    }
  }

  @keyframes drawer-overlay-out {
    to {
      opacity: 0;
    }
  }

  @keyframes drawer-slide-bottom-in {
    from {
      translate: 0 -100%;
    }
  }

  @keyframes drawer-slide-bottom-out {
    to {
      translate: 0 -100%;
    }
  }
</style>
