import { createParse } from '@comark/nuxt/parse'
import emoji from '@comark/nuxt/plugins/emoji'
import highlight from '@comark/nuxt/plugins/highlight'
import summary from '@comark/nuxt/plugins/summary'
import toc from '@comark/nuxt/plugins/toc'
import githubDark from '@shikijs/themes/github-dark'
import githubLight from '@shikijs/themes/github-light'
import go from '@shikijs/langs/go'
import python from '@shikijs/langs/python'
import docker from '@shikijs/langs/docker'
import json from '@shikijs/langs/json'
import ts from '@shikijs/langs/ts'
import js from '@shikijs/langs/js'
import vue from '@shikijs/langs/vue'
import bash from '@shikijs/langs/bash'
import html from '@shikijs/langs/html'
import css from '@shikijs/langs/css'
import scss from '@shikijs/langs/scss'

const parse = createParse({
  plugins: [
    highlight({
      themes: { light: githubLight, dark: githubDark },
      languages: [go, python, docker, json, ts, js, vue, bash, html, css, scss],
    }),
    emoji(),
    toc(),
    summary(),
  ],
})

export default parse
