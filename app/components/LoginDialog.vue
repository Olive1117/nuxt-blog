<template>
    <Dialog.Root v-model:open="showLoginDialog">
        <Dialog.Portal>
            <Dialog.Overlay class="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
            <Dialog.Content
                class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[85vh] rounded-xl bg-white shadow-xl focus:outline-none z-100">
                <VisuallyHidden as-child>
                    <Dialog.Title>登录</Dialog.Title>
                </VisuallyHidden>
                <VisuallyHidden as-child>
                    <Dialog.Description>用于启用编辑状态</Dialog.Description>
                </VisuallyHidden>
                <Tabs.Root class="flex flex-col" defaultValue="pwd">
                    <Tabs.List class="relative border-b flex" aria-label="Manage your account">
                        <Tabs.Indicator
                            class="absolute px-8 left-0 h-0.5 bottom-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) translate-y-px rounded-full transition-[width,transform] duration-300">
                            <div class="bg-black w-full h-full" />
                        </Tabs.Indicator>
                        <Tabs.Trigger class="flex-1 py-3" value="pwd">密码</Tabs.Trigger>
                        <Separator class="bg-black w-px self-stretch" decorative orientation="vertical" />
                        <Tabs.Trigger class="flex-1 py-3" value="otp">验证码</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content class="p-4" value="pwd">
                        <form class="flex flex-col items-center gap-4" @submit.prevent="handleLogin">
                            <fieldset class="flex flex-col items-start gap-2">
                                <Label for="username">账号</Label>
                                <input class="border outline-none rounded-lg px-4 h-8" v-model="form.username"
                                    id="username" type="text">
                            </fieldset>
                            <fieldset class="flex flex-col item-start gap-2">
                                <Label for="password">密码</Label>
                                <input class="border outline-none rounded-lg px-4 h-8 " v-model="form.password"
                                    id="password" type="password">
                            </fieldset>
                            <button class="px-4 border rounded" type="submit">登录</button>
                        </form>
                    </Tabs.Content>
                    <Tabs.Content class="p-4" value="otp">
                        <div class="flex flex-col item-start gap-2">
                            <Label for="otpInp" class="text-stone-700">
                                一次性验证码
                            </Label>
                            <PinInput.Root class="flex gap-2 items-center" id="otpInp" placeholder="○">
                                <PinInput.Input v-for="(id, index) in 5" :key="id" :index="index"
                                    class="w-10 h-10 bg-white rounded-xl text-center shadow-sm border placeholder:text-xl focus:shadow-[0_0_0_2px] focus:shadow-stone-400 outline-none" />
                            </PinInput.Root>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
                <!-- <Dialog.Close class="absolute top-0 right-0 h-12 w-12 border flex items-center justify-center rounded-bl-xl rounded-tr-xl bg-white" aria-label="Close">
              <Icon aria-hidden="true" name="tabler:x" />
            </Dialog.Close> -->
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
</template>

<script setup lang="ts">
import { Separator, VisuallyHidden, Label } from 'reka-ui'
import { Dialog, PinInput, Tabs } from 'reka-ui/namespaced';
const { showLoginDialog, login } = useAuth()
const form = ref<{ username: string, password: string }>({
    username: '',
    password: ''
})
const handleLogin = () => {
    login(form.value)
}
</script>