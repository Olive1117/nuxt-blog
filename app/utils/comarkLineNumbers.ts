import { defineComarkPlugin } from 'comark'
import type Token from 'markdown-it/lib/token.mjs'

export default defineComarkPlugin(() => ({
  name: 'line',
  post(state) {
    console.debug(state.markdown)
    console.debug(state.tokens)
    console.debug(state.tree)

    function getFrontmatterLineOffset(markdown: string): number {
      if (!markdown.startsWith('---')) return 0

      const secondDashIndex = markdown.indexOf('---', 3)
      if (secondDashIndex === -1) return 0

      // 截取 Frontmatter 这一段文本
      const frontmatterPart = markdown.slice(0, secondDashIndex + 3)

      // 统计换行符
      let lineCount = 0
      for (let i = 0; i < frontmatterPart.length; i++) {
        if (frontmatterPart[i] === '\n') {
          lineCount++
        }
      }

      return lineCount
    }
    // 来自于
    // https://github.com/comarkdown/comark/blob/main/packages/comark/src/internal/parse/token-processor.ts#L287
    // Mapping from token types to tag names
    const BLOCK_TAG_MAP: Record<string, string> = {
      blockquote_open: 'blockquote',
      ordered_list_open: 'ol',
      bullet_list_open: 'ul',
      list_item_open: 'li',
      paragraph_open: 'p',
      table_open: 'table',
      thead_open: 'thead',
      tbody_open: 'tbody',
      tr_open: 'tr',
      th_open: 'th',
      td_open: 'td',
    }
    function isTokenMatchNode(token: Token, tag: string): boolean {
      if (token.type === 'hr' && tag === token.type) return true
      if (token.type === 'mdc_block_open' && (tag === token.tag || tag === 'component')) return true
      if (token.type === 'mdc_block_shorthand' && (tag === token.tag || tag === 'component'))
        return true
      if (token.type === 'math_block' && tag === 'math') return true
      if (
        (token.type === 'fence' ||
          token.type === 'fenced_code_block' ||
          token.type === 'code_block') &&
        tag === 'pre'
      )
        return true
      if (token.type === 'heading_open') {
        const level = Number.parseInt(token.tag.replace('h', ''), 10)
        const headingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
        if (tag === headingTag) return true
      }
      if (token.type === 'list_item_open' && tag === 'li') return true
      // Handle generic block-level open/close pairs (includes blockquote, lists, tables, etc.)
      const tagName = BLOCK_TAG_MAP[token.type]
      if (tagName && tag === tagName) return true
      const componentName = token.tag || 'component'
      if (componentName === tag) return true
      return false
    }

    const astNodes = state.tree.nodes
    const tokens = state.tokens as Token[]
    const lineOffset = getFrontmatterLineOffset(state.markdown || '')

    let nodeIdx = 0
    let tokenIdx = 0
    let resolvedLine = -1
    for (; tokenIdx < tokens.length && nodeIdx < astNodes.length; tokenIdx++) {
      const token = tokens[tokenIdx]!
      if (token.type.endsWith('_close') || token.type === 'inline' || token.type === 'text') {
        continue
      }
      let startLine: number | '未知行' = '未知行'
      if (token.map) {
        startLine = token.map[0] + lineOffset
      }
      if (startLine === resolvedLine) continue
      console.debug('token循环', tokenIdx, token)
      const node = astNodes[nodeIdx]!
      if (!Array.isArray(node)) {
        nodeIdx++
        continue
      }
      const nodeTag = node[0]!
      if (isTokenMatchNode(token, nodeTag)) {
        node[1]['data-line'] = startLine
        if (startLine !== '未知行') resolvedLine = startLine
        console.debug(resolvedLine, '匹配', tokenIdx, node)
        nodeIdx++
        continue
      }
    }
  },
}))
